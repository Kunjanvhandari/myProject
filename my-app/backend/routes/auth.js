import express from "express";
import User from "../lib/models/User.js";
import jwt from "jsonwebtoken";
import { connectDB } from "../lib/db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account is deactivated" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        membershipId: user.membershipId,
        membershipType: user.membershipType,
        membershipExpiry: user.membershipExpiry,
        role: user.role,
        booksBorrowed: user.booksBorrowed,
        booksReturned: user.booksReturned,
        currentlyBorrowed: user.currentlyBorrowed,
        reservations: user.reservations,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    await connectDB();

    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
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
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
  res.json({ success: true, message: "Logged out successfully" });
});

router.get("/session", async (req, res) => {
  try {
    await connectDB();

    const token = req.cookies.token;

    if (!token) {
      return res.json({ success: true, user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return res.json({ success: true, user: null });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        membershipId: user.membershipId,
        membershipType: user.membershipType,
        membershipExpiry: user.membershipExpiry,
        role: user.role,
        booksBorrowed: user.booksBorrowed,
        booksReturned: user.booksReturned,
        currentlyBorrowed: user.currentlyBorrowed,
        reservations: user.reservations,
        wishlist: user.wishlist,
        notifications: user.notifications,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.json({ success: true, user: null });
  }
});

export default router;
