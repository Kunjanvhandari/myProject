import { NextResponse } from "next/server";
import Fine from "@/lib/models/Fine.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const fines = await Fine.find({ user: user._id })
      .populate("book", "title author isbn")
      .populate("borrowing", "borrowDate dueDate returnDate")
      .sort({ createdAt: -1 });

    const totalUnpaid = fines
      .filter((f) => f.status === "unpaid")
      .reduce((sum, f) => sum + f.amount, 0);

    return NextResponse.json({ success: true, fines, totalUnpaid });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch fines", error: error.message }, { status: 500 });
  }
}
