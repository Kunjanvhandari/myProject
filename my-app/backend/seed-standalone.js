import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Import models
import User from "./lib/models/User.js";
import Book from "./lib/models/Book.js";
import Borrowing from "./lib/models/Borrowing.js";
import Reservation from "./lib/models/Reservation.js";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      Book.deleteMany({}),
      User.deleteMany({}),
      Borrowing.deleteMany({}),
      Reservation.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@librivista.com",
      password: adminPassword,
      phone: "+977-01-4256789",
      address: "Kathmandu, Nepal",
      membershipType: "Premium",
      membershipId: "LIB-2026-0001",
      role: "admin",
      isActive: true,
    });
    console.log("Created admin user");

    // Create regular user
    const userPassword = await bcrypt.hash("user123", 10);
    const user = await User.create({
      name: "Kunjan Bhandari",
      email: "Bhandarikunjan9@gmail.com",
      password: userPassword,
      phone: "+977 9743962189",
      address: "Gulmi, Satyawati-07, Juniya",
      membershipType: "Premium",
      membershipId: "LIB-2024-0892",
      membershipExpiry: new Date("2027-03-15"),
      role: "user",
      isActive: true,
      booksBorrowed: 47,
      booksReturned: 43,
      currentlyBorrowed: 4,
      reservations: 2,
    });
    console.log("Created regular user");

    // Create books with real data
    const books = [
      {
        title: "Atomic Habits",
        author: "James Clear",
        isbn: "9780735211292",
        description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones. Learn how small changes can transform your life.",
        category: "Self-Help",
        publisher: "Avery",
        publishYear: 2018,
        pages: 320,
        price: 850,
        totalCopies: 15,
        availableCopies: 12,
        coverImage: "/images/footer/book19.svg",
        rating: 4.8,
        ratingCount: 342,
        borrowCount: 342,
        badge: "Trending",
        isFeatured: true,
        isNewRelease: false,
        tags: ["habits", "self-improvement", "productivity"],
      },
      {
        title: "The Psychology of Money",
        author: "Morgan Housel",
        isbn: "9780857197689",
        description: "Timeless lessons on wealth, greed, and happiness. Understand how people think about money.",
        category: "Business",
        publisher: "Harriman House",
        publishYear: 2020,
        pages: 256,
        price: 950,
        totalCopies: 10,
        availableCopies: 7,
        coverImage: "/images/footer/book20.svg",
        rating: 4.7,
        ratingCount: 289,
        borrowCount: 289,
        badge: "Popular",
        isFeatured: true,
        isNewRelease: false,
        tags: ["finance", "investing", "money"],
      },
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        isbn: "9780062316097",
        description: "A groundbreaking narrative of humanity's creation and evolution. Explore how Homo sapiens conquered the world.",
        category: "History",
        publisher: "Harper",
        publishYear: 2015,
        pages: 464,
        price: 1100,
        totalCopies: 12,
        availableCopies: 9,
        coverImage: "/images/footer/book21.svg",
        rating: 4.6,
        ratingCount: 256,
        borrowCount: 256,
        badge: "Featured",
        isFeatured: true,
        isNewRelease: false,
        tags: ["history", "anthropology", "science"],
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        isbn: "9780062315007",
        description: "A magical story about following your dreams. A shepherd boy journeys to Egypt in search of treasure.",
        category: "Fiction",
        publisher: "HarperOne",
        publishYear: 1988,
        pages: 197,
        price: 750,
        totalCopies: 20,
        availableCopies: 15,
        coverImage: "/images/footer/book4.svg",
        rating: 4.5,
        ratingCount: 198,
        borrowCount: 198,
        badge: "Popular",
        isFeatured: true,
        isNewRelease: false,
        tags: ["fiction", "philosophy", "adventure"],
      },
      {
        title: "Deep Work",
        author: "Cal Newport",
        isbn: "9781455586691",
        description: "Rules for Focused Success in a Distracted World. Learn to master focused work.",
        category: "Self-Help",
        publisher: "Grand Central Publishing",
        publishYear: 2016,
        pages: 304,
        price: 800,
        totalCopies: 8,
        availableCopies: 6,
        coverImage: "/images/footer/book5.svg",
        rating: 4.6,
        ratingCount: 245,
        borrowCount: 245,
        badge: "Popular",
        isFeatured: false,
        isNewRelease: false,
        tags: ["productivity", "focus", "work"],
      },
      {
        title: "The Lean Startup",
        author: "Eric Ries",
        isbn: "9780307887894",
        description: "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.",
        category: "Business",
        publisher: "Crown Business",
        publishYear: 2011,
        pages: 336,
        price: 900,
        totalCopies: 10,
        availableCopies: 8,
        coverImage: "/images/footer/book6.svg",
        rating: 4.4,
        ratingCount: 312,
        borrowCount: 312,
        badge: "Trending",
        isFeatured: false,
        isNewRelease: false,
        tags: ["startup", "entrepreneurship", "innovation"],
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "9780061120084",
        description: "A gripping story of racial injustice and childhood innocence in the American South.",
        category: "Fiction",
        publisher: "HarperCollins",
        publishYear: 1960,
        pages: 376,
        price: 700,
        totalCopies: 18,
        availableCopies: 14,
        coverImage: "/images/footer/book7.svg",
        rating: 4.9,
        ratingCount: 421,
        borrowCount: 421,
        badge: "Featured",
        isFeatured: true,
        isNewRelease: false,
        tags: ["classic", "fiction", "american-literature"],
      },
      {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        isbn: "9780553380163",
        description: "From the Big Bang to Black Holes. Explore the mysteries of the universe.",
        category: "Science",
        publisher: "Bantam",
        publishYear: 1988,
        pages: 256,
        price: 850,
        totalCopies: 12,
        availableCopies: 10,
        coverImage: "/images/footer/book8.svg",
        rating: 4.5,
        ratingCount: 287,
        borrowCount: 287,
        badge: "Featured",
        isFeatured: false,
        isNewRelease: false,
        tags: ["science", "physics", "cosmology"],
      },
      {
        title: "The Diary of a Young Girl",
        author: "Anne Frank",
        isbn: "9780553296983",
        description: "The powerful true story of a young girl hiding from the Nazis during World War II.",
        category: "History",
        publisher: "Bantam",
        publishYear: 1947,
        pages: 283,
        price: 650,
        totalCopies: 15,
        availableCopies: 12,
        coverImage: "/images/footer/book9.svg",
        rating: 4.8,
        ratingCount: 356,
        borrowCount: 356,
        badge: "Featured",
        isFeatured: true,
        isNewRelease: false,
        tags: ["history", "biography", "world-war-ii"],
      },
      {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        isbn: "9780374533557",
        description: "How our minds make decisions and the two systems that drive the way we think.",
        category: "Business",
        publisher: "Farrar, Straus and Giroux",
        publishYear: 2011,
        pages: 499,
        price: 1050,
        totalCopies: 9,
        availableCopies: 7,
        coverImage: "/images/footer/book10.svg",
        rating: 4.5,
        ratingCount: 298,
        borrowCount: 298,
        badge: "Popular",
        isFeatured: false,
        isNewRelease: false,
        tags: ["psychology", "decision-making", "behavioral-economics"],
      },
    ];

    const createdBooks = await Book.insertMany(books);
    console.log(`Created ${createdBooks.length} books`);

    // Create sample borrowings
    const borrowings = [
      {
        user: user._id,
        book: createdBooks[0]._id,
        borrowDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "active",
      },
      {
        user: user._id,
        book: createdBooks[1]._id,
        borrowDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        returnDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: "returned",
      },
    ];

    await Borrowing.insertMany(borrowings);
    console.log(`Created ${borrowings.length} borrowings`);

    // Create sample reservations (cart items)
    const reservations = [
      {
        user: user._id,
        book: createdBooks[2]._id,
        reservedOn: new Date(),
        reserveExpiry: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: "pending",
        paymentMethod: "eSewa",
        totalPrice: createdBooks[2].price,
        deliveryFee: 100,
        discount: 0,
      },
    ];

    await Reservation.insertMany(reservations);
    console.log(`Created ${reservations.length} reservations`);

    console.log("\n=== Database seeded successfully ===");
    console.log("Admin login: admin@librivista.com / admin123");
    console.log("User login: Bhandarikunjan9@gmail.com / user123");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Seeding error:", error.message);
    console.error(error);
  }
}

seed();
