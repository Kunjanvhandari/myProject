import { NextResponse } from "next/server";
import User from "@/lib/models/User.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function GET(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = params;
    const userData = await User.findById(id).select("-password");
    if (!userData) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch user", error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = await getUserFromToken();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { name, email, phone, address, role, isActive, membershipType, membershipExpiry } = body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (membershipType) updateData.membershipType = membershipType;
    if (membershipExpiry) updateData.membershipExpiry = membershipExpiry;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-password");
    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update user", error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await getUserFromToken();
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = params;
    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deactivated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to deactivate user", error: error.message }, { status: 500 });
  }
}
