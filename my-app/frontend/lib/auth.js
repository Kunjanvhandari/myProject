import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/lib/models/User.js";
import { connectDB } from "@/lib/db.js";

export async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");

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
