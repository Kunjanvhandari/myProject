import express from "express";
import Book from "../lib/models/Book.js";
import User from "../lib/models/User.js";
import Borrowing from "../lib/models/Borrowing.js";
import { connectDB } from "../lib/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await connectDB();

    const totalBooks = await Book.countDocuments();
    const totalMembers = await User.countDocuments({ role: "user" });
    const activeBorrowings = await Borrowing.countDocuments({ status: "active" });
    const availableBooks = await Book.countDocuments({ status: "available" });

    const recentBorrowings = await Borrowing.find()
      .populate("user", "name email")
      .populate("book", "title author")
      .sort({ createdAt: -1 })
      .limit(10);

    const popularBooks = await Book.find()
      .sort({ borrowCount: -1 })
      .limit(5)
      .select("title author borrowCount coverImage");

    const categoryStats = await Book.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalBooks,
        totalMembers,
        activeBorrowings,
        availableBooks,
      },
      recentBorrowings,
      popularBooks,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stats", error: error.message });
  }
});

export default router;
