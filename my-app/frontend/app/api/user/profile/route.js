import { NextResponse } from "next/server";
import User from "@/lib/models/User.js";
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

    const userData = await User.findById(user._id).select("-password");
    if (!userData) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData._id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        studentId: userData.studentId,
        membershipId: userData.membershipId,
        membershipType: userData.membershipType,
        membershipExpiry: userData.membershipExpiry,
        role: userData.role,
        booksBorrowed: userData.booksBorrowed,
        booksReturned: userData.booksReturned,
        currentlyBorrowed: userData.currentlyBorrowed,
        reservations: userData.reservations,
        wishlist: userData.wishlist,
        notifications: userData.notifications,
        profileImage: userData.profileImage,
        profileCompletion: userData.getProfileCompletion ? userData.getProfileCompletion() : 0,
        createdAt: userData.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { name, username, email, phone, address, studentId } = await request.json();

    const updateData = {};
    if (name) updateData.name = name;
    if (username !== undefined) {
      const existing = await User.findOne({ username: username.toLowerCase().trim(), _id: { $ne: user._id } });
      if (existing) {
        return NextResponse.json({ success: false, message: "Username already taken" }, { status: 400 });
      }
      updateData.username = username.toLowerCase().trim();
    }
    if (email !== undefined) {
      const existingEmail = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: user._id } });
      if (existingEmail) {
        return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
      }
      updateData.email = email.toLowerCase().trim();
    }
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (studentId !== undefined) updateData.studentId = studentId;

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true, runValidators: true }).select("-password");

    await Notification.create({
      title: "Profile Updated",
      message: `${updatedUser.name} updated their profile.`,
      type: "info",
      action: "profile_updated",
      relatedUser: updatedUser._id,
      targetRole: "admin",
    });

    const userObj = updatedUser.toObject();
    userObj.profileCompletion = updatedUser.getProfileCompletion ? updatedUser.getProfileCompletion() : 0;

    return NextResponse.json({ success: true, user: userObj });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update profile", error: error.message },
      { status: 500 }
    );
  }
}
