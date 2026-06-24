import { NextResponse } from "next/server";
import User from "@/lib/models/User.js";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db.js";

export async function POST(request) {
  try {
    await connectDB();

    let { name, email, password, phone, address } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    email = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists with this email" },
        { status: 400 }
      );
    }

    const user = new User({
      name,
      email,
      password,
      phone: phone || "",
      address: address || "",
    });

    user.generateMembershipId();
    await user.save();

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
        email: user.email,
        phone: user.phone,
        address: user.address,
        membershipId: user.membershipId,
        membershipType: user.membershipType,
        role: user.role,
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
