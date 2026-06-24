import { NextResponse } from "next/server";
import User from "@/lib/models/User.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userData = await User.findById(user._id).populate("wishlist");
    return NextResponse.json({ success: true, wishlist: userData.wishlist });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch wishlist", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { bookId } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { wishlist: bookId } },
      { new: true }
    ).populate("wishlist");

    return NextResponse.json({ success: true, wishlist: updatedUser.wishlist });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add to wishlist", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ success: false, message: "Book ID is required" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { wishlist: bookId } },
      { new: true }
    ).populate("wishlist");

    return NextResponse.json({ success: true, wishlist: updatedUser.wishlist });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to remove from wishlist", error: error.message },
      { status: 500 }
    );
  }
}
