import mongoose from "mongoose";
import Book from "./models/Book.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// Start after highest existing ISBN: 9789973244416
let isbnCounter = 9973244416;
function genISBN() { isbnCounter++; return "978" + String(isbnCounter).padStart(10, "0"); }

async function addMoreBooks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const categories = ["Fiction", "Non-Fiction", "Science", "Children", "Business", "Technology", "Biography", "Philosophy", "Academic"];
    let added = 0;

    // Add 3 books to each category (all categories)
    for (const category of categories) {
      const books = [];
      for (let i = 0; i < 3; i++) {
        books.push({
          title: `New ${category} Book ${i + 1}`,
          author: `New Author ${i + 1}`,
          isbn: genISBN(),
          description: `New ${category.toLowerCase()} book added`,
          category,
          subcategory: category === "Non-Fiction" ? "Self-Help" : category === "Academic" ? "History" : "General",
          publisher: "New Publisher",
          publishYear: 2024 + Math.floor(Math.random() * 3),
          pages: Math.floor(Math.random() * 500) + 100,
          price: Math.floor(Math.random() * 20) + 10,
          totalCopies: Math.floor(Math.random() * 10) + 3,
          availableCopies: Math.floor(Math.random() * 8) + 2,
          coverImage: `https://covers.openlibrary.org/b/id/${[8257991, 8634250, 368541, 5259972, 12707846, 5951738, 12746894, 5634516, 490106][i % 9]}-L.jpg`,
          tags: [category.toLowerCase(), "new"],
          rating: (Math.random() * 2 + 3).toFixed(1),
          ratingCount: Math.floor(Math.random() * 1000) + 100,
          borrowCount: Math.floor(Math.random() * 500) + 50,
          badge: "New",
          isFeatured: true,
          isNewRelease: true,
          status: "available"
        });
      }
      await Book.insertMany(books);
      added += books.length;
      console.log(`✅ Added 3 books to ${category}`);
    }

    // Add 5 books with subcategory "History"
    const historyBooks = [];
    for (let i = 0; i < 5; i++) {
      historyBooks.push({
        title: `History Book ${i + 1}`,
        author: `Historian ${i + 1}`,
        isbn: genISBN(),
        description: "A history book",
        category: i < 2 ? "Non-Fiction" : "Academic",
        subcategory: "History",
        publisher: "History Press",
        publishYear: 2023 + Math.floor(Math.random() * 4),
        pages: Math.floor(Math.random() * 500) + 150,
        price: Math.floor(Math.random() * 20) + 12,
        totalCopies: Math.floor(Math.random() * 10) + 3,
        availableCopies: Math.floor(Math.random() * 8) + 2,
        coverImage: "https://covers.openlibrary.org/b/id/8634250-L.jpg",
        tags: ["history", "non-fiction"],
        rating: (Math.random() * 2 + 3).toFixed(1),
        ratingCount: Math.floor(Math.random() * 1000) + 100,
        borrowCount: Math.floor(Math.random() * 500) + 50,
        badge: "Popular",
        isFeatured: true,
        isNewRelease: true,
        status: "available"
      });
    }
    await Book.insertMany(historyBooks);
    added += historyBooks.length;
    console.log(`✅ Added 5 History subcategory books`);

    // Add 5 books with subcategory "Self-Help"
    const selfHelpBooks = [];
    for (let i = 0; i < 5; i++) {
      selfHelpBooks.push({
        title: `Self-Help Book ${i + 1}`,
        author: `Motivator ${i + 1}`,
        isbn: genISBN(),
        description: "A self-help book",
        category: i < 3 ? "Non-Fiction" : "Business",
        subcategory: "Self-Help",
        publisher: "Self-Help Press",
        publishYear: 2022 + Math.floor(Math.random() * 5),
        pages: Math.floor(Math.random() * 400) + 100,
        price: Math.floor(Math.random() * 18) + 10,
        totalCopies: Math.floor(Math.random() * 10) + 3,
        availableCopies: Math.floor(Math.random() * 8) + 2,
        coverImage: "https://covers.openlibrary.org/b/id/9829028-L.jpg",
        tags: ["self-help", "personal-growth"],
        rating: (Math.random() * 2 + 3).toFixed(1),
        ratingCount: Math.floor(Math.random() * 1000) + 100,
        borrowCount: Math.floor(Math.random() * 500) + 50,
        badge: "Trending",
        isFeatured: true,
        isNewRelease: true,
        status: "available"
      });
    }
    await Book.insertMany(selfHelpBooks);
    added += selfHelpBooks.length;
    console.log(`✅ Added 5 Self-Help subcategory books`);

    const total = await Book.countDocuments();
    console.log(`\n📚 Total books: ${total} (+${added} added)`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

addMoreBooks();
