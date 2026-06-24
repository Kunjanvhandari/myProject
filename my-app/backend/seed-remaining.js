import mongoose from "mongoose";
import Book from "./models/Book.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const categories = {
  "Non-Fiction": [
    "Atomic Habits|James Clear|9780735211292|https://covers.openlibrary.org/b/id/9829028-L.jpg|Self-Help",
    "Sapiens|Yuval Noah Harari|9780062316097|https://covers.openlibrary.org/b/id/8634250-L.jpg|History",
    "The Psychology of Money|Morgan Housel|9780857197689|https://covers.openlibrary.org/b/id/968312-L.jpg|Finance",
    "Thinking Fast and Slow|Daniel Kahneman|9780374533557|https://covers.openlibrary.org/b/id/5634516-L.jpg|Psychology",
    "The Power of Now|Eckhart Tolle|9781577314806|https://covers.openlibrary.org/b/id/9280435-L.jpg|Spirituality",
    "Educated|Tara Westover|9780399590504|https://covers.openlibrary.org/b/id/12746894-L.jpg|Memoir",
    "The 7 Habits|Stephen Covey|9781982137274|https://covers.openlibrary.org/b/id/9829028-L.jpg|Self-Help",
    "Rich Dad Poor Dad|Robert Kiyosaki|9781612680194|https://covers.openlibrary.org/b/id/968312-L.jpg|Finance",
    "Deep Work|Cal Newport|9781455586691|https://covers.openlibrary.org/b/id/5951738-L.jpg|Productivity",
    "Man's Search for Meaning|Viktor Frankl|9780807014295|https://covers.openlibrary.org/b/id/8443662-L.jpg|Psychology"
  ],
  "Business": [
    "The Lean Startup|Eric Ries|9780307887894|https://covers.openlibrary.org/b/id/12707846-L.jpg|Entrepreneurship",
    "Good to Great|Jim Collins|9780066620992|https://covers.openlibrary.org/b/id/12707846-L.jpg|Management",
    "Zero to One|Peter Thiel|9780804139298|https://covers.openlibrary.org/b/id/12707846-L.jpg|Entrepreneurship",
    "The E-Myth Revisited|Michael Gerber|9780887307287|https://covers.openlibrary.org/b/id/12707846-L.jpg|Entrepreneurship",
    "Crushing It!|Gary Vaynerchuk|9780062674679|https://covers.openlibrary.org/b/id/12707846-L.jpg|Marketing",
    "The Personal MBA|Josh Kaufman|9781591845571|https://covers.openlibrary.org/b/id/12707846-L.jpg|Education",
    "Start with Why|Simon Sinek|9781591846448|https://covers.openlibrary.org/b/id/12707846-L.jpg|Leadership",
    "Think and Grow Rich|Napoleon Hill|9781585424337|https://covers.openlibrary.org/b/id/968312-L.jpg|Success",
    "The 4-Hour Workweek|Timothy Ferriss|9780307465351|https://covers.openlibrary.org/b/id/12707846-L.jpg|Lifestyle",
    "The Intelligent Investor|Benjamin Graham|9780060555665|https://covers.openlibrary.org/b/id/968312-L.jpg|Finance"
  ],
  "Technology": [
    "The Innovators|Walter Isaacson|9781476708690|https://covers.openlibrary.org/b/id/12707846-L.jpg|History",
    "Steve Jobs|Walter Isaacson|9781451648539|https://covers.openlibrary.org/b/id/12707846-L.jpg|Biography",
    "Clean Code|Robert Martin|9780132350884|https://covers.openlibrary.org/b/id/5951738-L.jpg|Programming",
    "The Pragmatic Programmer|David Thomas|9780201616224|https://covers.openlibrary.org/b/id/5951738-L.jpg|Programming",
    "Design Patterns|Erich Gamma|9780201633610|https://covers.openlibrary.org/b/id/5951738-L.jpg|Programming",
    "Python Crash Course|Eric Matthes|9781593276034|https://covers.openlibrary.org/b/id/5951738-L.jpg|Programming",
    "Eloquent JavaScript|Marijn Haverbeke|9781593279500|https://covers.openlibrary.org/b/id/5951738-L.jpg|Programming",
    "The Mythical Man-Month|Frederick Brooks|9780201835953|https://covers.openlibrary.org/b/id/5951738-L.jpg|Project Management",
    "The DevOps Handbook|Gene Kim|9781942788003|https://covers.openlibrary.org/b/id/5951738-L.jpg|DevOps",
    "The Design of Everyday Things|Don Norman|9780465050659|https://covers.openlibrary.org/b/id/5951738-L.jpg|Design"
  ],
  "Biography": [
    "The Diary of a Young Girl|Anne Frank|9780553296983|https://covers.openlibrary.org/b/id/9280435-L.jpg|Memoir",
    "Long Walk to Freedom|Nelson Mandela|9780316548182|https://covers.openlibrary.org/b/id/12746894-L.jpg|Memoir",
    "The Autobiography of Malcolm X|Malcolm X|9780345350688|https://covers.openlibrary.org/b/id/12746894-L.jpg|Memoir",
    "Einstein|Walter Isaacson|9780743264730|https://covers.openlibrary.org/b/id/12746894-L.jpg|Science",
    "When Breath Becomes Air|Paul Kalanithi|9780812988406|https://covers.openlibrary.org/b/id/12746894-L.jpg|Memoir",
    "Becoming|Michelle Obama|9781524763138|https://covers.openlibrary.org/b/id/12746894-L.jpg|Memoir",
    "Night|Elie Wiesel|9780374500016|https://covers.openlibrary.org/b/id/9280435-L.jpg|Memoir",
    "The Glass Castle|Jeannette Walls|9780743247542|https://covers.openlibrary.org/b/id/12746894-L.jpg|Memoir",
    "Steve Jobs|Walter Isaacson|9781451648539|https://covers.openlibrary.org/b/id/12707846-L.jpg|Technology",
    "Shoe Dog|Phil Knight|9781501135910|https://covers.openlibrary.org/b/id/12707846-L.jpg|Business"
  ],
  "Philosophy": [
    "Sophie's World|Jostein Gaarder|9780374530716|https://covers.openlibrary.org/b/id/5634516-L.jpg|Introduction",
    "Thus Spoke Zarathustra|Friedrich Nietzsche|9780140441185|https://covers.openlibrary.org/b/id/5634516-L.jpg|Existentialism",
    "Meditations|Marcus Aurelius|9780812964855|https://covers.openlibrary.org/b/id/5634516-L.jpg|Stoicism",
    "The Republic|Plato|9780140455113|https://covers.openlibrary.org/b/id/5634516-L.jpg|Classical",
    "The Stranger|Albert Camus|9780679720201|https://covers.openlibrary.org/b/id/5634516-L.jpg|Absurdism",
    "The Prince|Niccolo Machiavelli|9780140449150|https://covers.openlibrary.org/b/id/5634516-L.jpg|Political",
    "The Social Contract|Jean-Jacques Rousseau|9780140442014|https://covers.openlibrary.org/b/id/5634516-L.jpg|Political",
    "Man's Search for Meaning|Viktor Frankl|9780807014295|https://covers.openlibrary.org/b/id/8443662-L.jpg|Existentialism",
    "Walden|Henry David Thoreau|9780486284958|https://covers.openlibrary.org/b/id/5634516-L.jpg|Transcendentalism",
    "Zen and the Art of Motorcycle Maintenance|Robert Pirsig|9780061673735|https://covers.openlibrary.org/b/id/5634516-L.jpg|Metaphysics"
  ],
  "Academic": [
    "Guns, Germs, and Steel|Jared Diamond|9780393317558|https://covers.openlibrary.org/b/id/490106-L.jpg|History",
    "A Brief History of Time|Stephen Hawking|9780553380163|https://covers.openlibrary.org/b/id/368541-L.jpg|Physics",
    "The Selfish Gene|Richard Dawkins|9780199291151|https://covers.openlibrary.org/b/id/490106-L.jpg|Biology",
    "Cosmos|Carl Sagan|9780345331359|https://covers.openlibrary.org/b/id/5269972-L.jpg|Astronomy",
    "The Gene|Siddhartha Mukherjee|9781476733500|https://covers.openlibrary.org/b/id/8634250-L.jpg|Biology",
    "The Structure of Scientific Revolutions|Thomas Kuhn|9780226458083|https://covers.openlibrary.org/b/id/368541-L.jpg|Philosophy of Science",
    "Silent Spring|Rachel Carson|9780618249063|https://covers.openlibrary.org/b/id/5269972-L.jpg|Environmental Science",
    "Astrophysics for People in a Hurry|Neil deGrasse Tyson|9780393609394|https://covers.openlibrary.org/b/id/5269972-L.jpg|Astronomy",
    "Sapiens|Yuval Noah Harari|9780062316097|https://covers.openlibrary.org/b/id/8634250-L.jpg|History",
    "The Sixth Extinction|Elizabeth Kolbert|9780805092998|https://covers.openlibrary.org/b/id/5269972-L.jpg|Environmental Science"
  ]
};

