import { Router } from "express";
import {
  register, login, logout, session, changePassword, adminLogin,
  googleAuth, googleAuthCallback,
  facebookAuth, facebookAuthCallback,
  instagramAuth, instagramAuthCallback,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/session", session);
router.put("/change-password", protect, changePassword);
router.post("/admin-login", adminLogin);

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

router.get("/facebook", facebookAuth);
router.get("/facebook/callback", facebookAuthCallback);

router.get("/instagram", instagramAuth);
router.get("/instagram/callback", instagramAuthCallback);

export default router;
