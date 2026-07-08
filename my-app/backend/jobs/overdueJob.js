import Borrowing from "../models/Borrowing.js";
import Notification from "../models/Notification.js";
import { emitNotification } from "../config/socket.js";

export async function checkOverdueBooks() {
  try {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const overdueBorrowings = await Borrowing.find({
      status: "active",
      dueDate: { $lt: now },
    }).populate("user", "name email").populate("book", "title author");

    for (const borrowing of overdueBorrowings) {
      borrowing.status = "overdue";
      await borrowing.save();

      const existingNotif = await Notification.findOne({
        action: "book_overdue",
        relatedUser: borrowing.user._id,
        relatedBook: borrowing.book._id,
        createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      });

      if (!existingNotif) {
        const notif = new Notification({
          title: "Book Overdue",
          message: `${borrowing.user.name} has an overdue book: "${borrowing.book.title}" (due: ${borrowing.dueDate.toLocaleDateString()})`,
          type: "error",
          action: "book_overdue",
          relatedUser: borrowing.user._id,
          relatedBook: borrowing.book._id,
          targetRole: "admin",
        });
        await notif.save();
        await emitNotification(notif);

        const userNotif = new Notification({
          user: borrowing.user._id,
          title: "Book Overdue",
          message: `"${borrowing.book.title}" was due on ${borrowing.dueDate.toLocaleDateString()}. Please return it immediately to avoid fines.`,
          type: "error",
          action: "book_overdue",
          relatedUser: borrowing.user._id,
          relatedBook: borrowing.book._id,
          targetRole: "user",
        });
        await userNotif.save();
        await emitNotification(userNotif);
      }
    }

    const dueSoonBorrowings = await Borrowing.find({
      status: "active",
      dueDate: { $gte: now, $lte: threeDaysFromNow },
    }).populate("user", "name email").populate("book", "title author");

    for (const borrowing of dueSoonBorrowings) {
      const existingNotif = await Notification.findOne({
        action: "due_date_approaching",
        relatedUser: borrowing.user._id,
        relatedBook: borrowing.book._id,
        createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      });

      if (!existingNotif) {
        const userNotif = new Notification({
          user: borrowing.user._id,
          title: "Due Date Approaching",
          message: `"${borrowing.book.title}" is due on ${borrowing.dueDate.toLocaleDateString()}. Please return or renew.`,
          type: "warning",
          action: "due_date_approaching",
          relatedUser: borrowing.user._id,
          relatedBook: borrowing.book._id,
          targetRole: "user",
        });
        await userNotif.save();
        await emitNotification(userNotif);
      }
    }
  } catch (error) {
    console.error("Overdue check error:", error.message);
  }
}
