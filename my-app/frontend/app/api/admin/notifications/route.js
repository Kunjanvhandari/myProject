import { NextResponse } from "next/server";
import Reservation from "@/lib/models/Reservation.js";
import Borrowing from "@/lib/models/Borrowing.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const pendingReservations = await Reservation.find({ status: "pending" })
      .populate("user", "name email phone")
      .populate("book", "title author price")
      .sort({ createdAt: -1 })
      .limit(20);

    const pendingBorrowings = await Borrowing.find({ status: "pending" })
      .populate("user", "name email phone")
      .populate("book", "title author")
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({
      success: true,
      notifications: {
        pendingReservations,
        pendingBorrowings,
        totalPending: pendingReservations.length + pendingBorrowings.length,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch notifications", error: error.message }, { status: 500 });
  }
}
