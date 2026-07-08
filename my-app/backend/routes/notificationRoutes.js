import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
  createNotification,
} from "../controllers/notificationController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);
router.delete("/:id", protect, deleteNotification);
router.delete("/", protect, clearAllNotifications);
router.post("/", protect, adminOnly, createNotification);

export default router;
