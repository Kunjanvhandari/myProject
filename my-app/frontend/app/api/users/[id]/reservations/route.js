import { NextResponse } from "next/server";
import Reservation from "@/lib/models/Reservation.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function GET(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const reservations = await Reservation.find({ user: params.id })
      .populate("book", "title author coverImage category price")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, reservations });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed", error: error.message }, { status: 500 });
  }
}
