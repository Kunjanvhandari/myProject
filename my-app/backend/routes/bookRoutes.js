import { Router } from "express";
import { getBooks, getBookById, createBook, updateBook, deleteBook } from "../controllers/bookController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", protect, adminOnly, createBook);
router.put("/:id", protect, adminOnly, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

export default router;
