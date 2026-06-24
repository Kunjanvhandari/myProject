import { Router } from "express";
import { getBorrowings, createBorrowing, returnBook } from "../controllers/borrowingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getBorrowings);
router.post("/", protect, createBorrowing);
router.put("/:id/return", protect, returnBook);
router.put("/:id/return-admin", protect, adminOnly, returnBook);

export default router;
