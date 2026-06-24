import { NextResponse } from "next/server";
import Book from "@/lib/models/Book.js";
import { connectDB } from "@/lib/db.js";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const newRelease = searchParams.get("newRelease");
    const status = searchParams.get("status") || "available";

    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      const searchTerm = search.trim();
      const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const exactTitleMatch = await Book.findOne({
        title: { $regex: new RegExp(`^${escaped}$`, "i") },
      });

      if (exactTitleMatch) {
        return NextResponse.json({
          success: true,
          books: [exactTitleMatch],
          pagination: { page: 1, limit: 12, total: 1, pages: 1 },
        });
      }

      query = {
        $or: [
          { title: { $regex: new RegExp(`^${escaped}`, "i") } },
          { title: { $regex: new RegExp(escaped, "i") } },
          { tags: searchTerm },
          { author: { $regex: new RegExp(escaped, "i") } },
          { isbn: { $regex: new RegExp(escaped, "i") } },
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

    const projection = {
      _id: 1, title: 1, author: 1, coverImage: 1, rating: 1,
      category: 1, badge: 1, pages: 1, sourceUrl: 1,
      availableCopies: 1, tags: 1,
    };

    const books = await Book.find(query, projection)
      .sort({
        title: 1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(query);

    return NextResponse.json({
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
    return NextResponse.json(
      { success: false, message: "Failed to fetch books", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const book = new Book(body);
    await book.save();

    return NextResponse.json({ success: true, book }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create book", error: error.message },
      { status: 500 }
    );
  }
}
