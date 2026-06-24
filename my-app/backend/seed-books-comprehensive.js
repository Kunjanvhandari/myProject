import mongoose from "mongoose";
import Book from "./models/Book.js";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";

dotenv.config({ path: "./.env" });

const categories = [
  { name: "Fiction", subjects: ["fiction", "novels"] },
  { name: "Non-Fiction", subjects: ["non_fiction", "essays"] },
  { name: "Science", subjects: ["science", "physics", "biology"] },
  { name: "Children", subjects: ["children", "juvenile"] },
  { name: "Business", subjects: ["business", "economics"] },
  { name: "Technology", subjects: ["technology", "computers"] },
  { name: "Biography", subjects: ["biography", "memoir"] },
  { name: "Philosophy", subjects: ["philosophy", "ethics"] },
  { name: "Academic", subjects: ["academic", "textbooks"] }
];

const imageDir = "C:/Users/Win11/Desktop/class10OJT/my-app/frontend/public/images/books";

async function downloadImage(url, filename) {
  try {
    const response = await axios({ url, responseType: "stream" });
    const filePath = path.join(imageDir, filename);
    await new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filePath))
        .on("finish", resolve)
        .on("error", reject);
    });
    return `/images/books/${filename}`;
  } catch (error) {
    console.log(`Failed to download image: ${url}`);
    return "/images/books/book_placeholder.jpg";
  }
}

async function fetchBooksFromOpenLibrary(subject, limit = 60) {
  try {
    const response = await axios.get(`https://openlibrary.org/subjects/${subject}.json?limit=${limit}`);
    return response.data.works || [];
  } catch (error) {
    console.error(`Error fetching ${subject}:`, error.message);
    return [];
  }
}

function generateISBN() {
  return "978" + Math.floor(Math.random() * 10000000000).toString().padStart(10, "0");
}

async function seedBooks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Book.deleteMany({});
    console.log("Cleared existing books");

    let totalBooks = 0;

    for (const category of categories) {
      console.log(`\nSeeding ${category.name}...`);
      let categoryBooks = [];

      for (const subject of category.subjects) {
        if (categoryBooks.length >= 50) break;
        const works = await fetchBooksFromOpenLibrary(subject, 60);
        
        for (const work of works) {
          if (categoryBooks.length >= 50) break;
          
          const coverId = work.cover_id;
          if (!coverId) continue;

          const authors = work.authors?.map(a => a.name) || ["Unknown Author"];
          const title = work.title;
          
          // Check for duplicates
          if (categoryBooks.some(b => b.title === title)) continue;

          const imageFilename = `book_${coverId}.jpg`;
          const imageUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
          const coverImage = await downloadImage(imageUrl, imageFilename);

          const book = {
            title,
            author: authors[0],
            isbn: generateISBN(),
            description: work.description?.value || work.description || `A ${category.name.toLowerCase()} book titled ${title}`,
            category: category.name,
            subcategory: work.subject?.[0] || "General",
            publisher: work.publishers?.[0] || "Unknown Publisher",
            publishYear: work.first_publish_year || 2020,
            pages: Math.floor(Math.random() * 500) + 100,
            price: Math.floor(Math.random() * 20) + 10,
            totalCopies: Math.floor(Math.random() * 10) + 3,
            availableCopies: Math.floor(Math.random() * 8) + 2,
            coverImage,
            tags: work.subject?.slice(0, 5) || [category.name.toLowerCase()],
            rating: (Math.random() * 2 + 3).toFixed(1),
            ratingCount: Math.floor(Math.random() * 1000) + 100,
            borrowCount: Math.floor(Math.random() * 500) + 50,
            badge: Math.random() > 0.7 ? "Popular" : Math.random() > 0.5 ? "Trending" : "",
            isFeatured: Math.random() > 0.7,
            isNewRelease: Math.random() > 0.8,
            status: "available"
          };

          categoryBooks.push(book);
          console.log(`  Added: ${title} (${categoryBooks.length}/50)`);
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      await Book.insertMany(categoryBooks);
      totalBooks += categoryBooks.length;
      console.log(`✅ Seeded ${categoryBooks.length} ${category.name} books`);
    }

    console.log(`\n🎉 Total books seeded: ${totalBooks}`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding books:", error.message);
    process.exit(1);
  }
}

seedBooks();
