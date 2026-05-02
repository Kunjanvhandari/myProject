import express from "express";
import Borrowing from "../lib/models/Borrowing.js";
import Book from "../lib/models/Book.js";
import User from "../lib/models/User.js";
import { authenticateToken } from "../middleware/auth.js";
import { connectDB } from "../lib/db.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", async (req, res) => {
  try {
    await connectDB();

    const userId = req.query.userId || req.user.id;
    const status = req.query.status;

    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    const borrowings = await Borrowing.find(query)
      .populate("book", "title author coverImage category")
      .sort({ borrowDate: -1 });

    res.json({ success: true, borrowings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch borrowings", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    await connectDB();

    const { bookId, borrowDays = 14 } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    if (!book.isAvailable()) {
      return res.status(400).json({ success: false, message: "Book is not available" });
    }

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + borrowDays);

    const borrowing = new Borrowing({
      user: req.user.id,
      book: bookId,
      borrowDate,
      dueDate,
    });

    await borrowing.save();

    book.availableCopies -= 1;
    book.borrowCount += 1;
    await book.save();

    const user = await User.findById(req.user.id);
    user.booksBorrowed += 1;
    user.currentlyBorrowed += 1;
    await user.save();

    res.status(201).json({ success: true, borrowing });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create borrowing", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await connectDB();

    const borrowing = await Borrowing.findById(req.params.id).populate("book");
    if (!borrowing) {
      return res.status(404).json({ success: false, message: "Borrowing not found" });
    }

    if (borrowing.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (borrowing.status === "returned") {
      return res.status(400).json({ success: false, message: "Book already returned" });
    }

    borrowing.returnDate = new Date();
    borrowing.status = "returned";
    borrowing.lateFee = borrowing.calculateLateFee();
    await borrowing.save();

    const book = await Book.findById(borrowing.book._id);
    book.availableCopies += 1;
    await book.save();

    const user = await User.findById(req.user.id);
    user.booksReturned += 1;
    user.currentlyBorrowed -= 1;
    await user.save();

    res.json({ success: true, borrowing });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to return book", error: error.message });
  }
});

export default router;
