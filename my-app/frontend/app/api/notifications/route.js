import { NextResponse } from "next/server";
import Notification from "@/lib/models/Notification.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (user.role === "admin") {
      query = {
        $or: [
          { targetRole: "admin" },
          { isGlobal: true },
          { user: user._id },
        ],
      };
    } else {
      query = {
        $or: [
          { user: user._id },
          { isGlobal: true },
        ],
      };
    }

    const notifications = await Notification.find(query)
      .populate("relatedUser", "name email profileImage username")
      .populate("relatedBook", "title author coverImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch notifications", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
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
      };
    } else {
      query = { user: user._id };
    }

    await Notification.deleteMany(query);
    return NextResponse.json({ success: true, message: "All notifications cleared" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to clear notifications", error: error.message },
      { status: 500 }
    );
  }
}
