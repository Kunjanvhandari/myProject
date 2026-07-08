import Notification from "../models/Notification.js";
import { emitNotification } from "../config/socket.js";

export async function getNotifications(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.user.role === "admin") {
      query = {
        $or: [
          { targetRole: "admin" },
          { isGlobal: true },
          { user: req.user._id },
        ],
      };
    } else {
      query = {
        $or: [
          { user: req.user._id },
          { isGlobal: true },
        ],
      };
    }

    const notifications = await Notification.find(query)
      .populate("relatedUser", "name email profileImage username")
      .populate("relatedBook", "title author coverImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

    res.json({
      success: true,
      notifications,
      unreadCount,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications", error: error.message });
  }
}

export async function markAsRead(req, res) {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    notification.isRead = true;
    await notification.save();
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to mark notification as read", error: error.message });
  }
}

export async function markAllAsRead(req, res) {
  try {
    let query = {};
    if (req.user.role === "admin") {
      query = {
        $or: [
          { targetRole: "admin" },
          { isGlobal: true },
        ],
        isRead: false,
      };
    } else {
      query = { user: req.user._id, isRead: false };
    }

    await Notification.updateMany(query, { isRead: true });
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to mark all as read", error: error.message });
  }
}

export async function deleteNotification(req, res) {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete notification", error: error.message });
  }
}

export async function clearAllNotifications(req, res) {
  try {
    let query = {};
    if (req.user.role === "admin") {
      query = {
        $or: [
          { targetRole: "admin" },
          { isGlobal: true },
        ],
      };
    } else {
      query = { user: req.user._id };
    }

    await Notification.deleteMany(query);
    res.json({ success: true, message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to clear notifications", error: error.message });
  }
}

export async function getUnreadCount(req, res) {
  try {
    let query = {};
    if (req.user.role === "admin") {
      query = {
        $or: [
          { targetRole: "admin" },
          { isGlobal: true },
        ],
        isRead: false,
      };
    } else {
      query = { user: req.user._id, isRead: false };
    }

    const count = await Notification.countDocuments(query);
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get unread count", error: error.message });
  }
}

export async function createNotification(req, res) {
  try {
    const { userId, title, message, type, action, relatedBook, targetRole, isGlobal } = req.body;

    const notification = new Notification({
      user: userId || null,
      targetRole: targetRole || "admin",
      title,
      message,
      type: type || "info",
      action,
      relatedUser: userId || req.user?._id,
      relatedBook,
      isGlobal: isGlobal || false,
    });

    await notification.save();
    await emitNotification(notification);

    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create notification", error: error.message });
  }
}
