import { NextResponse } from "next/server";
import Borrowing from "@/lib/models/Borrowing.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function PUT(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { borrowingId, extraDays = 7 } = await request.json();

    const borrowing = await Borrowing.findById(borrowingId).populate("book");
    if (!borrowing) {
      return NextResponse.json({ success: false, message: "Borrowing not found" }, { status: 404 });
    }

    if (borrowing.user.toString() !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    if (borrowing.status !== "active") {
      return NextResponse.json({ success: false, message: "Can only renew active borrowings" }, { status: 400 });
    }

    const newDueDate = new Date(borrowing.dueDate);
    newDueDate.setDate(newDueDate.getDate() + extraDays);

    borrowing.dueDate = newDueDate;
    if (!borrowing.notes) borrowing.notes = "";
    borrowing.notes += `[Renewed on ${new Date().toLocaleDateString()} +${extraDays} days] `;
    await borrowing.save();

    const populated = await Borrowing.findById(borrowing._id)
      .populate("book", "title author coverImage category");

    return NextResponse.json({ success: true, borrowing: populated, message: `Due date extended by ${extraDays} days to ${newDueDate.toLocaleDateString()}` });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to renew borrowing", error: error.message }, { status: 500 });
  }
}
