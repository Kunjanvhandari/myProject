import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    membershipType: {
      type: String,
      enum: ["Free", "Basic", "Premium"],
      default: "Free",
    },
    membershipId: {
      type: String,
      unique: true,
      sparse: true,
    },
    membershipExpiry: {
      type: Date,
      default: null,
    },
    profileImage: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    booksBorrowed: {
      type: Number,
      default: 0,
    },
    booksReturned: {
      type: Number,
      default: 0,
    },
    currentlyBorrowed: {
      type: Number,
      default: 0,
    },
    reservations: {
      type: Number,
      default: 0,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    notifications: [
      {
        title: String,
        message: String,
        type: { type: String, enum: ["info", "warning", "success", "error"], default: "info" },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateMembershipId = function () {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000 + 1000);
  this.membershipId = `LIB-${year}-${random}`;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
