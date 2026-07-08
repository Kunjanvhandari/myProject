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
  suspendUser,
  activateUser,
  getUserBorrowings,
  getUserReservations,
  getUserFines,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/suspend", suspendUser);
router.put("/users/:id/activate", activateUser);
router.get("/users/:id/borrowings", getUserBorrowings);
router.get("/users/:id/reservations", getUserReservations);
router.get("/users/:id/fines", getUserFines);

router.get("/borrowings", getAllBorrowings);
router.put("/borrowings/:id", updateBorrowing);
router.delete("/borrowings/:id", deleteBorrowing);

router.get("/reservations", getAllReservations);
router.put("/reservations/:id", updateReservation);
router.delete("/reservations/:id", deleteReservation);

router.get("/notifications", protect, adminOnly, getAdminNotifications);

export default router;
