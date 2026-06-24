import mongoose from "mongoose";
import Book from "./models/Book.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: "./.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_PUBLIC = path.join(__dirname, "..", "frontend", "public", "images", "books");
const IMAGE_BASE = "https://images.worldlibrary.org/img/members.3/audio_ebooks/chapters";

const books = [
  { title: "Ethan Frome", author: "Edith Wharton", slug: "ethan_frome_0802", category: "Fiction", publishYear: 1911, description: "A story of a poor farmer trapped in a loveless marriage in a harsh New England winter." },
  { title: "The Sign of the Four", author: "Sir Arthur Conan Doyle", slug: "sign_of_four", category: "Mystery", publishYear: 1890, description: "Sherlock Holmes and Dr. Watson investigate a mystery involving a secret pact and a stolen treasure." },
  { title: "A Christmas Carol", author: "Charles Dickens", slug: "christmascarol_1104", category: "Fiction", publishYear: 1843, description: "A miserly businessman is visited by three spirits on Christmas Eve." },
  { title: "The Science of Getting Rich", author: "Wallace D. Wattles", slug: "science_gettingrich_1005", category: "Self-Help", publishYear: 1910, description: "A philosophical guide to wealth and success through creative thought." },
  { title: "Emma", author: "Jane Austen", slug: "emma_solo", category: "Fiction", publishYear: 1815, description: "A young woman's misguided matchmaking schemes in Regency England." },
  { title: "At the Villa Rose", author: "A. E. W. Mason", slug: "at_villa_rose_1112", category: "Mystery", publishYear: 1910, description: "A detective novel set in the French Riviera involving a mysterious crime." },
  { title: "The Adventures of Huckleberry Finn", author: "Mark Twain", slug: "huck_finn", category: "Fiction", publishYear: 1884, description: "A boy's journey down the Mississippi River with an escaped slave." },
  { title: "12 Creepy Tales", author: "Edgar Allan Poe", slug: "12_creepytales_1206", category: "Fiction", publishYear: 1840, description: "A collection of the darkest and most unsettling stories by the master of macabre." },
  { title: "Oliver Twist", author: "Charles Dickens", slug: "oliver_twist", category: "Fiction", publishYear: 1838, description: "An orphan boy's adventures in the criminal underworld of Victorian London." },
  { title: "The Adventures of Tom Sawyer", author: "Mark Twain", slug: "tom_sawyer", category: "Fiction", publishYear: 1876, description: "The mischievous adventures of a young boy growing up along the Mississippi." },
  { title: "The Windy Hill", author: "Cornelia Meigs", slug: "windyhill_pe", category: "Children", publishYear: 1921, description: "A classic children's adventure story set in the countryside." },
  { title: "Far from the Madding Crowd", author: "Thomas Hardy", slug: "madding_crowd_0807", category: "Fiction", publishYear: 1874, description: "A passionate tale of love, tragedy, and rural life in Victorian England." },
  { title: "A Tale of Two Cities", author: "Charles Dickens", slug: "tale_two_cities", category: "Fiction", publishYear: 1859, description: "A historical novel set in London and Paris during the French Revolution." },
  { title: "The Count of Monte Cristo", author: "Alexandre Dumas", slug: "count_monte_cristo_0711", category: "Fiction", publishYear: 1844, description: "A tale of betrayal, imprisonment, and revenge." },
  { title: "The Three Musketeers", author: "Alexandre Dumas", slug: "three_musketeers_0712", category: "Fiction", publishYear: 1844, description: "Adventures of d'Artagnan and the three musketeers in 17th century France." },
  { title: "Afterward", author: "Edith Wharton", slug: "afterward_cb", category: "Fiction", publishYear: 1910, description: "A ghost story about a couple who move into a haunted English house." },
  { title: "There is a Tavern in the Town", author: "James Stephens", slug: "tavern_in_the_town_1011", category: "Poetry", publishYear: 1918, description: "A collection of Irish poetry and folk tales." },
  { title: "Othello", author: "Wilhelm Hauff", slug: "othello_hok", category: "Fiction", publishYear: 1826, description: "A novella adaptation of Shakespeare's tragedy." },
  { title: "Anna Karenina", author: "Leo Tolstoy", slug: "annakarenina_4_1008", category: "Fiction", publishYear: 1878, description: "The story of a tragic love affair in Imperial Russian society." },
  { title: "The White People", author: "Arthur Machen", slug: "white_people", category: "Fiction", publishYear: 1904, description: "A supernatural horror story about a young girl's encounters with the occult." },
  { title: "The Wheels of Chance", author: "H. G. Wells", slug: "wheels_of_chance_0908", category: "Fiction", publishYear: 1896, description: "A humorous cycling adventure across the English countryside." },
  { title: "The Mill on the Floss", author: "George Eliot", slug: "mill_on_the_floss_0812", category: "Fiction", publishYear: 1860, description: "The story of a young woman's struggle against Victorian society." },
  { title: "Fem Uger i Ballon", author: "Jules Verne", slug: "fem_uger_i_ballon", category: "Fiction", publishYear: 1863, description: "A classic adventure story about a balloon journey across Africa. (Danish)" },
  { title: "Aurora Floyd", author: "Mary Elizabeth Braddon", slug: "aurora_floyd_1012", category: "Fiction", publishYear: 1863, description: "A sensation novel of bigamy, murder, and scandal in Victorian England." },
  { title: "Alexander's Bridge", author: "Willa Sibert Cather", slug: "alexanders_bridge", category: "Fiction", publishYear: 1912, description: "A story of a successful engineer torn between two women." },
  { title: "The Brand of Silence", author: "Harrington Strong", slug: "brand_of_silence_0910", category: "Mystery", publishYear: 1920, description: "A mystery thriller about hidden identities and criminal conspiracies." },
  { title: "Resurrection", author: "Leo Tolstoy", slug: "resurrection_2_1002", category: "Fiction", publishYear: 1899, description: "A wealthy nobleman seeks redemption after serving on a jury." },
  { title: "Clarimonde", author: "Theophile Gautier", slug: "clarimonde_0909", category: "Fiction", publishYear: 1836, description: "A supernatural romance about a priest's obsession with a mysterious woman." },
  { title: "The Hand of Fu-Manchu", author: "Sax Rohmer", slug: "hand_of_fu-manchu_0911", category: "Mystery", publishYear: 1917, description: "A detective thriller featuring the criminal mastermind Fu-Manchu." },
  { title: "Rachel Ray", author: "Anthony Trollope", slug: "rachel_ray_1105", category: "Fiction", publishYear: 1863, description: "A novel of love and social convention in a small English town." },
  { title: "The Parasite", author: "Sir Arthur Conan Doyle", slug: "parasite", category: "Fiction", publishYear: 1894, description: "A psychological horror story about mind control and obsession." },
  { title: "The Third Miss Symons", author: "F. M. Mayor", slug: "third_miss_symons_1012", category: "Fiction", publishYear: 1913, description: "A poignant story of a woman's life shaped by family and social expectations." },
];

