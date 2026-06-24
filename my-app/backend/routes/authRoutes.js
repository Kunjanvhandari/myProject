import { Router } from "express";
import { register, login, logout, session, changePassword, adminLogin } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/session", session);
router.put("/change-password", protect, changePassword);
router.post("/admin-login", adminLogin);

export default router;
