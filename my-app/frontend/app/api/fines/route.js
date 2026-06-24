import { NextResponse } from "next/server";
import Fine from "@/lib/models/Fine.js";
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

    const fines = await Fine.find(query)
      .populate("user", "name email membershipId")
      .populate("book", "title author isbn")
      .populate("borrowing", "borrowDate dueDate returnDate")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Fine.countDocuments(query);

    const totalAmountResult = await Fine.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

    const unpaidFines = await Fine.countDocuments({ status: "unpaid" });
    const paidFines = await Fine.countDocuments({ status: "paid" });
    const waivedFines = await Fine.countDocuments({ status: "waived" });

    return NextResponse.json({
      success: true,
      fines,
      stats: { totalFines: total, unpaidFines, paidFines, waivedFines, totalAmount },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch fines", error: error.message }, { status: 500 });
  }
}
