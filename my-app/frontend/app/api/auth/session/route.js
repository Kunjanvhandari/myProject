import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth.js";

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ success: true, user: null });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        studentId: user.studentId,
        membershipId: user.membershipId,
        membershipType: user.membershipType,
        membershipExpiry: user.membershipExpiry,
        role: user.role,
        booksBorrowed: user.booksBorrowed,
        booksReturned: user.booksReturned,
        currentlyBorrowed: user.currentlyBorrowed,
        reservations: user.reservations,
        wishlist: user.wishlist,
        notifications: user.notifications,
        profileImage: user.profileImage,
        profileCompletion: user.getProfileCompletion ? user.getProfileCompletion() : 0,
        createdAt: user.createdAt,
      },
    });
  } catch {
    return NextResponse.json({ success: true, user: null });
  }
}
