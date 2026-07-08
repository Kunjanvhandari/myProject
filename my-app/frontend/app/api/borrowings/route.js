import { NextResponse } from "next/server";
import Borrowing from "@/lib/models/Borrowing.js";
import Book from "@/lib/models/Book.js";
import User from "@/lib/models/User.js";
import Notification from "@/lib/models/Notification.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || user._id.toString();
    const status = searchParams.get("status");

    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    const borrowings = await Borrowing.find(query)
      .populate("book", "title author coverImage category")
      .sort({ borrowDate: -1 });

    return NextResponse.json({ success: true, borrowings });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch borrowings", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { bookId, borrowDays = 14 } = await request.json();

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 });
    }

    if (!book.isAvailable()) {
      return NextResponse.json({ success: false, message: "Book is not available" }, { status: 400 });
    }

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + borrowDays);

    const borrowing = new Borrowing({
      user: user._id,
      book: bookId,
      borrowDate,
      dueDate,
    });

    await borrowing.save();

    book.availableCopies -= 1;
    book.borrowCount += 1;
    await book.save();

    const userData = await User.findById(user._id);
    userData.booksBorrowed += 1;
    userData.currentlyBorrowed += 1;
    await userData.save();

    await Notification.create({
      title: "Book Borrowed",
      message: `${userData.name} borrowed "${book.title}"`,
      type: "info",
      action: "book_borrowed",
      relatedUser: user._id,
      relatedBook: bookId,
      targetRole: "admin",
    });

    return NextResponse.json({ success: true, borrowing }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create borrowing", error: error.message },
      { status: 500 }
    );
  }
}
