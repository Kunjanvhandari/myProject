import { NextResponse } from "next/server";
import Book from "@/lib/models/Book.js";
import User from "@/lib/models/User.js";
import Borrowing from "@/lib/models/Borrowing.js";
import { connectDB } from "@/lib/db.js";

export async function GET() {
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

    return NextResponse.json({
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
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats", error: error.message },
      { status: 500 }
    );
  }
}
