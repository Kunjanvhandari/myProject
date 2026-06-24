import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfDir = path.resolve(__dirname, "..", "frontend", "public", "pdfs");

async function test() {
  const files = (await fs.promises.readdir(pdfDir)).filter(f => f.endsWith(".pdf"));
  const testFile = path.join(pdfDir, files[0]);
  console.log("Testing:", files[0]);

  const doc = await pdfjs.getDocument(testFile).promise;
  console.log("Pages:", doc.numPages);

  const outline = await doc.getOutline();
  if (outline && outline.length > 0) {
    console.log("Outline found:", outline.length, "items");
    outline.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.title}`);
    });
  } else {
    console.log("No outline/bookmarks in this PDF");
  }
  doc.destroy();
}

import fs from "fs";
test().catch(console.error);
