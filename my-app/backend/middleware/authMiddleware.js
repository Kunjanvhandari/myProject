import jwt from "jsonwebtoken";
import { getUserFromToken } from "./auth.js";

export async function protect(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const user = await getUserFromToken(token);

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  req.user = user;
  next();
}

export function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
}
