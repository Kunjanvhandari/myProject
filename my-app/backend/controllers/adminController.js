import User from "../models/User.js";
import Book from "../models/Book.js";
import Borrowing from "../models/Borrowing.js";
import Reservation from "../models/Reservation.js";
import Fine from "../models/Fine.js";

export async function getAllUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { membershipId: { $regex: search, $options: "i" } },
          { studentId: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (status === "active") query.isActive = true;
    if (status === "suspended") query.isActive = false;

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user", error: error.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { name, email, phone, address, role, isActive, membershipType, membershipExpiry } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (membershipType) updateData.membershipType = membershipType;
    if (membershipExpiry) updateData.membershipExpiry = membershipExpiry;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update user", error: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to deactivate user", error: error.message });
  }
}

export async function getAllBorrowings(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || "";
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const borrowings = await Borrowing.find(query)
      .populate("user", "name email membershipId")
      .populate("book", "title author isbn category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Borrowing.countDocuments(query);

    res.json({
      success: true,
      borrowings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch borrowings", error: error.message });
  }
}

export async function updateBorrowing(req, res) {
  try {
    const { status, dueDate, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (dueDate) updateData.dueDate = dueDate;
    if (notes !== undefined) updateData.notes = notes;

    const borrowing = await Borrowing.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("user", "name email")
      .populate("book", "title author");

    if (!borrowing) {
      return res.status(404).json({ success: false, message: "Borrowing not found" });
    }
    res.json({ success: true, borrowing });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update borrowing", error: error.message });
  }
}

export async function deleteBorrowing(req, res) {
  try {
    const borrowing = await Borrowing.findByIdAndDelete(req.params.id);
    if (!borrowing) {
      return res.status(404).json({ success: false, message: "Borrowing not found" });
    }
    res.json({ success: true, message: "Borrowing deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete borrowing", error: error.message });
  }
}

export async function getAllReservations(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || "";
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const reservations = await Reservation.find(query)
      .populate("user", "name email membershipId")
      .populate("book", "title author isbn category price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Reservation.countDocuments(query);

    res.json({
      success: true,
      reservations,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch reservations", error: error.message });
  }
}

export async function updateReservation(req, res) {
  try {
    const { status, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const reservation = await Reservation.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("user", "name email")
      .populate("book", "title author");

    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }
    res.json({ success: true, reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update reservation", error: error.message });
  }
}

export async function getAdminNotifications(req, res) {
  try {
    const pendingReservations = await Reservation.find({ status: "pending" })
      .populate("user", "name email phone")
      .populate("book", "title author price")
      .sort({ createdAt: -1 })
      .limit(20);

    const pendingBorrowings = await Borrowing.find({ status: "pending" })
      .populate("user", "name email phone")
      .populate("book", "title author")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      notifications: {
        pendingReservations,
        pendingBorrowings,
        totalPending: pendingReservations.length + pendingBorrowings.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications", error: error.message });
  }
}

export async function deleteReservation(req, res) {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }
    res.json({ success: true, message: "Reservation cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to cancel reservation", error: error.message });
  }
}

export async function suspendUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User suspended", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to suspend user", error: error.message });
  }
}

export async function activateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User activated", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to activate user", error: error.message });
  }
}

export async function getUserBorrowings(req, res) {
  try {
    const borrowings = await Borrowing.find({ user: req.params.id })
      .populate("book", "title author coverImage category isbn")
      .sort({ createdAt: -1 });
    res.json({ success: true, borrowings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user borrowings", error: error.message });
  }
}

export async function getUserReservations(req, res) {
  try {
    const reservations = await Reservation.find({ user: req.params.id })
      .populate("book", "title author coverImage category price")
      .sort({ createdAt: -1 });
    res.json({ success: true, reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user reservations", error: error.message });
  }
}

export async function getUserFines(req, res) {
  try {
    const fines = await Fine.find({ user: req.params.id })
      .populate("book", "title author isbn")
      .populate("borrowing", "borrowDate dueDate returnDate")
      .sort({ createdAt: -1 });
    const totalUnpaid = fines.filter(f => f.status === "unpaid").reduce((sum, f) => sum + f.amount, 0);
    res.json({ success: true, fines, totalUnpaid });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user fines", error: error.message });
  }
}
