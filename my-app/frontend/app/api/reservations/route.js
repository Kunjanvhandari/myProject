import { NextResponse } from "next/server";
import Reservation from "@/lib/models/Reservation.js";
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

    const reservations = await Reservation.find(query)
      .populate("book", "title author coverImage category price")
      .sort({ reservedOn: -1 });

    return NextResponse.json({ success: true, reservations });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch reservations", error: error.message },
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

    const { bookId, paymentMethod = "Cash on Pickup", deliveryFee = 100, discount = 0, deliveryAddress = "" } = await request.json();

    let book;
    try {
      book = await Book.findById(bookId);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid book ID" }, { status: 400 });
    }
    if (!book) {
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 });
    }

    if (book.availableCopies <= 0) {
      return NextResponse.json({ success: false, message: "Book is currently unavailable" }, { status: 400 });
    }

    const reservedOn = new Date();
    const reserveExpiry = new Date();
    reserveExpiry.setHours(reserveExpiry.getHours() + 48);

    const reservation = new Reservation({
      user: user._id,
      book: bookId,
      reservedOn,
      reserveExpiry,
      paymentMethod,
      totalPrice: book.price,
      deliveryFee,
      discount,
      deliveryAddress,
    });

    await reservation.save();

    await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: -1 } });

    await User.findByIdAndUpdate(user._id, { $inc: { reservations: 1 } });

    await Notification.create({
      title: "New Reservation",
      message: `${user.name} reserved "${book.title}"`,
      type: "info",
      action: "book_reserved",
      relatedUser: user._id,
      relatedBook: bookId,
      targetRole: "admin",
    });

    return NextResponse.json({ success: true, reservation }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create reservation", error: error.message },
      { status: 500 }
    );
  }
}
