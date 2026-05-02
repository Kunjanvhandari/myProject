import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./lib/models/User.js";
import Book from "./lib/models/Book.js";
import Borrowing from "./lib/models/Borrowing.js";
import Reservation from "./lib/models/Reservation.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/librivista");
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      Book.deleteMany({}),
      User.deleteMany({}),
      Borrowing.deleteMany({}),
      Reservation.deleteMany({})
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
      address: "gulmi, satyawati-07-juniya",
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

    // Create books
    const books = [
      {
        title: "Atomic Habits",
        author: "James Clear",
        isbn: "9780735211292",
        description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
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
      },
      {
        title: "The Psychology of Money",
        author: "Morgan Housel",
        isbn: "9780857197689",
        description: "Timeless lessons on wealth, greed, and happiness.",
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
      },
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        isbn: "9780062316097",
        description: "A groundbreaking narrative of humanity's creation and evolution.",
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
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        isbn: "9780062315007",
        description: "A magical story about following your dreams.",
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
      },
      {
        title: "Deep Work",
        author: "Cal Newport",
        isbn: "9781455586691",
        description: "Rules for Focused Success in a Distracted World.",
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
      },
      {
        title: "The Lean Startup",
        author: "Eric Ries",
        isbn: "9780307887894",
        description: "How Today's Entrepreneurs Use Continuous Innovation.",
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
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "9780061120084",
        description: "A gripping story of racial injustice and childhood innocence.",
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
      },
      {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        isbn: "9780553380163",
        description: "From the Big Bang to Black Holes.",
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
      },
      {
        title: "The Diary of a Young Girl",
        author: "Anne Frank",
        isbn: "9780553296983",
        description: "The powerful true story of a young girl hiding from the Nazis.",
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
      },
      {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        isbn: "9780374533557",
        description: "How our minds make decisions.",
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
      },
      {
        title: "The Power of Now",
        author: "Eckhart Tolle",
        isbn: "9781577314806",
        description: "A guide to spiritual enlightenment and living in the present moment.",
        category: "Self-Help",
        publisher: "New World Library",
        publishYear: 1997,
        pages: 236,
        price: 700,
        totalCopies: 14,
        availableCopies: 11,
        coverImage: "/images/footer/book11.svg",
        rating: 4.7,
        ratingCount: 312,
        borrowCount: 312,
        badge: "Popular",
        isFeatured: true,
      },
      {
        title: "1984",
        author: "George Orwell",
        isbn: "9780451524935",
        description: "A dystopian social science fiction novel about totalitarianism.",
        category: "Fiction",
        publisher: "Signet Classic",
        publishYear: 1949,
        pages: 328,
        price: 600,
        totalCopies: 22,
        availableCopies: 18,
        coverImage: "/images/footer/book12.svg",
        rating: 4.8,
        ratingCount: 456,
        borrowCount: 456,
        badge: "Featured",
        isFeatured: true,
      },
      {
        title: "The 7 Habits of Highly Effective People",
        author: "Stephen R. Covey",
        isbn: "9781451639612",
        description: "Powerful lessons in personal change and effectiveness.",
        category: "Self-Help",
        publisher: "Free Press",
        publishYear: 1989,
        pages: 396,
        price: 850,
        totalCopies: 16,
        availableCopies: 13,
        coverImage: "/images/footer/book13.svg",
        rating: 4.6,
        ratingCount: 389,
        borrowCount: 389,
        badge: "Popular",
        isFeatured: false,
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        description: "A classic American novel about the Jazz Age.",
        category: "Fiction",
        publisher: "Scribner",
        publishYear: 1925,
        pages: 180,
        price: 550,
        totalCopies: 20,
        availableCopies: 16,
        coverImage: "/images/footer/book14.svg",
        rating: 4.5,
        ratingCount: 423,
        borrowCount: 423,
        badge: "Featured",
        isFeatured: true,
      },
      {
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        isbn: "9781612680194",
        description: "What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not.",
        category: "Business",
        publisher: "Warner Books",
        publishYear: 1997,
        pages: 207,
        price: 750,
        totalCopies: 25,
        availableCopies: 20,
        coverImage: "/images/footer/book15.svg",
        rating: 4.4,
        ratingCount: 567,
        borrowCount: 567,
        badge: "Trending",
        isFeatured: true,
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

    console.log("\n=== SEED COMPLETED ===");
    console.log("Admin credentials: admin@librivista.com / admin123");
    console.log("User credentials: Bhandarikunjan9@gmail.com / user123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
