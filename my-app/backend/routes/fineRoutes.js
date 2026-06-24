import { Router } from "express";
import {
  getAllFines,
  getUserFines,
  payFine,
  waiveFine,
  getFineStats,
} from "../controllers/fineController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/stats", protect, adminOnly, getFineStats);
router.get("/", protect, adminOnly, getAllFines);
router.get("/user/:userId", protect, getUserFines);
router.get("/my", protect, getUserFines);
router.put("/:id/pay", protect, payFine);
router.put("/:id/waive", protect, adminOnly, waiveFine);

export default router;
