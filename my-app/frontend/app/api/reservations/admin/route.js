import { NextResponse } from "next/server";
import Reservation from "@/lib/models/Reservation.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const status = searchParams.get("status") || "";
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const reservations = await Reservation.find(query)
      .populate("user", "name email membershipId")
      .populate("book", "title author isbn category price coverImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Reservation.countDocuments(query);

    const pendingCount = await Reservation.countDocuments({ status: "pending" });
    const confirmedCount = await Reservation.countDocuments({ status: "confirmed" });
    const cancelledCount = await Reservation.countDocuments({ status: "cancelled" });

    return NextResponse.json({
      success: true,
      reservations,
      stats: { total, pendingCount, confirmedCount, cancelledCount },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch reservations", error: error.message }, { status: 500 });
  }
}
