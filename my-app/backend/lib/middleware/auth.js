import jwt from "jsonwebtoken";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";

export async function authenticateToken(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return { user: null };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return { user: null };
    }

    return { user };
  } catch (error) {
    return { user: null };
  }
}

export async function requireAdmin(req) {
  const { user } = await authenticateToken(req);

  if (!user) {
    return { error: "Unauthorized", status: 401 };
  }

  if (user.role !== "admin") {
    return { error: "Admin access required", status: 403 };
  }

  return { user };
}
