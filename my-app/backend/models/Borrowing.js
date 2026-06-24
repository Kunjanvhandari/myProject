import mongoose from "mongoose";

const borrowingSchema = new mongoose.Schema(
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
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "returned", "overdue"],
      default: "active",
    },
    lateFee: {
      type: Number,
      default: 0,
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

borrowingSchema.index({ user: 1, status: 1 });
borrowingSchema.index({ book: 1, status: 1 });

borrowingSchema.methods.isOverdue = function () {
  return this.status === "active" && new Date() > this.dueDate;
};

borrowingSchema.methods.calculateLateFee = function () {
  if (this.returnDate && this.returnDate > this.dueDate) {
    const daysLate = Math.ceil((this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
    return daysLate * 10;
  }
  return 0;
};

const Borrowing = mongoose.models.Borrowing || mongoose.model("Borrowing", borrowingSchema);

export default Borrowing;
