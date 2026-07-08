import { NextResponse } from "next/server";
import User from "@/lib/models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db.js";

export async function POST(request) {
  try {
    await connectDB();

    let { email, password, phone, username } = await request.json();

    if ((!email && !phone && !username) || !password) {
      return NextResponse.json(
        { success: false, message: "Email/Username/Phone and password are required" },
        { status: 400 }
      );
    }

    let user;
    if (email) {
      email = email.toLowerCase().trim();
      user = await User.findOne({ email }).select("+password").lean();
    } else if (phone) {
      user = await User.findOne({ phone: phone.trim() }).select("+password").lean();
    } else if (username) {
      user = await User.findOne({ username: username.toLowerCase().trim() }).select("+password").lean();
    }

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Account is deactivated" },
        { status: 403 }
      );
    }

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
        membershipExpiry: user.membershipExpiry,
        role: user.role,
        profileImage: user.profileImage,
        booksBorrowed: user.booksBorrowed,
        booksReturned: user.booksReturned,
        currentlyBorrowed: user.currentlyBorrowed,
        reservations: user.reservations,
        wishlist: user.wishlist,
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
      { success: false, message: "Login failed", error: error.message },
      { status: 500 }
    );
  }
}
