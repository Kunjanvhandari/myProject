import Book from "../models/Book.js";
import User from "../models/User.js";
import Borrowing from "../models/Borrowing.js";

export async function getStats(req, res) {
  try {
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
}
