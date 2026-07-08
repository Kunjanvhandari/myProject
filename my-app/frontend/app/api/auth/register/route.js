import { NextResponse } from "next/server";
import User from "@/lib/models/User.js";
import Notification from "@/lib/models/Notification.js";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db.js";

export async function POST(request) {
  try {
    await connectDB();

    let { name, username, email, password, phone, address, studentId } = await request.json();

    if (!name || !password) {
      return NextResponse.json(
        { success: false, message: "Name and password are required" },
        { status: 400 }
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { success: false, message: "Email or phone number is required" },
        { status: 400 }
      );
    }

    if (email) {
      email = email.toLowerCase().trim();
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      }
    }

    if (username) {
      const existingUsername = await User.findOne({ username: username.toLowerCase().trim() });
      if (existingUsername) {
        return NextResponse.json(
          { success: false, message: "Username already taken" },
          { status: 400 }
        );
      }
    }

    const user = new User({
      name,
      username: username ? username.toLowerCase().trim() : undefined,
      email: email || "",
      password,
      phone: phone || "",
      address: address || "",
      studentId: studentId || "",
    });

    user.generateMembershipId();
    await user.save();

    await Notification.create({
      title: "New User Registration",
      message: `${user.name} (${user.email || user.phone}) has registered.`,
      type: "info",
      action: "user_registered",
      relatedUser: user._id,
      targetRole: "admin",
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        studentId: user.studentId,
        membershipId: user.membershipId,
        membershipType: user.membershipType,
        role: user.role,
        profileCompletion: user.getProfileCompletion ? user.getProfileCompletion() : 0,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Registration failed", error: error.message },
      { status: 500 }
    );
  }
}
