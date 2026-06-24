import Fine from "../models/Fine.js";
import Borrowing from "../models/Borrowing.js";
import User from "../models/User.js";

export async function getAllFines(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || "";
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

    res.json({
      success: true,
      fines,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch fines", error: error.message });
  }
}

export async function getUserFines(req, res) {
  try {
    const userId = req.params.userId || req.user._id;
    const fines = await Fine.find({ user: userId })
      .populate("book", "title author isbn")
      .populate("borrowing", "borrowDate dueDate returnDate")
      .sort({ createdAt: -1 });

    res.json({ success: true, fines });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch fines", error: error.message });
  }
}

export async function payFine(req, res) {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) {
      return res.status(404).json({ success: false, message: "Fine not found" });
    }

    fine.status = "paid";
    fine.paidDate = new Date();
    await fine.save();

    res.json({ success: true, fine, message: "Fine paid successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to pay fine", error: error.message });
  }
}

export async function waiveFine(req, res) {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) {
      return res.status(404).json({ success: false, message: "Fine not found" });
    }

    fine.status = "waived";
    await fine.save();

    res.json({ success: true, fine, message: "Fine waived successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to waive fine", error: error.message });
  }
}

export async function getFineStats(req, res) {
  try {
    const totalFines = await Fine.countDocuments();
    const unpaidFines = await Fine.countDocuments({ status: "unpaid" });
    const paidFines = await Fine.countDocuments({ status: "paid" });
    const waivedFines = await Fine.countDocuments({ status: "waived" });

    const totalAmountResult = await Fine.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

    const collectedAmountResult = await Fine.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const collectedAmount = collectedAmountResult.length > 0 ? collectedAmountResult[0].total : 0;

    res.json({
      success: true,
      stats: {
        totalFines,
        unpaidFines,
        paidFines,
        waivedFines,
        totalAmount,
        collectedAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch fine stats", error: error.message });
  }
}
