import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
