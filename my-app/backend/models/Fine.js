import mongoose from "mongoose";

const fineSchema = new mongoose.Schema(
  {
    borrowing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Borrowing",
      required: true,
    },
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
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    daysLate: {
      type: Number,
      default: 0,
    },
    ratePerDay: {
      type: Number,
      default: 10,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid", "waived"],
      default: "unpaid",
    },
    paidDate: {
      type: Date,
      default: null,
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

fineSchema.index({ user: 1, status: 1 });
fineSchema.index({ borrowing: 1 });

const Fine = mongoose.models.Fine || mongoose.model("Fine", fineSchema);

export default Fine;
