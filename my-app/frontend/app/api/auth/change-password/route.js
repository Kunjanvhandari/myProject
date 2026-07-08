import { NextResponse } from "next/server";
import User from "@/lib/models/User.js";
import Notification from "@/lib/models/Notification.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function PUT(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: "Current and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, message: "New password must be at least 6 characters" }, { status: 400 });
    }

    const userData = await User.findById(user._id).select("+password");
    if (!userData) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const isMatch = await userData.comparePassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 400 });
    }

    userData.password = newPassword;
    await userData.save();

    await Notification.create({
      title: "Password Changed",
      message: `${userData.name} changed their password.`,
      type: "info",
      action: "password_changed",
      relatedUser: userData._id,
      targetRole: "admin",
    });

    return NextResponse.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to change password", error: error.message }, { status: 500 });
  }
}
