import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { createToken, getUserFromToken } from "../middleware/auth.js";
import { emitNotification } from "../config/socket.js";
import passport from "passport";
import { sendSocialAuthResponse } from "../config/passport.js";

export async function register(req, res) {
  try {
    const { name, username, email, password, phone, address, studentId } = req.body;

    if (!name || !password) {
      return res.status(400).json({ success: false, message: "Name and password are required" });
    }

    if (!email && !phone) {
      return res.status(400).json({ success: false, message: "Email or phone number is required" });
    }

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists with this email" });
      }
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({ success: false, message: "User already exists with this phone number" });
      }
    }

    if (username) {
      const existingUsername = await User.findOne({ username: username.toLowerCase().trim() });
      if (existingUsername) {
        return res.status(400).json({ success: false, message: "Username already taken" });
      }
    }

    const user = new User({
      name,
      username: username ? username.toLowerCase().trim() : undefined,
      email: email || "",
      password,
      phone: phone || "",
      address: address || "",
      studentId: studentId || "",
    });

    user.generateMembershipId();
    await user.save();

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const notif = new Notification({
      title: "New User Registration",
      message: `${user.name} (${user.email || user.phone}) has registered.`,
      type: "info",
      action: "user_registered",
      relatedUser: user._id,
      targetRole: "admin",
    });
    await notif.save();
    await emitNotification(notif);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        studentId: user.studentId,
        membershipId: user.membershipId,
        membershipType: user.membershipType,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password, phone, username } = req.body;

    if ((!email && !phone && !username) || !password) {
      return res.status(400).json({ success: false, message: "Email/Username/Phone and password are required" });
    }

    let user;
    if (email) {
      const emailLower = email.toLowerCase().trim();
      user = await User.findOne({ email: emailLower }).select("+password");
    } else if (phone) {
      user = await User.findOne({ phone: phone.trim() }).select("+password");
    } else if (username) {
      user = await User.findOne({ username: username.toLowerCase().trim() }).select("+password");
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account is deactivated" });
    }

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        studentId: user.studentId,
        membershipId: user.membershipId,
        membershipType: user.membershipType,
        membershipExpiry: user.membershipExpiry,
        role: user.role,
        profileImage: user.profileImage,
        booksBorrowed: user.booksBorrowed,
        booksReturned: user.booksReturned,
        currentlyBorrowed: user.currentlyBorrowed,
        reservations: user.reservations,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
}

export async function logout(req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  res.json({ success: true, message: "Logged out successfully" });
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    const pwNotif = new Notification({
      title: "Password Changed",
      message: `${user.name} changed their password.`,
      type: "warning",
      action: "password_changed",
      relatedUser: user._id,
      targetRole: "admin",
    });
    await pwNotif.save();
    await emitNotification(pwNotif);

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to change password", error: error.message });
  }
}

export async function adminLogin(req, res) {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const adminPassword = process.env.ADMIN_PASSWORD || "kunjan1122";

    if (password !== adminPassword) {
      return res.status(401).json({ success: false, message: "Invalid admin password" });
    }

    let admin = await User.findOne({ role: "admin" });

    if (!admin) {
      const adminEmail = "admin@librivista.com";
      admin = await User.findOne({ email: adminEmail });
      if (!admin) {
        admin = new User({
          name: "Admin",
          email: adminEmail,
          password: adminPassword,
          role: "admin",
          phone: "",
          address: "",
        });
        admin.generateMembershipId();
        await admin.save();
      } else {
        admin.role = "admin";
        await admin.save();
      }
    }

    const token = createToken(admin);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        membershipId: admin.membershipId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Admin login failed", error: error.message });
  }
}

export async function session(req, res) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    const user = await getUserFromToken(token);

    if (!user) {
      return res.json({ success: true, user: null });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        studentId: user.studentId,
        membershipId: user.membershipId,
        membershipType: user.membershipType,
        membershipExpiry: user.membershipExpiry,
        role: user.role,
        booksBorrowed: user.booksBorrowed,
        booksReturned: user.booksReturned,
        currentlyBorrowed: user.currentlyBorrowed,
        reservations: user.reservations,
        wishlist: user.wishlist,
        notifications: user.notifications,
        profileImage: user.profileImage,
        profileCompletion: user.getProfileCompletion(),
        createdAt: user.createdAt,
      },
    });
  } catch {
    res.json({ success: true, user: null });
  }
}

export function googleAuth(req, res, next) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=google_not_configured`);
  }
  const authenticator = passport.authenticate("google", { scope: ["profile", "email"] });
  authenticator(req, res, next);
}

export function googleAuthCallback(req, res, next) {
  const authenticator = passport.authenticate("google", { session: false }, (err, data) => {
    if (err || !data) {
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=google_auth_failed`);
    }
    sendSocialAuthResponse(res, data.user, data.token, `${process.env.FRONTEND_URL || "http://localhost:3000"}/account`);
  });
  authenticator(req, res, next);
}

export function facebookAuth(req, res, next) {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=facebook_not_configured`);
  }
  const authenticator = passport.authenticate("facebook", { scope: ["email", "public_profile"] });
  authenticator(req, res, next);
}

export function facebookAuthCallback(req, res, next) {
  const authenticator = passport.authenticate("facebook", { session: false }, (err, data) => {
    if (err || !data) {
      return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=facebook_auth_failed`);
    }
    sendSocialAuthResponse(res, data.user, data.token, `${process.env.FRONTEND_URL || "http://localhost:3000"}/account`);
  });
  authenticator(req, res, next);
}

export function instagramAuth(req, res) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const redirectUri = process.env.INSTAGRAM_CALLBACK_URL || "http://localhost:5000/api/v1/auth/instagram/callback";
  if (!clientId) {
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=instagram_not_configured`);
  }
  const url = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile&response_type=code`;
  res.redirect(url);
}

export async function instagramAuthCallback(req, res) {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=instagram_auth_failed`);
  }
  try {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    const redirectUri = process.env.INSTAGRAM_CALLBACK_URL || "http://localhost:5000/api/v1/auth/instagram/callback";
    const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.redirect(`${frontendUrl}/login?error=instagram_auth_failed`);
    }
    const userRes = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`);
    const profile = await userRes.json();
    const email = `${profile.id}@instagram-user.com`;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: profile.username || "Instagram User",
        email,
        password: `instagram_${profile.id}_${Date.now()}`,
        phone: "",
      });
      user.generateMembershipId();
      await user.save();
    }
    const token = createToken(user);
    sendSocialAuthResponse(res, user, token, `${frontendUrl}/account`);
  } catch {
    res.redirect(`${frontendUrl}/login?error=instagram_auth_failed`);
  }
}
