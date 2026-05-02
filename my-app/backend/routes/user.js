import express from "express";
import User from "../lib/models/User.js";
import { authenticateToken } from "../middleware/auth.js";
import { connectDB } from "../lib/db.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/profile", async (req, res) => {
  try {
    await connectDB();

    const user = await User.findById(req.user.id);

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
    res.status(500).json({ success: false, message: "Failed to fetch profile", error: error.message });
  }
});

router.put("/profile", async (req, res) => {
  try {
    await connectDB();

    const { name, phone, address } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
  }
});

router.get("/wishlist", async (req, res) => {
  try {
    await connectDB();

    const user = await User.findById(req.user.id).populate("wishlist");

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch wishlist", error: error.message });
  }
});

router.post("/wishlist", async (req, res) => {
  try {
    await connectDB();

    const { bookId } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { wishlist: bookId } },
      { new: true }
    ).populate("wishlist");

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add to wishlist", error: error.message });
  }
});

router.delete("/wishlist", async (req, res) => {
  try {
    await connectDB();

    const { bookId } = req.query;

    if (!bookId) {
      return res.status(400).json({ success: false, message: "Book ID is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: bookId } },
      { new: true }
    ).populate("wishlist");

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove from wishlist", error: error.message });
  }
});

export default router;
