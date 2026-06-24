import Book from "../models/Book.js";

export async function getBooks(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search;
    const category = req.query.category;
    const featured = req.query.featured;
    const newRelease = req.query.newRelease;
    const status = req.query.status || "available";

    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      const searchTerm = search.trim();
      query = {
        $or: [
          { title: { $regex: new RegExp(`^${searchTerm}`, "i") } },
          { title: { $regex: new RegExp(searchTerm, "i") } },
          { tags: { $regex: new RegExp(`^${searchTerm}$`, "i") } },
          { tags: { $regex: new RegExp(searchTerm, "i") } },
          { author: { $regex: new RegExp(searchTerm, "i") } },
          { isbn: { $regex: new RegExp(searchTerm, "i") } },
        ],
      };
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
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch books", error: error.message });
  }
}

export async function getBookById(req, res) {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch book", error: error.message });
  }
}

export async function createBook(req, res) {
  try {
    const book = new Book(req.body);
    await book.save();

    res.status(201).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create book", error: error.message });
  }
}

export async function updateBook(req, res) {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update book", error: error.message });
  }
}

export async function deleteBook(req, res) {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete book", error: error.message });
  }
}
