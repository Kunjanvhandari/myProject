const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  sourceUrl: { type: String, default: "" },
  source: { type: String, default: "" },
});

const Book = mongoose.model("Book", bookSchema);

function normalize(str) {
  return str
    .replace(/\.pdf$/i, "")
    .replace(/_\d{4}$/, "")
    .replace(/[_\-–—]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

async function matchPdfs() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const pdfDir = path.join(__dirname, "..", "frontend", "public", "pdfs");
  const files = fs.readdirSync(pdfDir).filter((f) => f.endsWith(".pdf"));
  console.log(`Found ${files.length} PDFs\n`);

  const pdfMap = {};
  for (const file of files) {
    const key = normalize(file);
    if (!pdfMap[key]) pdfMap[key] = [];
    pdfMap[key].push(file);
  }

  const books = await Book.find({ sourceUrl: { $in: ["", null, undefined] } });
  console.log(`Books without sourceUrl: ${books.length}\n`);

  let matched = 0;

  for (const book of books) {
    const bookKey = normalize(book.title);
    const match = pdfMap[bookKey];

    if (match) {
      const pdfFile = match[0];
      book.sourceUrl = `/pdfs/${pdfFile}`;
      book.source = "CDC Nepal";
      await book.save();
      console.log(`MATCH: "${book.title}" -> ${pdfFile}`);
      matched++;
    }
  }

  console.log(`\nUpdated ${matched} books with PDF URLs`);
  console.log(`Still unmatched: ${books.length - matched} books`);

  const unmatched = [];
  for (const [key, files] of Object.entries(pdfMap)) {
    const hasMatch = books.some((b) => b.sourceUrl && b.sourceUrl.includes(files[0]));
    if (!hasMatch) {
      const stillNoUrl = books.filter((b) => b.sourceUrl === "" || !b.sourceUrl);
      const alreadyMatched = books.filter((b) => b.sourceUrl && b.sourceUrl.includes(files[0]));
      if (alreadyMatched.length === 0) {
        unmatched.push({ key, files });
      }
    }
  }

  if (unmatched.length > 0) {
    console.log("\nUnmatched PDFs (may need fuzzy matching):");
    for (const u of unmatched) {
      console.log(`  PDF: ${u.files[0]} (key: ${u.key})`);
    }
  }
  await mongoose.disconnect();
}

matchPdfs().catch(console.error);
