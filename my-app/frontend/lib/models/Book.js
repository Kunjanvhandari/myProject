import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a book title"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Please provide an author"],
      trim: true,
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    subcategory: {
      type: String,
      default: "",
    },
    publisher: {
      type: String,
      default: "",
    },
    publishYear: {
      type: Number,
      default: null,
    },
    edition: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "English",
    },
    pages: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    totalCopies: {
      type: Number,
      required: [true, "Please provide total copies"],
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: [true, "Please provide available copies"],
      default: 1,
    },
    coverImage: {
      type: String,
      default: "/images/footer/book22.png",
    },
    tags: [{ type: String }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    borrowCount: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      enum: ["New", "Popular", "Trending", "Featured", ""],
      default: "",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewRelease: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["available", "checkedOut", "unavailable", "maintenance"],
      default: "available",
    },
    chapters: [{
      title: String,
      page: Number,
      depth: Number,
    }],
    sourceUrl: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ title: "text", author: "text", tags: "text" });

bookSchema.methods.isAvailable = function () {
  return this.availableCopies > 0 && this.status === "available";
};

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

export default Book;
