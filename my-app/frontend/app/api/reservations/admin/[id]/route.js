import { NextResponse } from "next/server";
import Reservation from "@/lib/models/Reservation.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = params;
    const body = await request.json();
    const updateData = {};
    if (body.status) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const reservation = await Reservation.findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .populate("user", "name email")
      .populate("book", "title author");

    if (!reservation) {
      return NextResponse.json({ success: false, message: "Reservation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update reservation", error: error.message }, { status: 500 });
  }
}
