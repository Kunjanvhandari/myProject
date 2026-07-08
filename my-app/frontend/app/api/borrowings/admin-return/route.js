import { NextResponse } from "next/server";
import Borrowing from "@/lib/models/Borrowing.js";
import Book from "@/lib/models/Book.js";
import User from "@/lib/models/User.js";
import Fine from "@/lib/models/Fine.js";
import Notification from "@/lib/models/Notification.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function PUT(request) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { borrowingId } = await request.json();

    const borrowing = await Borrowing.findById(borrowingId).populate("book");
    if (!borrowing) {
      return NextResponse.json({ success: false, message: "Borrowing not found" }, { status: 404 });
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

    const userData = await User.findById(borrowing.user);
    userData.booksReturned += 1;
    userData.currentlyBorrowed = Math.max(0, userData.currentlyBorrowed - 1);
    await userData.save();

    const bookTitle = book.title;

    if (borrowing.lateFee > 0) {
      const daysLate = Math.ceil((returnDate - borrowing.dueDate) / (1000 * 60 * 60 * 24));
      await Fine.create({
        borrowing: borrowing._id,
        user: borrowing.user,
        book: borrowing.book._id,
        amount: borrowing.lateFee,
        daysLate,
        ratePerDay: 10,
        status: "unpaid",
        notes: `Late return by ${daysLate} day(s) at Rs.10/day`,
      });

      await Notification.create({
        title: "Fine Generated",
        message: `${userData.name} has a late fee of Rs.${borrowing.lateFee} for "${bookTitle}"`,
        type: "warning",
        action: "fine_generated",
        relatedUser: borrowing.user,
        relatedBook: borrowing.book._id,
        targetRole: "admin",
      });

      await Notification.create({
        user: borrowing.user,
        title: "Late Return Fine",
        message: `You have been fined Rs.${borrowing.lateFee} for late return of "${bookTitle}" (${daysLate} days late)`,
        type: "error",
        action: "fine_generated",
        relatedUser: borrowing.user,
        relatedBook: borrowing.book._id,
        targetRole: "user",
      });
    }

    await Notification.create({
      title: "Book Returned",
      message: `${userData.name} returned "${bookTitle}" (processed by admin)`,
      type: "success",
      action: "book_returned",
      relatedUser: borrowing.user,
      relatedBook: borrowing.book._id,
      targetRole: "admin",
    });

    const populated = await Borrowing.findById(borrowing._id)
      .populate("user", "name email")
      .populate("book", "title author");

    return NextResponse.json({ success: true, borrowing: populated, message: "Book returned successfully by admin" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to return book", error: error.message }, { status: 500 });
  }
}
