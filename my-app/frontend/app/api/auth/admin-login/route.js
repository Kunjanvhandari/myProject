import { NextResponse } from "next/server";
import User from "@/lib/models/User.js";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db.js";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kunjan1122";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Invalid admin password" },
        { status: 401 }
      );
    }

    await connectDB();

    let admin = await User.findOne({ role: "admin" });

    if (!admin) {
      const adminEmail = "admin@librivista.com";
      admin = await User.findOne({ email: adminEmail });
      if (!admin) {
        admin = new User({
          name: "Admin",
          email: adminEmail,
          password: ADMIN_PASSWORD,
          role: "admin",
          phone: "",
          address: "",
        });
        admin.generateMembershipId();
        await admin.save();
      } else {
        admin.role = "admin";
        await admin.save();
      }
    }

    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        membershipId: admin.membershipId,
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
      { success: false, message: "Admin login failed", error: error.message },
      { status: 500 }
    );
  }
}
