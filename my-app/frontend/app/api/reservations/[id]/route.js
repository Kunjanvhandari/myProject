import { NextResponse } from "next/server";
import Book from "@/lib/models/Book.js";
import Reservation from "@/lib/models/Reservation.js";
import User from "@/lib/models/User.js";
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
    const reservation = await Reservation.findById(id).populate("book");
    if (!reservation) {
      return NextResponse.json({ success: false, message: "Reservation not found" }, { status: 404 });
    }

    if (reservation.user.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    ).populate("book");

    return NextResponse.json({ success: true, reservation: updatedReservation });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update reservation", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = params;
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return NextResponse.json({ success: false, message: "Reservation not found" }, { status: 404 });
    }

    if (reservation.user.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    if (reservation.status === "pending" || reservation.status === "confirmed") {
      await Book.findByIdAndUpdate(reservation.book, { $inc: { availableCopies: 1 } });
    }

    await Reservation.findByIdAndDelete(id);

    await User.findByIdAndUpdate(user._id, { $inc: { reservations: -1 } });

    await Notification.create({
      title: "Reservation Cancelled",
      message: `${user.name} cancelled reservation for "${reservation.book?.title || "a book"}"`,
      type: "warning",
      action: "reservation_cancelled",
      relatedUser: user._id,
      relatedBook: reservation.book,
      targetRole: "admin",
    });

    return NextResponse.json({ success: true, message: "Reservation cancelled successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to cancel reservation", error: error.message },
      { status: 500 }
    );
  }
}
