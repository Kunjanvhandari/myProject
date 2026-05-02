import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    reservedOn: {
      type: Date,
      default: Date.now,
    },
    reserveExpiry: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["eSewa", "Khalti", "Cash on Pickup", ""],
      default: "",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    deliveryAddress: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

reservationSchema.index({ user: 1, status: 1 });
reservationSchema.index({ book: 1, status: 1 });

reservationSchema.methods.isExpired = function () {
  return this.status === "pending" && new Date() > this.reserveExpiry;
};

const Reservation = mongoose.models.Reservation || mongoose.model("Reservation", reservationSchema);

export default Reservation;
