import { NextResponse } from "next/server";
import Borrowing from "@/lib/models/Borrowing.js";
import Book from "@/lib/models/Book.js";
import User from "@/lib/models/User.js";
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

    borrowing.returnDate = new Date();
    borrowing.status = "returned";
    borrowing.lateFee = borrowing.calculateLateFee();
    await borrowing.save();

    const book = await Book.findById(borrowing.book._id);
    book.availableCopies += 1;
    await book.save();

    const userData = await User.findById(user._id);
    userData.booksReturned += 1;
    userData.currentlyBorrowed -= 1;
    await userData.save();

    return NextResponse.json({ success: true, borrowing });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to return book", error: error.message },
      { status: 500 }
    );
  }
}
