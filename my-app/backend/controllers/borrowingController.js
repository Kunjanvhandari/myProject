import Borrowing from "../models/Borrowing.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import Fine from "../models/Fine.js";
import Notification from "../models/Notification.js";
import { emitNotification } from "../config/socket.js";

export async function getBorrowings(req, res) {
  try {
    const userId = req.query.userId || req.user._id.toString();
    const status = req.query.status;

    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    const borrowings = await Borrowing.find(query)
      .populate("book", "title author coverImage category")
      .sort({ borrowDate: -1 });

    res.json({ success: true, borrowings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch borrowings", error: error.message });
  }
}

export async function createBorrowing(req, res) {
  try {
    const { bookId, borrowDays = 14 } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    if (!book.isAvailable()) {
      return res.status(400).json({ success: false, message: "Book is not available" });
    }

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + borrowDays);

    const borrowing = new Borrowing({
      user: req.user._id,
      book: bookId,
      borrowDate: today,
      dueDate,
    });

    await borrowing.save();

    book.availableCopies -= 1;
    book.borrowCount += 1;

    if (book.availableCopies <= 0) {
      book.status = "checkedOut";
    }

    await book.save();

    const userData = await User.findById(req.user._id);
    userData.booksBorrowed += 1;
    userData.currentlyBorrowed += 1;
    await userData.save();

    const populated = await Borrowing.findById(borrowing._id)
      .populate("book", "title author coverImage category")
      .populate("user", "name email");

    const borrowNotif = new Notification({
      title: "Book Borrowed",
      message: `${userData.name} borrowed "${book.title}"`,
      type: "info",
      action: "book_borrowed",
      relatedUser: userData._id,
      relatedBook: book._id,
      targetRole: "admin",
    });
    await borrowNotif.save();
    await emitNotification(borrowNotif);

    res.status(201).json({ success: true, borrowing: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create borrowing", error: error.message });
  }
}

export async function returnBook(req, res) {
  try {
    const borrowing = await Borrowing.findById(req.params.id).populate("book");
    if (!borrowing) {
      return res.status(404).json({ success: false, message: "Borrowing not found" });
    }

    if (borrowing.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (borrowing.status === "returned") {
      return res.status(400).json({ success: false, message: "Book already returned" });
    }

    const returnDate = new Date();
    borrowing.returnDate = returnDate;
    borrowing.status = "returned";
    borrowing.lateFee = borrowing.calculateLateFee();
    await borrowing.save();

    const book = await Book.findById(borrowing.book._id);
    book.availableCopies += 1;

    if (book.availableCopies > 0 && book.status === "checkedOut") {
      book.status = "available";
    }

    await book.save();

    const userData = await User.findById(req.user._id);
    userData.booksReturned += 1;
    userData.currentlyBorrowed = Math.max(0, userData.currentlyBorrowed - 1);
    await userData.save();

    if (borrowing.lateFee > 0) {
      const daysLate = Math.ceil((returnDate - borrowing.dueDate) / (1000 * 60 * 60 * 24));
      const fine = new Fine({
        borrowing: borrowing._id,
        user: req.user._id,
        book: borrowing.book._id,
        amount: borrowing.lateFee,
        daysLate,
        ratePerDay: 10,
        status: "unpaid",
        notes: `Late return by ${daysLate} day(s) at Rs.10/day`,
      });
      await fine.save();

      const fineNotif = new Notification({
        title: "Fine Generated",
        message: `${userData.name} has a late fee of Rs.${borrowing.lateFee} for "${book.title}"`,
        type: "warning",
        action: "fine_generated",
        relatedUser: userData._id,
        relatedBook: book._id,
        targetRole: "admin",
      });
      await fineNotif.save();
      await emitNotification(fineNotif);

      const userFineNotif = new Notification({
        user: userData._id,
        title: "Late Return Fine",
        message: `You have been fined Rs.${borrowing.lateFee} for late return of "${book.title}" (${daysLate} days late)`,
        type: "error",
        action: "fine_generated",
        relatedUser: userData._id,
        relatedBook: book._id,
        targetRole: "user",
      });
      await userFineNotif.save();
      await emitNotification(userFineNotif);
    }

    const returnNotif = new Notification({
      title: "Book Returned",
      message: `${userData.name} returned "${book.title}"`,
      type: "success",
      action: "book_returned",
      relatedUser: userData._id,
      relatedBook: book._id,
      targetRole: "admin",
    });
    await returnNotif.save();
    await emitNotification(returnNotif);

    res.json({ success: true, borrowing });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to return book", error: error.message });
  }
}
