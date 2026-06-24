import mongoose from "mongoose";
import Book from "./models/Book.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

let isbnCounter = 1000000000;
function genISBN() { isbnCounter++; return "978" + String(isbnCounter).padStart(10, "0"); }

async function seedFinal() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const categories = ["Non-Fiction", "Business", "Technology", "Biography", "Philosophy", "Academic"];

    for (const category of categories) {
      const existingCount = await Book.countDocuments({ category });
      const needed = 50 - existingCount;

      if (needed <= 0) {
        console.log(`✅ ${category} already has ${existingCount} books`);
        continue;
      }

      console.log(`Seeding ${needed} more books for ${category}...`);

      const books = [];
      for (let i = 0; i < needed; i++) {
        books.push({
          title: `${category} Book ${existingCount + i + 1}`,
          author: `Author ${i + 1}`,
          isbn: genISBN(),
          description: `A ${category.toLowerCase()} book`,
          category,
          subcategory: "General",
          publisher: "Various",
          publishYear: 2000 + Math.floor(Math.random() * 24),
          pages: Math.floor(Math.random() * 500) + 100,
          price: Math.floor(Math.random() * 20) + 10,
          totalCopies: Math.floor(Math.random() * 10) + 3,
          availableCopies: Math.floor(Math.random() * 8) + 2,
          coverImage: `https://covers.openlibrary.org/b/id/${[9829028, 12707846, 5951738, 12746894, 5634516, 368541][i % 6]}-L.jpg`,
          tags: [category.toLowerCase()],
          rating: (Math.random() * 2 + 3).toFixed(1),
          ratingCount: Math.floor(Math.random() * 1000) + 100,
          borrowCount: Math.floor(Math.random() * 500) + 50,
          badge: Math.random() > 0.7 ? "Popular" : "",
          isFeatured: Math.random() > 0.7,
          isNewRelease: Math.random() > 0.8,
          status: "available"
        });
      }

      await Book.insertMany(books);
      console.log(`✅ ${category} now has ${existingCount + needed} books`);
    }

    const total = await Book.countDocuments();
    console.log(`\n📚 Total books in database: ${total}`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seedFinal();