async function seedRemaining() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    let totalAdded = 0;

    for (const [category, books] of Object.entries(categories)) {
      const bookDocs = books.map((bookStr, idx) => {
        const [title, author, isbn, coverImage, subcategory] = bookStr.split("|");
        return {
          title: idx > 0 ? `${title} (Vol.${idx+1})` : title,
          author,
          isbn,
          description: `A ${category.toLowerCase()} book titled ${title}`,
          category,
          subcategory,
          publisher: "Various Publishers",
          publishYear: 2000 + Math.floor(Math.random() * 24),
          pages: Math.floor(Math.random() * 500) + 100,
          price: Math.floor(Math.random() * 20) + 10,
          totalCopies: Math.floor(Math.random() * 10) + 3,
          availableCopies: Math.floor(Math.random() * 8) + 2,
          coverImage,
          tags: [category.toLowerCase(), subcategory.toLowerCase()],
          rating: (Math.random() * 2 + 3).toFixed(1),
          ratingCount: Math.floor(Math.random() * 1000) + 100,
          borrowCount: Math.floor(Math.random() * 500) + 50,
          badge: Math.random() > 0.7 ? "Popular" : "",
          isFeatured: Math.random() > 0.7,
          isNewRelease: Math.random() > 0.8,
          status: "available"
        };
      });

      await Book.insertMany(bookDocs);
      totalAdded += bookDocs.length;
      console.log(`✅ Seeded ${bookDocs.length} ${category} books`);
    }

    console.log(`\n🎉 Total new books added: ${totalAdded}`);
    console.log(`📚 Grand total: ${totalAdded + 150} books`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seedRemaining();
