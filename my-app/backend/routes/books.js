import express from "express";
import Book from "../lib/models/Book.js";
import { connectDB } from "../lib/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await connectDB();

    const { page = 1, limit = 12, search, category, featured, newRelease, status = "available" } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (newRelease === "true") {
      query.isNewRelease = true;
    }

    if (status) {
      query.status = status;
    }

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch books", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    await connectDB();

    const book = new Book(req.body);
    await book.save();

    res.status(201).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create book", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    await connectDB();

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch book", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await connectDB();

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update book", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await connectDB();

    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete book", error: error.message });
  }
});

export default router;
