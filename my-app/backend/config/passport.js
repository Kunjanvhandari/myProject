import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User.js";
import { createToken } from "../middleware/auth.js";

export function configurePassport(app) {
  app.use(passport.initialize());

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/v1/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await User.findOne({ email: profile.emails?.[0]?.value });
            if (!user) {
              user = await User.create({
                name: profile.displayName,
                email: profile.emails?.[0]?.value || `${profile.id}@google-user.com`,
                password: `google_${profile.id}_${Date.now()}`,
                phone: "",
                profileImage: profile.photos?.[0]?.value || "",
              });
              user.generateMembershipId();
              await user.save();
            } else if (!user.profileImage && profile.photos?.[0]?.value) {
              user.profileImage = profile.photos[0].value;
              await user.save();
            }
            const token = createToken(user);
            return done(null, { user, token });
          } catch (err) {
            return done(err, null);
          }
        }
      )
    );
  }

  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: process.env.FACEBOOK_CALLBACK_URL || "/api/v1/auth/facebook/callback",
          profileFields: ["id", "displayName", "emails", "photos"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value || `${profile.id}@facebook-user.com`;
            let user = await User.findOne({ email });
            if (!user) {
              user = await User.create({
                name: profile.displayName,
                email,
                password: `facebook_${profile.id}_${Date.now()}`,
                phone: "",
                profileImage: profile.photos?.[0]?.value || "",
              });
              user.generateMembershipId();
              await user.save();
            }
            const token = createToken(user);
            return done(null, { user, token });
          } catch (err) {
            return done(err, null);
          }
        }
      )
    );
  }

  return passport;
}

export function sendSocialAuthResponse(res, user, token, redirectUrl) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  res.redirect(redirectUrl || `${process.env.FRONTEND_URL || "http://localhost:3000"}/account`);
}
