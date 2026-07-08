import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    targetRole: {
      type: String,
      enum: ["admin", "user", "all"],
      default: "admin",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "success", "error"],
      default: "info",
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    relatedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    action: {
      type: String,
      enum: [
        "user_registered",
        "profile_updated",
        "password_changed",
        "book_reserved",
        "reservation_cancelled",
        "book_borrowed",
        "book_returned",
        "due_date_approaching",
        "book_overdue",
        "fine_generated",
      ],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isGlobal: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ targetRole: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ isGlobal: 1, createdAt: -1 });

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
