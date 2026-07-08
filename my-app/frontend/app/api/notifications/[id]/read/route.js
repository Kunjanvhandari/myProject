import { NextResponse } from "next/server";
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
    const notification = await Notification.findById(params.id);
    if (!notification) {
      return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
    }

    notification.isRead = true;
    await notification.save();

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update notification", error: error.message },
      { status: 500 }
    );
  }
}
