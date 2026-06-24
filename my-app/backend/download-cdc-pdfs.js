import mongoose from "mongoose";
import Book from "./models/Book.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

dotenv.config({ path: "./.env" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_DIR = path.resolve(__dirname, "..", "frontend", "public", "pdfs");

function sanitizeFilename(title) {
  return title
    .replace(/[\s]+/g, "_")
    .replace(/[^a-zA-Z0-9_\u00C0-\u024F\u0400-\u04FF\u0900-\u097F-]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, 100) + ".pdf";
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;

    const req = protocol.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlink(dest, () => {});
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const total = parseInt(res.headers["content-length"], 10) || 0;
      let downloaded = 0;
      res.on("data", (chunk) => {
        downloaded += chunk.length;
      });
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        const size = fs.statSync(dest).size;
        if (size === 0) {
          fs.unlink(dest, () => {});
          reject(new Error("Empty file"));
        } else {
          resolve(size);
        }
      });
    });
    req.on("error", (err) => {
      file.close();
      try { fs.unlinkSync(dest); } catch {}
      reject(err);
    });
    req.on("timeout", () => {
      req.destroy();
      file.close();
      try { fs.unlinkSync(dest); } catch {}
      reject(new Error("Timeout"));
    });
  });
}

async function main() {
  if (!fs.existsSync(PDF_DIR)) {
    fs.mkdirSync(PDF_DIR, { recursive: true });
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB\n");

  const books = await Book.find({ source: "CDC Nepal", sourceUrl: { $ne: "" } });
  console.log(`Found ${books.length} CDC Nepal books with sourceUrl\n`);

  let ok = 0, fail = 0, skip = 0;

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const url = book.sourceUrl;
    const fname = sanitizeFilename(book.title);
    const dest = path.join(PDF_DIR, fname);

    if (fs.existsSync(dest)) {
      console.log(`  [${i + 1}/${books.length}] SKIP (exists) ${book.title}`);
      book.sourceUrl = `/pdfs/${fname}`;
      await book.save();
      skip++;
      continue;
    }

    process.stdout.write(`  [${i + 1}/${books.length}] ${book.title} ... `);
    try {
      const size = await download(url, dest);
      const sizeMB = (size / (1024 * 1024)).toFixed(1);
      console.log(`${sizeMB} MB OK`);
      book.sourceUrl = `/pdfs/${fname}`;
      await book.save();
      ok++;
    } catch (err) {
      console.log(`FAIL (${err.message})`);
      fail++;
    }

    if (i < books.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`\nDone! Downloaded: ${ok}, Skipped: ${skip}, Failed: ${fail}`);
  mongoose.connection.close();
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
