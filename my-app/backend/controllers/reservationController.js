import Reservation from "../models/Reservation.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Notification from "../models/Notification.js";
import { emitNotification } from "../config/socket.js";
import { sendReservationNotification } from "../config/email.js";

export async function getReservations(req, res) {
  try {
    const userId = req.query.userId || req.user._id.toString();
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
}

export async function createReservation(req, res) {
  try {
    const { bookId, paymentMethod = "Cash on Pickup", deliveryFee = 100, discount = 0, deliveryAddress = "" } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: "Book is currently unavailable" });
    }

    const reservedOn = new Date();
    const reserveExpiry = new Date();
    reserveExpiry.setHours(reserveExpiry.getHours() + 48);

    const reservation = new Reservation({
      user: req.user._id,
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

    await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: -1 } });

    await User.findByIdAndUpdate(req.user._id, { $inc: { reservations: 1 } });

    const bookNotif = new Notification({
      title: "New Reservation",
      message: `${req.user.name} reserved "${book.title}"`,
      type: "info",
      action: "book_reserved",
      relatedUser: req.user._id,
      relatedBook: bookId,
      targetRole: "admin",
    });
    await bookNotif.save();
    await emitNotification(bookNotif);

    sendReservationNotification(req.user, book, reservation);

    res.status(201).json({ success: true, reservation });
  } catch (error) {
    console.error("Reservation error:", error);
    res.status(500).json({ success: false, message: "Failed to create reservation", error: error.message });
  }
}

export async function updateReservation(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id).populate("book");
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }

    if (reservation.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
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
}

export async function deleteReservation(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id).populate("book");
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }

    if (reservation.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Restore available copies if reservation was pending or confirmed
    if (reservation.status === "pending" || reservation.status === "confirmed") {
      await Book.findByIdAndUpdate(reservation.book._id, { $inc: { availableCopies: 1 } });
    }

    await Reservation.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(req.user._id, { $inc: { reservations: -1 } });

    const cancelNotif = new Notification({
      title: "Reservation Cancelled",
      message: `${req.user.name} cancelled reservation for "${reservation.book?.title || "a book"}"`,
      type: "warning",
      action: "reservation_cancelled",
      relatedUser: req.user._id,
      relatedBook: reservation.book?._id,
      targetRole: "admin",
    });
    await cancelNotif.save();
    await emitNotification(cancelNotif);

    res.json({ success: true, message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Cancel error:", error);
    res.status(500).json({ success: false, message: "Failed to cancel reservation", error: error.message });
  }
}
