import { NextResponse } from "next/server";
import Notification from "@/lib/models/Notification.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let query = {};
    if (user.role === "admin") {
      query = {
        $or: [
          { targetRole: "admin" },
          { isGlobal: true },
        ],
        isRead: false,
      };
    } else {
      query = { user: user._id, isRead: false };
    }

    const count = await Notification.countDocuments(query);
    return NextResponse.json({ success: true, count });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to get unread count", error: error.message },
      { status: 500 }
    );
  }
}
