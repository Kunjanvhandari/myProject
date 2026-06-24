import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { connectDB } from "../config/db.js";

export async function getUserFromToken(token) {
  try {
    if (!token) {
      return null;
    }

    await connectDB();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export function createToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}
