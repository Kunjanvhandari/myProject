import { NextResponse } from "next/server";
import Fine from "@/lib/models/Fine.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function GET(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const fines = await Fine.find({ user: params.id })
      .populate("book", "title author isbn")
      .populate("borrowing", "borrowDate dueDate returnDate")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, fines });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed", error: error.message }, { status: 500 });
  }
}
