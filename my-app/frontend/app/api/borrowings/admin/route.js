import { NextResponse } from "next/server";
import Borrowing from "@/lib/models/Borrowing.js";
import { getUserFromToken } from "@/lib/auth.js";
import { connectDB } from "@/lib/db.js";

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const status = searchParams.get("status") || "";
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const borrowings = await Borrowing.find(query)
      .populate("user", "name email membershipId")
      .populate("book", "title author isbn category coverImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Borrowing.countDocuments(query);

    const activeCount = await Borrowing.countDocuments({ status: "active" });
    const returnedCount = await Borrowing.countDocuments({ status: "returned" });
    const overdueCount = await Borrowing.countDocuments({ status: "overdue" });

    return NextResponse.json({
      success: true,
      borrowings,
      stats: { total, activeCount, returnedCount, overdueCount },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch borrowings", error: error.message }, { status: 500 });
  }
}
