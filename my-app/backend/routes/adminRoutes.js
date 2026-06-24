import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllBorrowings,
  updateBorrowing,
  deleteBorrowing,
  getAllReservations,
  updateReservation,
  deleteReservation,
  getAdminNotifications,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/borrowings", getAllBorrowings);
router.put("/borrowings/:id", updateBorrowing);
router.delete("/borrowings/:id", deleteBorrowing);

router.get("/reservations", getAllReservations);
router.put("/reservations/:id", updateReservation);
router.delete("/reservations/:id", deleteReservation);

router.get("/notifications", protect, adminOnly, getAdminNotifications);

export default router;
