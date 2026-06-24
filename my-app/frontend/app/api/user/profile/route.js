import { NextResponse } from "next/server";
import User from "@/lib/models/User.js";
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
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
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

    const { name, phone, address } = await request.json();

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true, runValidators: true }).select("-password");

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update profile", error: error.message },
      { status: 500 }
    );
  }
}
