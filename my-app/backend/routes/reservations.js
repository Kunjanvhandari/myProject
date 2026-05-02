import express from "express";
import Reservation from "../lib/models/Reservation.js";
import Book from "../lib/models/Book.js";
import User from "../lib/models/User.js";
import { authenticateToken } from "../middleware/auth.js";
import { connectDB } from "../lib/db.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", async (req, res) => {
  try {
    await connectDB();

    const userId = req.query.userId || req.user.id;
    const status = req.query.status;

    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    const reservations = await Reservation.find(query)
      .populate("book", "title author coverImage category price")
      .sort({ reservedOn: -1 });

    res.json({ success: true, reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch reservations", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    await connectDB();

    const { bookId, paymentMethod = "Cash on Pickup", deliveryFee = 100, discount = 0, deliveryAddress = "" } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const reservedOn = new Date();
    const reserveExpiry = new Date();
    reserveExpiry.setHours(reserveExpiry.getHours() + 48);

    const reservation = new Reservation({
      user: req.user.id,
      book: bookId,
      reservedOn,
      reserveExpiry,
      paymentMethod,
      totalPrice: book.price,
      deliveryFee,
      discount,
      deliveryAddress,
    });

    await reservation.save();

    // Update user reservations count
    await User.findByIdAndUpdate(req.user.id, { $inc: { reservations: 1 } });

    res.status(201).json({ success: true, reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create reservation", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await connectDB();

    const reservation = await Reservation.findById(req.params.id).populate("book");
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }

    if (reservation.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("book");

    res.json({ success: true, reservation: updatedReservation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update reservation", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await connectDB();

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }

    if (reservation.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Reservation.findByIdAndDelete(req.params.id);

    // Update user reservations count
    await User.findByIdAndUpdate(req.user.id, { $inc: { reservations: -1 } });

    res.json({ success: true, message: "Reservation cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to cancel reservation", error: error.message });
  }
});

export default router;
