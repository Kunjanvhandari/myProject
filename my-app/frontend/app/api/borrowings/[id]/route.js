import { NextResponse } from "next/server";
import Borrowing from "@/lib/models/Borrowing.js";
import Book from "@/lib/models/Book.js";
import User from "@/lib/models/User.js";
import Fine from "@/lib/models/Fine.js";
import Notification from "@/lib/models/Notification.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = params;
    const borrowing = await Borrowing.findById(id).populate("book");
    if (!borrowing) {
      return NextResponse.json({ success: false, message: "Borrowing not found" }, { status: 404 });
    }

    if (borrowing.user.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    if (borrowing.status === "returned") {
      return NextResponse.json({ success: false, message: "Book already returned" }, { status: 400 });
    }

    const returnDate = new Date();
    borrowing.returnDate = returnDate;
    borrowing.status = "returned";
    borrowing.lateFee = borrowing.calculateLateFee();
    await borrowing.save();

    const book = await Book.findById(borrowing.book._id);
    book.availableCopies += 1;
    if (book.availableCopies > 0 && book.status === "checkedOut") {
      book.status = "available";
    }
    await book.save();

    const userData = await User.findById(user._id);
    userData.booksReturned += 1;
    userData.currentlyBorrowed = Math.max(0, userData.currentlyBorrowed - 1);
    await userData.save();

    if (borrowing.lateFee > 0) {
      const daysLate = Math.ceil((returnDate - borrowing.dueDate) / (1000 * 60 * 60 * 24));
      await Fine.create({
        borrowing: borrowing._id,
        user: user._id,
        book: borrowing.book._id,
        amount: borrowing.lateFee,
        daysLate,
        ratePerDay: 10,
        status: "unpaid",
        notes: `Late return by ${daysLate} day(s) at Rs.10/day`,
      });

      await Notification.create({
        title: "Fine Generated",
        message: `${userData.name} has a late fee of Rs.${borrowing.lateFee} for "${book.title}"`,
        type: "warning",
        action: "fine_generated",
        relatedUser: user._id,
        relatedBook: book._id,
        targetRole: "admin",
      });

      await Notification.create({
        user: user._id,
        title: "Late Return Fine",
        message: `You have been fined Rs.${borrowing.lateFee} for late return of "${book.title}" (${daysLate} days late)`,
        type: "error",
        action: "fine_generated",
        relatedUser: user._id,
        relatedBook: book._id,
        targetRole: "user",
      });
    }

    await Notification.create({
      title: "Book Returned",
      message: `${userData.name} returned "${book.title}"`,
      type: "success",
      action: "book_returned",
      relatedUser: user._id,
      relatedBook: book._id,
      targetRole: "admin",
    });

    return NextResponse.json({ success: true, borrowing });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to return book", error: error.message },
      { status: 500 }
    );
  }
}