async function downloadImage(url, filePath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    return true;
  } catch (error) {
    console.error(`  Failed to download ${url}: ${error.message}`);
    return false;
  }
}

async function seed() {
  try {
    if (!fs.existsSync(FRONTEND_PUBLIC)) {
      fs.mkdirSync(FRONTEND_PUBLIC, { recursive: true });
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB\n");

    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const book of books) {
      const imageFilename = `worldlib_${book.slug}.jpg`;
      const imagePath = path.join(FRONTEND_PUBLIC, imageFilename);
      const imageUrl = `${IMAGE_BASE}/${book.slug}/${book.slug}.jpg`;

      const imageExists = fs.existsSync(imagePath);

      if (!imageExists) {
        console.log(`Downloading cover: ${book.title}...`);
        const downloaded = await downloadImage(imageUrl, imagePath);
        if (!downloaded) {
          console.log(`  Skipping ${book.title} - image download failed`);
          skipped++;
          continue;
        }
      } else {
        console.log(`Cover exists: ${book.title}`);
      }

      const coverImagePath = `/images/books/${imageFilename}`;

      const existing = await Book.findOne({ title: book.title, author: book.author });

      if (existing) {
        let changed = false;
        if (existing.coverImage !== coverImagePath) { existing.coverImage = coverImagePath; changed = true; }
        if (existing.category !== book.category) { existing.category = book.category; changed = true; }
        if (existing.publishYear !== book.publishYear) { existing.publishYear = book.publishYear; changed = true; }
        if (existing.description !== book.description) { existing.description = book.description; changed = true; }
        if (changed) {
          await existing.save();
          console.log(`  Updated: ${book.title} (category/publishYear/description/cover)`);
          updated++;
        } else {
          console.log(`  Up-to-date: ${book.title}`);
          skipped++;
        }
      } else {
        await Book.create({
          title: book.title,
          author: book.author,
          category: book.category,
          publishYear: book.publishYear,
          description: book.description,
          coverImage: coverImagePath,
          price: 0,
          totalCopies: 1,
          availableCopies: 1,
          status: "available",
          tags: ["classic", "public domain", book.category.toLowerCase()],
          rating: 4.0,
          source: "World Library",
          sourceUrl: imageUrl,
        });
        console.log(`  [Added] ${book.category}: ${book.title}`);
        added++;
      }
    }

    console.log(`\nDone! Added: ${added}, Updated: ${updated}, Skipped: ${skipped}`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seed();
