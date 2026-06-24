import mongoose from "mongoose";
import Book from "./models/Book.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

dotenv.config({ path: "./.env" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_DIR = path.resolve(__dirname, "..", "frontend", "public", "pdfs");

async function parseOutlineItems(doc, items, depth = 0) {
  const result = [];
  for (const item of items) {
    let pageNum = null;
    if (item.dest) {
      const ref = item.dest[0];
      if (typeof ref === "number") {
        pageNum = ref + 1;
      } else if (ref && typeof ref === "object" && ref.num !== undefined) {
        try {
          const pageIndex = await doc.getPageIndex(ref);
          pageNum = pageIndex + 1;
        } catch {}
      }
    }
    result.push({ title: item.title, page: pageNum, depth });
    if (item.items && item.items.length > 0) {
      result.push(...await parseOutlineItems(doc, item.items, depth + 1));
    }
  }
  return result;
}

async function extractChapters(filePath) {
  try {
    const doc = await pdfjs.getDocument(filePath).promise;
    const numPages = doc.numPages;
    let chapters = [];

    const outline = await doc.getOutline();
    if (outline && outline.length > 0) {
      chapters = await parseOutlineItems(doc, outline);
    } else {
      for (let i = 1; i <= Math.min(numPages, 5); i++) {
        const page = await doc.getPage(i);
        const text = await page.getTextContent();
        const fullText = text.items.map((t) => t.str).join(" ");
        const lines = fullText.split("\n").map((l) => l.trim()).filter(Boolean);
        for (const line of lines) {
          if (
            line.length > 5 &&
            line.length < 200 &&
            /[अ-हA-Za-z]/.test(line) &&
            !line.includes("http") &&
            !line.includes("www") &&
            !line.match(/^\d+\s*$/)
          ) {
            chapters.push({ title: line, page: i, depth: 0 });
          }
        }
        if (chapters.length > 20) break;
      }
    }

    doc.destroy();
    return { numPages, chapters };
  } catch (err) {
    return { numPages: 0, chapters: [], error: err.message };
  }
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB\n");

  if (!fs.existsSync(PDF_DIR)) {
    console.log("PDF directory not found");
    process.exit(1);
  }

  const books = await Book.find({
    source: "CDC Nepal",
    sourceUrl: { $regex: /^\/pdfs\// },
  });
  console.log(`Found ${books.length} books with local PDFs\n`);

  let ok = 0, fail = 0;

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const fname = path.basename(book.sourceUrl);
    const filePath = path.join(PDF_DIR, fname);

    if (!fs.existsSync(filePath)) {
      console.log(`  [${i + 1}/${books.length}] SKIP (file missing) ${book.title}`);
      fail++;
      continue;
    }

    process.stdout.write(`  [${i + 1}/${books.length}] ${book.title} ... `);
    const result = await extractChapters(filePath);

    if (result.error) {
      console.log(`FAIL (${result.error})`);
      fail++;
    } else {
      book.pages = result.numPages;
      if (result.chapters.length > 0) {
        book.chapters = result.chapters.slice(0, 50);
      }
      await book.save();
      console.log(`${result.numPages} pages, ${result.chapters.length} chapters`);
      ok++;
    }
  }

  console.log(`\nDone! Processed: ${ok}, Failed: ${fail}`);
  mongoose.connection.close();
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
