import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORIES = [
  { name: "Fiction", query: "fiction", count: 10 },
  { name: "Non-Fiction", query: "non-fiction", count: 10 },
  { name: "Science", query: "science", count: 8 },
  { name: "History", query: "history", count: 8 },
  { name: "Biography", query: "biography", count: 8 },
  { name: "Children", query: "juvenile_fiction", count: 8 },
  { name: "Self-Help", query: "self-help", count: 6 },
  { name: "Business", query: "business", count: 6 },
  { name: "Technology", query: "technology", count: 6 },
  { name: "Academic", query: "textbooks", count: 6 },
];

const IMAGES_DIR = path.join(__dirname, "../frontend/public/images/books");

async function fetchBooksFromOpenLibrary(subject, limit = 10) {
  try {
    const url = `https://openlibrary.org/subjects/${subject}.json?limit=${limit}`;
    console.log(`Fetching ${limit} books from ${subject}...`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.works || [];
  } catch (error) {
    console.error(`Error fetching ${subject}:`, error.message);
    return [];
  }
}

async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const buffer = await response.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(buffer));
    return filepath;
  } catch (error) {
    console.error(`Error downloading image:`, error.message);
    return null;
  }
}

function getCoverUrl(coverId, size = "L") {
  if (!coverId) return null;
  // Use Large or Extra Large for better quality
  const sizeMap = {
    'S': 'S',
    'M': 'M', 
    'L': 'L',
    'XL': 'XL'
  };
  const selectedSize = sizeMap[size] || 'L';
  return `https://covers.openlibrary.org/b/id/${coverId}-${selectedSize}.jpg`;
}

async function processBooks() {
  const allBooks = [];
  
  // Create images directory if it doesn't exist
  try {
    await fs.mkdir(IMAGES_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  for (const category of CATEGORIES) {
    const works = await fetchBooksFromOpenLibrary(category.query, category.count);
    
    for (const work of works) {
      const coverId = work.cover_id;
      let coverImagePath = "/images/footer/book22.png"; // Default image
      
      if (coverId) {
        const coverUrl = getCoverUrl(coverId, "L");
        const imageFilename = `book_${coverId}.jpg`;
        const imagePath = path.join(IMAGES_DIR, imageFilename);
        const publicPath = `/images/books/${imageFilename}`;
        
        const downloaded = await downloadImage(coverUrl, imagePath);
        if (downloaded) {
          coverImagePath = publicPath;
        }
      }
      
      const book = {
        title: work.title || "Unknown Title",
        author: work.authors?.[0]?.name || "Unknown Author",
        isbn: work.ia?.[0] || "",
        description: "",
        category: category.name,
        subcategory: "",
        publisher: "",
        publishYear: work.first_publish_year || null,
        edition: "",
        language: "English",
        pages: 0,
        price: Math.floor(Math.random() * 50) + 10,
        totalCopies: Math.floor(Math.random() * 10) + 1,
        availableCopies: Math.floor(Math.random() * 5) + 1,
        coverImage: coverImagePath,
        tags: work.subject?.slice(0, 5) || [],
        rating: Math.random() * 2 + 3, // Random rating between 3-5
        ratingCount: Math.floor(Math.random() * 500) + 50,
        borrowCount: Math.floor(Math.random() * 200),
        badge: Math.random() > 0.7 ? "Popular" : "",
        isFeatured: Math.random() > 0.8,
        isNewRelease: Math.random() > 0.7,
        status: "available",
      };
      
      allBooks.push(book);
    }
  }
  
  // Save to JSON file
  const outputPath = path.join(__dirname, "fetched-books.json");
  await fs.writeFile(outputPath, JSON.stringify(allBooks, null, 2));
  
  console.log(`\n✅ Successfully fetched ${allBooks.length} books!`);
  console.log(`📁 Data saved to: ${outputPath}`);
  console.log(`🖼️  Images saved to: ${IMAGES_DIR}`);
  
  return allBooks;
}

processBooks().catch(console.error);
