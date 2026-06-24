import { Router } from "express";
import { getReservations, createReservation, updateReservation, deleteReservation } from "../controllers/reservationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getReservations);
router.post("/", protect, createReservation);
router.put("/:id", protect, updateReservation);
router.delete("/:id", protect, deleteReservation);

export default router;
