import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";
import User from "@/lib/models/User.js";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("profileImage");

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "File size must be less than 5MB" }, { status: 400 });
    }

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${user._id}-${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), "..", "backend", "uploads", "profiles");
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    if (user.profileImage) {
      const oldFilename = user.profileImage.split("/").pop();
      const oldPath = path.join(uploadDir, oldFilename);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await connectDB();
    const imageUrl = `/uploads/profiles/${filename}`;
    await User.findByIdAndUpdate(user._id, { profileImage: imageUrl });

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to upload profile image", error: error.message },
      { status: 500 }
    );
  }
}
