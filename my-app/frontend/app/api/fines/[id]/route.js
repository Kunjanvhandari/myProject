import { NextResponse } from "next/server";
import Fine from "@/lib/models/Fine.js";
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
    const body = await request.json();
    const { action } = body;

    const fine = await Fine.findById(id);
    if (!fine) {
      return NextResponse.json({ success: false, message: "Fine not found" }, { status: 404 });
    }

    if (action === "pay") {
      if (fine.user.toString() !== user._id.toString() && user.role !== "admin") {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
      }
      fine.status = "paid";
      fine.paidDate = new Date();
      await fine.save();
      return NextResponse.json({ success: true, fine, message: "Fine paid successfully" });
    }

    if (action === "waive") {
      if (user.role !== "admin") {
        return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
      }
      fine.status = "waived";
      await fine.save();
      return NextResponse.json({ success: true, fine, message: "Fine waived successfully" });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update fine", error: error.message }, { status: 500 });
  }
}
