import { NextResponse } from "next/server";
import Book from "@/lib/models/Book.js";
import { connectDB } from "@/lib/db.js";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, book });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch book", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const book = await Book.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, book });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update book", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete book", error: error.message },
      { status: 500 }
    );
  }
}
