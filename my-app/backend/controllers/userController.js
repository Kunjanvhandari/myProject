import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getProfile(req, res) {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        address: req.user.address,
        membershipId: req.user.membershipId,
        membershipType: req.user.membershipType,
        membershipExpiry: req.user.membershipExpiry,
        role: req.user.role,
        booksBorrowed: req.user.booksBorrowed,
        booksReturned: req.user.booksReturned,
        currentlyBorrowed: req.user.currentlyBorrowed,
        reservations: req.user.reservations,
        wishlist: req.user.wishlist,
        notifications: req.user.notifications,
        profileImage: req.user.profileImage,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile", error: error.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, phone, address } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile", error: error.message });
  }
}

export async function uploadProfileImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);

    if (user.profileImage) {
      const oldFileName = user.profileImage.split("/").pop();
      const oldPath = path.join(__dirname, "..", "uploads", "profiles", oldFileName);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: imageUrl },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to upload profile image", error: error.message });
  }
}

export async function getWishlist(req, res) {
  try {
    const userData = await User.findById(req.user._id).populate("wishlist");

    res.json({ success: true, wishlist: userData.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch wishlist", error: error.message });
  }
}

export async function addToWishlist(req, res) {
  try {
    const { bookId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: bookId } },
      { new: true }
    ).populate("wishlist");

    res.json({ success: true, wishlist: updatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add to wishlist", error: error.message });
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const bookId = req.query.bookId;

    if (!bookId) {
      return res.status(400).json({ success: false, message: "Book ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: bookId } },
      { new: true }
    ).populate("wishlist");

    res.json({ success: true, wishlist: updatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove from wishlist", error: error.message });
  }
}
