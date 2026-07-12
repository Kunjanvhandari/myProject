var sliderImages = [
  { id: 1, image: "images/footer/book22.png", title: "The Psychology of Money", subtitle: "Morgan Housel" },
  { id: 2, image: "images/footer/book19.svg", title: "Atomic Habits", subtitle: "James Clear" },
  { id: 3, image: "images/books/book_14618737.jpg", title: "The Alchemist", subtitle: "Paulo Coelho" },
  { id: 4, image: "images/books/book_12875748.jpg", title: "Rich Dad Poor Dad", subtitle: "Robert Kiyosaki" },
  { id: 5, image: "images/books/book_12973053.jpg", title: "Think and Grow Rich", subtitle: "Napoleon Hill" },
  { id: 6, image: "images/books/book_14314858.jpg", title: "Deep Work", subtitle: "Cal Newport" }
];

var featuredBooks = [
  {
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    rating: 4.8,
    price: 599,
    badge: "Best Seller",
    image: "images/footer/book22.png"
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    rating: 4.9,
    price: 699,
    badge: "Trending",
    image: "images/footer/book19.svg"
  },
  {
    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    rating: 4.5,
    price: 549,
    badge: "Popular",
    image: "images/books/book_14314858.jpg"
  },
  {
    id: 4,
    title: "The Alchemist",
    author: "Paulo Coelho",
    rating: 4.7,
    price: 499,
    badge: "Classic",
    image: "images/books/book_14618737.jpg"
  }
];

var ebooks = [
  {
    id: 1,
    title: "Class 10 - Science & Technology",
    author: "NEB",
    format: "PDF",
    size: "\u2014",
    image: "images/books/book_subject_science.svg",
    file: "books/class10/Science.pdf"
  },
  {
    id: 2,
    title: "Class 10 - Mathematics",
    author: "NEB",
    format: "PDF",
    size: "\u2014",
    image: "images/books/book_subject_math.svg",
    file: "books/class10/Mathematics.pdf"
  },
  {
    id: 3,
    title: "Class 11 - Physics",
    author: "NEB",
    format: "PDF",
    size: "\u2014",
    image: "images/books/book_subject_physics.svg",
    file: "books/class11/Physics.pdf"
  },
  {
    id: 4,
    title: "Class 12 - Biology",
    author: "NEB",
    format: "PDF",
    size: "\u2014",
    image: "images/books/book_subject_biology.svg",
    file: "books/class12/Biology.pdf"
  }
];

var categories = [
  { id: 1, name: "Fiction", emoji: "&#128214;", count: 1250 },
  { id: 2, name: "Non-Fiction", emoji: "&#128218;", count: 980 },
  { id: 3, name: "Science", emoji: "&#128300;", count: 750 },
  { id: 4, name: "Technology", emoji: "&#128187;", count: 620 },
  { id: 5, name: "History", emoji: "&#127758;", count: 540 },
  { id: 6, name: "Self-Help", emoji: "&#128161;", count: 890 },
  { id: 7, name: "Business", emoji: "&#128188;", count: 710 },
  { id: 8, name: "Children", emoji: "&#128118;", count: 430 }
];

var statsData = [
  { label: "Physical Books", value: "50,000+", icon: "fa fa-book" },
  { label: "E-Books", value: "100,000+", icon: "fa fa-tablet-alt" },
  { label: "Active Members", value: "25,000+", icon: "fa fa-users" },
  { label: "Daily Visitors", value: "5,000+", icon: "fa fa-eye" }
];

var testimonials = [
  {
    id: 1,
    name: "Kushal Bhandari",
    role: "Student",
    image: "images/team/placeholder.svg",
    rating: 5,
    text: "Saraswati Library has been an incredible resource for my studies. The collection is vast and the staff is very helpful. I have borrowed numerous books for my exams and always found what I needed."
  },
  {
    id: 2,
    name: "Dipek Bhandari",
    role: "Researcher",
    image: "images/team/placeholder.svg",
    rating: 5,
    text: "As a researcher, I need access to a wide variety of books and journals. This library provides exactly that. The digital resources are also top-notch. Highly recommended for anyone in academia."
  },
  {
    id: 3,
    name: "Roma Pandey",
    role: "Teacher",
    image: "images/team/placeholder.svg",
    rating: 4,
    text: "I bring my students here regularly. The environment is peaceful and conducive to learning. The children's section is well-curated and my students love it. A wonderful place for education."
  }
];

var teamMembers = [
  {
    id: 1,
    name: "Kunjan Bhandari",
    role: "Founder & Lead Developer",
    age: 22,
    address: "Kathmandu, Nepal",
    phone: "+977 9743962189",
    study: "BSc.CSIT",
    image: "images/team/kunjan.jpg",
    facebook: "https://www.facebook.com/kunjan.vhandari",
    instagram: "https://instagram.com/kunjan.bhandari",
    description: "Kunjan is the visionary behind Saraswati Library. With a passion for technology and education, he has built this platform to make knowledge accessible to everyone. He leads the development team and ensures the library's digital presence is always evolving."
  }
];

var allBooks = [
  { id: 1, _id: "b01", title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", subject: "English", coverImage: "images/books/book_14618737.jpg", rating: 4.7, price: 499, availableCopies: 5, pages: 197, description: "A philosophical story about a shepherd boy named Santiago who dreams of finding treasure in the Egyptian pyramids." },
  { id: 2, _id: "b02", title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", subject: "English", coverImage: "images/books/book_12819590.jpg", rating: 4.8, price: 450, availableCopies: 3, pages: 281, description: "A novel about racial injustice in the Deep South, seen through the eyes of young Scout Finch." },
  { id: 3, _id: "b03", title: "1984", author: "George Orwell", category: "Fiction", subject: "English", coverImage: "images/books/book_13301713.jpg", rating: 4.6, price: 399, availableCopies: 7, pages: 328, description: "A dystopian novel set in a totalitarian society ruled by Big Brother." },
  { id: 4, _id: "b04", title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction", subject: "English", coverImage: "images/books/book_8236351.jpg", rating: 4.5, price: 350, availableCopies: 4, pages: 432, description: "A romantic novel exploring themes of love, reputation, and class in early 19th-century England." },
  { id: 5, _id: "b05", title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", subject: "English", coverImage: "images/books/book_12707846.jpg", rating: 4.4, price: 375, availableCopies: 6, pages: 180, description: "A story of wealth, love, and the American Dream set in the Roaring Twenties." },
  { id: 6, _id: "b06", title: "Sapiens", author: "Yuval Noah Harari", category: "Non-Fiction", subject: "Social Studies", coverImage: "images/books/book_11848636.jpg", rating: 4.8, price: 799, availableCopies: 4, pages: 443, description: "A sweeping history of humankind from the Stone Age to the present." },
  { id: 7, _id: "b07", title: "Educated", author: "Tara Westover", category: "Non-Fiction", subject: "English", coverImage: "images/books/book_12043351.jpg", rating: 4.6, price: 599, availableCopies: 3, pages: 334, description: "A memoir about a woman who grows up in a survivalist family and eventually earns a PhD from Cambridge." },
  { id: 8, _id: "b08", title: "Becoming", author: "Michelle Obama", category: "Non-Fiction", subject: "English", coverImage: "images/books/book_12393037.jpg", rating: 4.7, price: 899, availableCopies: 2, pages: 448, description: "The memoir of former First Lady Michelle Obama, chronicling her journey from childhood to the White House." },
  { id: 9, _id: "b09", title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", category: "Non-Fiction", subject: "Science", coverImage: "images/books/book_7242794.jpg", rating: 4.5, price: 650, availableCopies: 3, pages: 381, description: "The story of the woman whose cancer cells were used to create the first immortal human cell line." },
  { id: 10, _id: "b10", title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", subject: "Science", coverImage: "images/books/book_10478466.jpg", rating: 4.9, price: 699, availableCopies: 5, pages: 256, description: "A landmark volume in science writing that explores the nature of the universe." },
  { id: 11, _id: "b11", title: "The Origin of Species", author: "Charles Darwin", category: "Science", subject: "Science", coverImage: "images/books/book_10043864.jpg", rating: 4.5, price: 550, availableCopies: 2, pages: 502, description: "The foundational work of evolutionary biology, presenting evidence for evolution through natural selection." },
  { id: 12, _id: "b12", title: "Cosmos", author: "Carl Sagan", category: "Science", subject: "Science", coverImage: "images/books/book_13405534.jpg", rating: 4.8, price: 650, availableCopies: 4, pages: 365, description: "A sweeping tour of the universe with Carl Sagan, exploring the cosmos and our place within it." },
  { id: 13, _id: "b13", title: "The Gene", author: "Siddhartha Mukherjee", category: "Science", subject: "Science", coverImage: "images/books/book_11962006.jpg", rating: 4.6, price: 720, availableCopies: 3, pages: 496, description: "An intimate history of the gene and the science of genetic inheritance." },
  { id: 14, _id: "b14", title: "Clean Code", author: "Robert C. Martin", category: "Technology", subject: "Computer", coverImage: "images/books/book_368541.jpg", rating: 4.7, price: 750, availableCopies: 6, pages: 464, description: "A handbook of agile software craftsmanship, teaching principles of writing clean, maintainable code." },
  { id: 15, _id: "b15", title: "The Pragmatic Programmer", author: "David Thomas", category: "Technology", subject: "Computer", coverImage: "images/books/book_5654516.jpg", rating: 4.6, price: 800, availableCopies: 4, pages: 352, description: "A guide to becoming a better programmer through practical tips and techniques." },
  { id: 16, _id: "b16", title: "Code Complete", author: "Steve McConnell", category: "Technology", subject: "Computer", coverImage: "images/books/book_6052194.jpg", rating: 4.8, price: 850, availableCopies: 3, pages: 960, description: "A comprehensive guide to software construction, covering topics from design to testing." },
  { id: 17, _id: "b17", title: "Design Patterns", author: "Gang of Four", category: "Technology", subject: "Computer", coverImage: "images/books/book_4849549.jpg", rating: 4.5, price: 900, availableCopies: 2, pages: 395, description: "The classic reference book on software design patterns, essential for every developer." },
  { id: 18, _id: "b18", title: "Guns, Germs, and Steel", author: "Jared Diamond", category: "History", subject: "Social Studies", coverImage: "images/books/book_2808666.jpg", rating: 4.5, price: 600, availableCopies: 3, pages: 480, description: "A short history of everybody for the last 13,000 years, exploring why some civilizations conquered others." },
  { id: 19, _id: "b19", title: "The Art of War", author: "Sun Tzu", category: "History", subject: "Social Studies", coverImage: "images/books/book_29376.jpg", rating: 4.7, price: 300, availableCopies: 8, pages: 68, description: "An ancient Chinese military treatise that has become a classic on strategy and tactics." },
  { id: 20, _id: "b20", title: "SPQR", author: "Mary Beard", category: "History", subject: "Social Studies", coverImage: "images/books/book_13335427.jpg", rating: 4.4, price: 650, availableCopies: 2, pages: 608, description: "A history of ancient Rome, from its founding myths to the rise of the Roman Empire." },
  { id: 21, _id: "b21", title: "A People's History of the United States", author: "Howard Zinn", category: "History", subject: "Social Studies", coverImage: "images/books/book_490106.jpg", rating: 4.6, price: 580, availableCopies: 4, pages: 729, description: "A retelling of American history from the perspective of marginalized groups." },
  { id: 22, _id: "b22", title: "Atomic Habits", author: "James Clear", category: "Self-Help", subject: "English", coverImage: "images/footer/book19.svg", rating: 4.9, price: 699, availableCopies: 10, pages: 320, description: "A proven framework for improving every day through tiny changes and habit formation." },
  { id: 23, _id: "b23", title: "Think and Grow Rich", author: "Napoleon Hill", category: "Self-Help", subject: "Business", coverImage: "images/books/book_12973053.jpg", rating: 4.6, price: 450, availableCopies: 6, pages: 238, description: "A personal development and self-help book on the importance of positive thinking." },
  { id: 24, _id: "b24", title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", category: "Self-Help", subject: "English", coverImage: "images/books/book_1094494.jpg", rating: 4.7, price: 599, availableCopies: 5, pages: 381, description: "A self-help book presenting a holistic, integrated approach to solving personal and professional problems." },
  { id: 25, _id: "b25", title: "The Power of Now", author: "Eckhart Tolle", category: "Self-Help", subject: "English", coverImage: "images/books/book_1241487.jpg", rating: 4.5, price: 499, availableCopies: 4, pages: 236, description: "A guide to spiritual enlightenment through living in the present moment." },
  { id: 26, _id: "b26", title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Business", subject: "Business", coverImage: "images/books/book_12875748.jpg", rating: 4.7, price: 549, availableCopies: 7, pages: 336, description: "A personal finance book that advocates financial independence through investing and building businesses." },
  { id: 27, _id: "b27", title: "The Lean Startup", author: "Eric Ries", category: "Business", subject: "Business", coverImage: "images/books/book_11277564.jpg", rating: 4.5, price: 650, availableCopies: 3, pages: 336, description: "A methodology for developing businesses and products through validated learning." },
  { id: 28, _id: "b28", title: "Good to Great", author: "Jim Collins", category: "Business", subject: "Business", coverImage: "images/books/book_1048892.jpg", rating: 4.4, price: 700, availableCopies: 4, pages: 320, description: "An analysis of why some companies make the leap from being good to being great." },
  { id: 29, _id: "b29", title: "Zero to One", author: "Peter Thiel", category: "Business", subject: "Business", coverImage: "images/books/book_13119794.jpg", rating: 4.6, price: 600, availableCopies: 5, pages: 224, description: "Notes on startups and how to build the future, by the co-founder of PayPal." },
  { id: 30, _id: "b30", title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", category: "Children", subject: "English", coverImage: "images/books/book_10590366.jpg", rating: 4.9, price: 599, availableCopies: 8, pages: 309, description: "A young wizard discovers his magical heritage and begins his education at Hogwarts." },
  { id: 31, _id: "b31", title: "Charlotte's Web", author: "E.B. White", category: "Children", subject: "English", coverImage: "images/books/book_5915025.jpg", rating: 4.6, price: 350, availableCopies: 5, pages: 184, description: "The story of a pig named Wilbur and his friendship with a barn spider named Charlotte." },
  { id: 32, _id: "b32", title: "The Cat in the Hat", author: "Dr. Seuss", category: "Children", subject: "English", coverImage: "images/books/book_2523104.jpg", rating: 4.5, price: 299, availableCopies: 6, pages: 61, description: "A beloved children's book about a mischievous cat who brings chaos to a rainy day." },
  { id: 33, _id: "b33", title: "The Psychology of Money", author: "Morgan Housel", category: "Business", subject: "Business", coverImage: "images/footer/book22.png", rating: 4.8, price: 599, availableCopies: 9, pages: 256, description: "Timeless lessons on wealth, greed, and happiness through 19 short stories." },
  { id: 34, _id: "b34", title: "Deep Work", author: "Cal Newport", category: "Self-Help", subject: "English", coverImage: "images/books/book_14314858.jpg", rating: 4.5, price: 549, availableCopies: 4, pages: 296, description: "Rules for focused success in a distracted world, making the case for deep work." },
  { id: 35, _id: "b35", title: "Norwegian Wood", author: "Haruki Murakami", category: "Fiction", subject: "English", coverImage: "images/books/book_11621024.jpg", rating: 4.3, price: 480, availableCopies: 3, pages: 296, description: "A nostalgic story of loss and sexuality set in 1960s Tokyo." },
  { id: 36, _id: "b36", title: "Brief Answers to the Big Questions", author: "Stephen Hawking", category: "Science", subject: "Science", coverImage: "images/books/book_11929973.jpg", rating: 4.7, price: 650, availableCopies: 4, pages: 256, description: "Stephen Hawking's final book exploring the biggest questions in science and philosophy." },
  { id: 37, _id: "b37", title: "The Catcher in the Rye", author: "J.D. Salinger", category: "Fiction", subject: "English", coverImage: "images/books/book_968312.jpg", rating: 4.3, price: 399, availableCopies: 5, pages: 277, description: "A story about teenage angst and alienation, narrated by the iconic Holden Caulfield." },
  { id: 38, _id: "b38", title: "One Hundred Years of Solitude", author: "Gabriel Garcia Marquez", category: "Fiction", subject: "English", coverImage: "images/books/book_12569842.jpg", rating: 4.7, price: 550, availableCopies: 3, pages: 417, description: "A landmark novel of magical realism tracing the Buendia family through seven generations." },
  { id: 39, _id: "b39", title: "The Odyssey", author: "Homer", category: "Fiction", subject: "English", coverImage: "images/books/book_78169.jpg", rating: 4.6, price: 350, availableCopies: 4, pages: 541, description: "The classic epic poem following Odysseus on his journey home after the Trojan War." },
  { id: 40, _id: "b40", title: "Don Quixote", author: "Miguel de Cervantes", category: "Fiction", subject: "English", coverImage: "images/books/book_262763.jpg", rating: 4.5, price: 400, availableCopies: 3, pages: 863, description: "A Spanish novel about an aging nobleman who loses his sanity reading chivalric romances." },
  { id: 41, _id: "b41", title: "Fahrenheit 451", author: "Ray Bradbury", category: "Fiction", subject: "English", coverImage: "images/books/book_872432.jpg", rating: 4.4, price: 380, availableCopies: 5, pages: 194, description: "A dystopian novel about a fireman tasked with burning books in a future society." },
  { id: 42, _id: "b42", title: "Brave New World", author: "Aldous Huxley", category: "Fiction", subject: "English", coverImage: "images/books/book_919361.jpg", rating: 4.5, price: 399, availableCopies: 4, pages: 311, description: "A dystopian novel set in a futuristic World State with genetically modified citizens." },
  { id: 43, _id: "b43", title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fiction", subject: "English", coverImage: "images/books/book_11248037.jpg", rating: 4.8, price: 550, availableCopies: 6, pages: 310, description: "Bilbo Baggins embarks on an unexpected adventure with a group of dwarves and a wizard." },
  { id: 44, _id: "b44", title: "Foundation", author: "Isaac Asimov", category: "Fiction", subject: "Science", coverImage: "images/books/book_2959802.jpg", rating: 4.7, price: 480, availableCopies: 4, pages: 244, description: "A science fiction classic about the fall of the Galactic Empire and the efforts to preserve knowledge." },
  { id: 45, _id: "b45", title: "Dune", author: "Frank Herbert", category: "Fiction", subject: "Science", coverImage: "images/books/book_13322313.jpg", rating: 4.8, price: 599, availableCopies: 5, pages: 688, description: "An epic science fiction novel set in the distant future amidst a complex feudal interstellar society." },
  { id: 46, _id: "b46", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Non-Fiction", subject: "Science", coverImage: "images/books/book_11849209.jpg", rating: 4.6, price: 700, availableCopies: 3, pages: 499, description: "A groundbreaking tour of the mind explaining the two systems that drive the way we think." },
  { id: 47, _id: "b47", title: "The Power of Habit", author: "Charles Duhigg", category: "Non-Fiction", subject: "English", coverImage: "images/books/book_12818862.jpg", rating: 4.5, price: 599, availableCopies: 4, pages: 371, description: "An exploration of the science behind habit formation and how habits can be changed." },
  { id: 48, _id: "b48", title: "Outliers", author: "Malcolm Gladwell", category: "Non-Fiction", subject: "English", coverImage: "images/books/book_12746894.jpg", rating: 4.6, price: 550, availableCopies: 5, pages: 336, description: "A look at what makes high-achievers different, exploring factors like opportunity and cultural legacy." },
  { id: 49, _id: "b49", title: "The Diary of a Young Girl", author: "Anne Frank", category: "Non-Fiction", subject: "Social Studies", coverImage: "images/books/book_2404583.jpg", rating: 4.8, price: 350, availableCopies: 6, pages: 283, description: "The writings of Anne Frank while in hiding during the Nazi occupation of the Netherlands." },
  { id: 50, _id: "b50", title: "Wings of Fire", author: "A.P.J. Abdul Kalam", category: "Non-Fiction", subject: "English", coverImage: "images/books/book_2560652.jpg", rating: 4.7, price: 450, availableCopies: 5, pages: 180, description: "The autobiography of India's beloved President and aerospace scientist." },
  { id: 51, _id: "b51", title: "Mathematics for Class 10", author: "NCERT", category: "Science", subject: "Math", coverImage: "images/books/book_subject_math.svg", rating: 4.3, price: 250, availableCopies: 15, pages: 340, description: "Comprehensive mathematics textbook for Class 10 students covering algebra, geometry, trigonometry, and statistics." },
  { id: 52, _id: "b52", title: "Science for Class 10", author: "NCERT", category: "Science", subject: "Science", coverImage: "images/books/book_subject_science.svg", rating: 4.4, price: 300, availableCopies: 12, pages: 280, description: "Integrated science textbook covering physics, chemistry, and biology for Class 10 students." },
  { id: 53, _id: "b53", title: "Nepali Sahitya", author: "Various", category: "Non-Fiction", subject: "Nepali", coverImage: "images/books/book_subject_nepali.svg", rating: 4.2, price: 200, availableCopies: 10, pages: 220, description: "A comprehensive collection of Nepali literature for school-level students." },
  { id: 54, _id: "b54", title: "English for Today", author: "NCERT", category: "Non-Fiction", subject: "English", coverImage: "images/books/book_subject_english.svg", rating: 4.3, price: 180, availableCopies: 14, pages: 200, description: "An English language textbook designed to improve reading, writing, and comprehension skills." },
  { id: 55, _id: "b55", title: "Social Studies for Class 10", author: "NCERT", category: "History", subject: "Social Studies", coverImage: "images/books/book_subject_social.svg", rating: 4.2, price: 280, availableCopies: 11, pages: 260, description: "A comprehensive social studies textbook covering history, geography, and civics." },
  { id: 56, _id: "b56", title: "Computer Science Basics", author: "Various", category: "Technology", subject: "Computer", coverImage: "images/books/book_subject_computer.svg", rating: 4.5, price: 320, availableCopies: 8, pages: 300, description: "An introductory textbook on computer science fundamentals including programming and digital literacy." },
  { id: 57, _id: "b57", title: "The Three Musketeers", author: "Alexandre Dumas", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_three_musketeers_0712.jpg", rating: 4.6, price: 400, availableCopies: 3, pages: 628, description: "The adventures of d'Artagnan and the three musketeers Athos, Porthos, and Aramis." },
  { id: 58, _id: "b58", title: "Oliver Twist", author: "Charles Dickens", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_oliver_twist.jpg", rating: 4.5, price: 350, availableCopies: 4, pages: 530, description: "A young orphan's journey through the criminal underworld of Victorian London." },
  { id: 59, _id: "b59", title: "A Tale of Two Cities", author: "Charles Dickens", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_tale_two_cities.jpg", rating: 4.7, price: 380, availableCopies: 4, pages: 343, description: "A historical novel set in London and Paris during the French Revolution." },
  { id: 60, _id: "b60", title: "Emma", author: "Jane Austen", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_emma_solo.jpg", rating: 4.4, price: 370, availableCopies: 3, pages: 474, description: "A comedy of manners following the well-meaning but misguided Emma Woodhouse." },
  { id: 61, _id: "b61", title: "Tom Sawyer", author: "Mark Twain", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_tom_sawyer.jpg", rating: 4.6, price: 320, availableCopies: 5, pages: 274, description: "The adventures of a mischievous boy growing up along the Mississippi River." },
  { id: 62, _id: "b62", title: "Huckleberry Finn", author: "Mark Twain", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_huck_finn.jpg", rating: 4.5, price: 340, availableCopies: 4, pages: 366, description: "A young boy and an escaped slave travel down the Mississippi River on a raft." },
  { id: 63, _id: "b63", title: "The Count of Monte Cristo", author: "Alexandre Dumas", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_count_monte_cristo_0711.jpg", rating: 4.8, price: 500, availableCopies: 3, pages: 1276, description: "A story of betrayal, imprisonment, and ultimate revenge on the Island of Monte Cristo." },
  { id: 64, _id: "b64", title: "Resurrection", author: "Leo Tolstoy", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_resurrection_2_1002.jpg", rating: 4.5, price: 420, availableCopies: 3, pages: 480, description: "Tolstoy's final novel exploring themes of spiritual redemption and social justice." },
  { id: 65, _id: "b65", title: "The Sign of Four", author: "Arthur Conan Doyle", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_sign_of_four.jpg", rating: 4.6, price: 300, availableCopies: 5, pages: 220, description: "Sherlock Holmes and Dr. Watson investigate a case involving a stolen treasure and a mysterious sign." },
  { id: 66, _id: "b66", title: "Far from the Madding Crowd", author: "Thomas Hardy", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_madding_crowd_0807.jpg", rating: 4.4, price: 380, availableCopies: 3, pages: 464, description: "A pastoral novel about a spirited woman and the three suitors who pursue her." },
  { id: 67, _id: "b67", title: "The Mill on the Floss", author: "George Eliot", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_mill_on_the_floss_0812.jpg", rating: 4.3, price: 360, availableCopies: 3, pages: 540, description: "A novel about the relationship between siblings Tom and Maggie Tulliver." },
  { id: 68, _id: "b68", title: "Othello", author: "William Shakespeare", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_othello_hok.jpg", rating: 4.7, price: 280, availableCopies: 4, pages: 330, description: "A tragedy about a Moorish general who is manipulated into believing his wife is unfaithful." },
  { id: 69, _id: "b69", title: "Anna Karenina", author: "Leo Tolstoy", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_annakarenina_4_1008.jpg", rating: 4.8, price: 550, availableCopies: 3, pages: 864, description: "A complex novel about a tragic adulterous affair set against Russian high society." },
  { id: 70, _id: "b70", title: "Ethan Frome", author: "Edith Wharton", category: "Fiction", subject: "English", coverImage: "images/books/worldlib_ethan_frome_0802.jpg", rating: 4.3, price: 300, availableCopies: 4, pages: 152, description: "A tragic novella about a farmer's ill-fated attempt to escape his harsh life." },
  { id: 71, _id: "c1-nepali", title: "Class 1 - Mero Nepali", author: "NEB", category: "Class 1-5", subject: "Nepali", coverImage: "images/books/book_subject_nepali.svg", rating: 4.0, availableCopies: -1, description: "Basic Nepali language textbook for Class 1 students with alphabet, reading, and writing exercises.", pdfFile: "books/class1/Nepali.pdf" },
  { id: 72, _id: "c4-nepali", title: "Class 4 - Nepali", author: "NEB", category: "Class 1-5", subject: "Nepali", coverImage: "images/books/book_subject_nepali.svg", rating: 4.0, availableCopies: -1, description: "Nepali language textbook for Class 4 students covering literature, grammar, and composition.", pdfFile: "books/class4/Nepali.pdf" },
  { id: 73, _id: "c4-health", title: "Class 4 - Health, Physical & Creative Arts", author: "NEB", category: "Class 1-5", subject: "Health", coverImage: "images/books/book_subject_health.svg", rating: 4.0, availableCopies: -1, description: "Health, physical education, and creative arts textbook for Class 4 students.", pdfFile: "books/class4/Health.pdf" },
  { id: 74, _id: "c5-nepali", title: "Class 5 - Nepali", author: "NEB", category: "Class 1-5", subject: "Nepali", coverImage: "images/books/book_subject_nepali.svg", rating: 4.1, availableCopies: -1, description: "Nepali language textbook for Class 5 students with literature and composition.", pdfFile: "books/class5/Nepali.pdf" },
  { id: 75, _id: "c5-health", title: "Class 5 - Health, Physical & Creative Arts", author: "NEB", category: "Class 1-5", subject: "Health", coverImage: "images/books/book_subject_health.svg", rating: 4.0, availableCopies: -1, description: "Health, physical education, and creative arts textbook for Class 5 students.", pdfFile: "books/class5/Health.pdf" },
  { id: 76, _id: "c6-english", title: "Class 6 - English", author: "NEB", category: "Class 6-8", subject: "English", coverImage: "images/books/book_subject_english.svg", rating: 4.2, availableCopies: -1, description: "English textbook for Class 6 students with grammar, literature, and writing skills.", pdfFile: "books/class6/English.pdf" },
  { id: 77, _id: "c6-nepali", title: "Class 6 - Nepali", author: "NEB", category: "Class 6-8", subject: "Nepali", coverImage: "images/books/book_subject_nepali.svg", rating: 4.2, availableCopies: -1, description: "Nepali language textbook for Class 6 with prose, poetry, and grammar.", pdfFile: "books/class6/Nepali.pdf" },
  { id: 78, _id: "c6-math", title: "Class 6 - Mathematics", author: "NEB", category: "Class 6-8", subject: "Mathematics", coverImage: "images/books/book_subject_math.svg", rating: 4.3, availableCopies: -1, description: "Mathematics textbook for Class 6 covering integers, algebra, and geometry.", pdfFile: "books/class6/Mathematics.pdf" },
  { id: 79, _id: "c6-social", title: "Class 6 - Social Studies & Human Values", author: "NEB", category: "Class 6-8", subject: "Social Studies", coverImage: "images/books/book_subject_social.svg", rating: 4.1, availableCopies: -1, description: "Social Studies textbook for Class 6 covering geography, history, and civics.", pdfFile: "books/class6/Social_Studies.pdf" },
  { id: 80, _id: "c7-english", title: "Class 7 - English", author: "NEB", category: "Class 6-8", subject: "English", coverImage: "images/books/book_subject_english.svg", rating: 4.3, availableCopies: -1, description: "English textbook for Class 7 with prose, poetry, and advanced grammar.", pdfFile: "books/class7/English.pdf" },
  { id: 81, _id: "c7-nepali", title: "Class 7 - Nepali", author: "NEB", category: "Class 6-8", subject: "Nepali", coverImage: "images/books/book_subject_nepali.svg", rating: 4.3, availableCopies: -1, description: "Nepali language textbook for Class 7 with literature appreciation and writing.", pdfFile: "books/class7/Nepali.pdf" },
  { id: 82, _id: "c7-science", title: "Class 7 - Science & Technology", author: "NEB", category: "Class 6-8", subject: "Science", coverImage: "images/books/book_subject_science.svg", rating: 4.2, availableCopies: -1, description: "Science and Technology textbook for Class 7 covering physics, chemistry, and biology.", pdfFile: "books/class7/Science.pdf" },
  { id: 83, _id: "c7-social", title: "Class 7 - Social Studies & Human Values", author: "NEB", category: "Class 6-8", subject: "Social Studies", coverImage: "images/books/book_subject_social.svg", rating: 4.1, availableCopies: -1, description: "Social Studies textbook for Class 7 covering Nepali society, history, and governance.", pdfFile: "books/class7/Social_Studies.pdf" },
  { id: 84, _id: "c7-health", title: "Class 7 - Health, Physical & Creative Arts", author: "NEB", category: "Class 6-8", subject: "Health", coverImage: "images/books/book_subject_health.svg", rating: 4.0, availableCopies: -1, description: "Health, physical education, and creative arts textbook for Class 7 students.", pdfFile: "books/class7/Health.pdf" },
  { id: 85, _id: "c8-english", title: "Class 8 - English", author: "NEB", category: "Class 6-8", subject: "English", coverImage: "images/books/book_subject_english.svg", rating: 4.3, availableCopies: -1, description: "English textbook for Class 8 with literature analysis and creative writing.", pdfFile: "books/class8/English.pdf" },
  { id: 86, _id: "c8-nepali", title: "Class 8 - Nepali", author: "NEB", category: "Class 6-8", subject: "Nepali", coverImage: "images/books/book_subject_nepali.svg", rating: 4.3, availableCopies: -1, description: "Nepali language textbook for Class 8 with grammar, literature, and essay writing.", pdfFile: "books/class8/Nepali.pdf" },
  { id: 87, _id: "c8-social", title: "Class 8 - Social Studies & Human Values", author: "NEB", category: "Class 6-8", subject: "Social Studies", coverImage: "images/books/book_subject_social.svg", rating: 4.2, availableCopies: -1, description: "Social Studies textbook for Class 8 covering world history, geography, and civic responsibilities.", pdfFile: "books/class8/Social_Studies.pdf" },
  { id: 88, _id: "c9-english", title: "Class 9 - English", author: "NEB", category: "Class 9-10", subject: "English", coverImage: "images/books/book_subject_english.svg", rating: 4.4, availableCopies: -1, description: "English textbook for Class 9 with prose, poetry, drama, and grammar.", pdfFile: "books/class9/English.pdf" },
  { id: 89, _id: "c9-nepali", title: "Class 9 - Nepali", author: "NEB", category: "Class 9-10", subject: "Nepali", coverImage: "images/books/book_subject_nepali.svg", rating: 4.4, availableCopies: -1, description: "Nepali language textbook for Class 9 with literature and advanced grammar.", pdfFile: "books/class9/Nepali.pdf" },
  { id: 90, _id: "c9-science", title: "Class 9 - Science & Technology", author: "NEB", category: "Class 9-10", subject: "Science", coverImage: "images/books/book_subject_science.svg", rating: 4.3, availableCopies: -1, description: "Science and Technology textbook for Class 9 covering physics, chemistry, and biology fundamentals.", pdfFile: "books/class9/Science.pdf" },
  { id: 91, _id: "c9-social", title: "Class 9 - Social Studies", author: "NEB", category: "Class 9-10", subject: "Social Studies", coverImage: "images/books/book_subject_social.svg", rating: 4.2, availableCopies: -1, description: "Social Studies textbook for Class 9 covering history, geography, and political science.", pdfFile: "books/class9/Social_Studies.pdf" },
  { id: 92, _id: "c9-history", title: "Class 9 - History", author: "NEB", category: "Class 9-10", subject: "History", coverImage: "images/books/book_subject_social.svg", rating: 4.1, availableCopies: -1, description: "History textbook for Class 9 covering ancient, medieval, and modern history.", pdfFile: "books/class9/History.pdf" },
  { id: 93, _id: "c9-om", title: "Class 9 - Office Management & Accounting", author: "NEB", category: "Class 9-10", subject: "Office Management", coverImage: "images/books/book_subject_computer.svg", rating: 4.0, availableCopies: -1, description: "Office Management and Accounting textbook for Class 9.", pdfFile: "books/class9/Office_Management.pdf" },
  { id: 94, _id: "c9-math-optional", title: "Class 9 - Optional Mathematics", author: "NEB", category: "Class 9-10", subject: "Mathematics", coverImage: "images/books/book_subject_math.svg", rating: 4.3, availableCopies: -1, description: "Optional Mathematics textbook for Class 9 covering advanced mathematical concepts.", pdfFile: "books/class9/Optional_Mathematics.pdf" },
  { id: 95, _id: "c9-population", title: "Class 9 - Population Education", author: "NEB", category: "Class 9-10", subject: "Population Education", coverImage: "images/books/book_subject_health.svg", rating: 4.1, availableCopies: -1, description: "Population Education textbook for Class 9 covering demographics, health, and social issues.", pdfFile: "books/class9/Population_Education.pdf" },
  { id: 96, _id: "c10-english", title: "Class 10 - English", author: "NEB", category: "Class 9-10", subject: "English", coverImage: "images/books/book_subject_english.svg", rating: 4.5, availableCopies: -1, description: "English textbook for Class 10 with literature, grammar, and writing skills.", pdfFile: "books/class10/English.pdf" },
  { id: 97, _id: "c10-nepali", title: "Class 10 - Nepali", author: "NEB", category: "Class 9-10", subject: "Nepali", coverImage: "images/books/book_subject_nepali.svg", rating: 4.5, availableCopies: -1, description: "Nepali language textbook for Class 10 with prose, poetry, and essay writing.", pdfFile: "books/class10/Nepali.pdf" },
  { id: 98, _id: "c10-science", title: "Class 10 - Science & Technology", author: "NEB", category: "Class 9-10", subject: "Science", coverImage: "images/books/book_subject_science.svg", rating: 4.4, availableCopies: -1, description: "Science and Technology textbook for Class 10 covering acids and bases, electricity, heredity, and evolution.", pdfFile: "books/class10/Science.pdf" },
  { id: 99, _id: "c10-math", title: "Class 10 - Mathematics", author: "NEB", category: "Class 9-10", subject: "Mathematics", coverImage: "images/books/book_subject_math.svg", rating: 4.5, availableCopies: -1, description: "Mathematics textbook for Class 10 covering real numbers, trigonometry, and statistics.", pdfFile: "books/class10/Mathematics.pdf" },
  { id: 100, _id: "c10-social", title: "Class 10 - Social Studies", author: "NEB", category: "Class 9-10", subject: "Social Studies", coverImage: "images/books/book_subject_social.svg", rating: 4.3, availableCopies: -1, description: "Social Studies textbook for Class 10 covering democracy, development, and globalization.", pdfFile: "books/class10/Social_Studies.pdf" },
  { id: 101, _id: "c10-economics", title: "Class 10 - Economics", author: "NEB", category: "Class 9-10", subject: "Economics", coverImage: "images/books/book_subject_economics.svg", rating: 4.2, availableCopies: -1, description: "Economics textbook for Class 10 covering basic economic concepts and Nepali economy.", pdfFile: "books/class10/Economics.pdf" },
  { id: 102, _id: "c10-geography", title: "Class 10 - Geography", author: "NEB", category: "Class 9-10", subject: "Geography", coverImage: "images/books/book_subject_geography.svg", rating: 4.2, availableCopies: -1, description: "Geography textbook for Class 10 covering physical geography, resources, and development.", pdfFile: "books/class10/Geography.pdf" },
  { id: 103, _id: "c10-cs", title: "Class 10 - Computer Science", author: "NEB", category: "Class 9-10", subject: "Computer Science", coverImage: "images/books/book_subject_computer.svg", rating: 4.4, availableCopies: -1, description: "Computer Science textbook for Class 10 covering programming, hardware, and networking.", pdfFile: "books/class10/Computer_Science.pdf" },
  { id: 104, _id: "c10-om", title: "Class 10 - Office Management & Accounting", author: "NEB", category: "Class 9-10", subject: "Office Management", coverImage: "images/books/book_subject_computer.svg", rating: 4.1, availableCopies: -1, description: "Office Management and Accounting textbook for Class 10.", pdfFile: "books/class10/Office_Management.pdf" },
  { id: 105, _id: "c10-education", title: "Class 10 - Education", author: "NEB", category: "Class 9-10", subject: "Education", coverImage: "images/books/book_subject_social.svg", rating: 4.0, availableCopies: -1, description: "Education textbook for Class 10 covering pedagogy and educational concepts.", pdfFile: "books/class10/Education.pdf" },
  { id: 106, _id: "c10-english-optional", title: "Class 10 - Optional English", author: "NEB", category: "Class 9-10", subject: "English", coverImage: "images/books/book_subject_english.svg", rating: 4.3, availableCopies: -1, description: "Optional English textbook for Class 10 with advanced literature and language studies.", pdfFile: "books/class10/Optional_English.pdf" },
  { id: 107, _id: "c10-math-optional", title: "Class 10 - Optional Mathematics", author: "NEB", category: "Class 9-10", subject: "Mathematics", coverImage: "images/books/book_subject_math.svg", rating: 4.4, availableCopies: -1, description: "Optional Mathematics textbook for Class 10 covering advanced algebra, calculus, and statistics.", pdfFile: "books/class10/Optional_Mathematics.pdf" },
  { id: 108, _id: "c11-english", title: "Class 11 - English", author: "NEB", category: "Class 11-12", subject: "English", coverImage: "images/books/book_subject_english.svg", rating: 4.5, availableCopies: -1, description: "English textbook for Class 11 with essays, stories, poems, and language exercises.", pdfFile: "books/class11/English.pdf" },
  { id: 109, _id: "c11-phy", title: "Class 11 - Physics", author: "NEB", category: "Class 11-12", subject: "Physics", coverImage: "images/books/book_subject_physics.svg", rating: 4.4, availableCopies: -1, description: "Physics textbook for Class 11 covering mechanics, thermodynamics, and waves.", pdfFile: "books/class11/Physics.pdf" },
  { id: 110, _id: "c11-chem", title: "Class 11 - Chemistry", author: "NEB", category: "Class 11-12", subject: "Chemistry", coverImage: "images/books/book_subject_chemistry.svg", rating: 4.4, availableCopies: -1, description: "Chemistry textbook for Class 11 covering atomic structure, bonding, and reactions.", pdfFile: "books/class11/Chemistry.pdf" },
  { id: 111, _id: "c11-bio", title: "Class 11 - Biology", author: "NEB", category: "Class 11-12", subject: "Biology", coverImage: "images/books/book_subject_biology.svg", rating: 4.4, availableCopies: -1, description: "Biology textbook for Class 11 covering cell biology, genetics, and evolution.", pdfFile: "books/class11/Biology.pdf" },
  { id: 112, _id: "c11-accounting", title: "Class 11 - Accounting", author: "NEB", category: "Class 11-12", subject: "Accounting", coverImage: "images/books/book_subject_computer.svg", rating: 4.2, availableCopies: -1, description: "Accounting textbook for Class 11 covering financial accounting principles.", pdfFile: "books/class11/Accounting.pdf" },
  { id: 113, _id: "c11-business", title: "Class 11 - Business Studies", author: "NEB", category: "Class 11-12", subject: "Business Studies", coverImage: "images/books/book_subject_economics.svg", rating: 4.3, availableCopies: -1, description: "Business Studies textbook for Class 11 covering management, marketing, and finance.", pdfFile: "books/class11/Business_Studies.pdf" },
  { id: 114, _id: "c12-phy", title: "Class 12 - Physics", author: "NEB", category: "Class 11-12", subject: "Physics", coverImage: "images/books/book_subject_physics.svg", rating: 4.5, availableCopies: -1, description: "Physics textbook for Class 12 covering electrostatics, magnetism, optics, and modern physics.", pdfFile: "books/class12/Physics.pdf" },
  { id: 115, _id: "c12-chem", title: "Class 12 - Chemistry", author: "NEB", category: "Class 11-12", subject: "Chemistry", coverImage: "images/books/book_subject_chemistry.svg", rating: 4.5, availableCopies: -1, description: "Chemistry textbook for Class 12 covering organic chemistry, coordination compounds, and biomolecules.", pdfFile: "books/class12/Chemistry.pdf" },
  { id: 116, _id: "c12-bio", title: "Class 12 - Biology", author: "NEB", category: "Class 11-12", subject: "Biology", coverImage: "images/books/book_subject_biology.svg", rating: 4.5, availableCopies: -1, description: "Biology textbook for Class 12 covering reproduction, genetics, biotechnology, and ecology.", pdfFile: "books/class12/Biology.pdf" }
];

var newReleases = [
  { id: 1, title: "Class 10 - Computer Science", author: "NEB", image: "images/books/book_subject_computer.svg", rating: 4.4, badge: "New", pdfFile: "books/class10/Computer_Science.pdf" },
  { id: 2, title: "Class 10 - Economics", author: "NEB", image: "images/books/book_subject_economics.svg", rating: 4.2, badge: "New", pdfFile: "books/class10/Economics.pdf" },
  { id: 3, title: "Class 11 - Physics", author: "NEB", image: "images/books/book_subject_physics.svg", rating: 4.4, badge: "New", pdfFile: "books/class11/Physics.pdf" },
  { id: 4, title: "Class 11 - Chemistry", author: "NEB", image: "images/books/book_subject_chemistry.svg", rating: 4.4, badge: "New", pdfFile: "books/class11/Chemistry.pdf" },
  { id: 5, title: "Class 11 - Biology", author: "NEB", image: "images/books/book_subject_biology.svg", rating: 4.4, badge: "New", pdfFile: "books/class11/Biology.pdf" },
  { id: 6, title: "Class 12 - Physics", author: "NEB", image: "images/books/book_subject_physics.svg", rating: 4.5, badge: "New", pdfFile: "books/class12/Physics.pdf" },
  { id: 7, title: "Class 12 - Chemistry", author: "NEB", image: "images/books/book_subject_chemistry.svg", rating: 4.5, badge: "New", pdfFile: "books/class12/Chemistry.pdf" },
  { id: 8, title: "Class 12 - Biology", author: "NEB", image: "images/books/book_subject_biology.svg", rating: 4.5, badge: "New", pdfFile: "books/class12/Biology.pdf" }
];

var footerSections = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "index.html" },
      { label: "Library", href: "library/index.html" },
      { label: "Books", href: "library/books/index.html" },
      { label: "New Releases", href: "library/new-release/index.html" },
      { label: "About Us", href: "about-us/index.html" },
      { label: "Contact", href: "contact-us/index.html" },
      { label: "Blog", href: "blog/index.html" },
      { label: "FAQs", href: "faqs/index.html" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "contact-us/index.html" },
      { label: "Privacy Policy", href: "privacy-policy/index.html" },
      { label: "Terms & Conditions", href: "terms-condition/index.html" },
      { label: "Developer", href: "head-developer/index.html" }
    ]
  }
];

var socialLinks = [
  { name: "Facebook", icon: "fa fa-facebook-f", url: "https://www.facebook.com/kunjan.vhandari" },
  { name: "Instagram", icon: "fa fa-instagram", url: "https://instagram.com/saraswatilibrary" },
  { name: "Twitter", icon: "fa fa-twitter", url: "https://twitter.com/saraswatilibrary" },
  { name: "YouTube", icon: "fa fa-youtube", url: "https://youtube.com/saraswatilibrary" },
  { name: "WhatsApp", icon: "fa-brands fa-whatsapp", url: "https://wa.me/9779743962189" }
];

var contactInfo = [
  { icon: "fa fa-map-marker-alt", label: "Address", value: "Kathmandu, Nepal", link: "" },
  { icon: "fa fa-phone", label: "Phone", value: "+977 9743962189", link: "tel:+9779743962189" },
  { icon: "fa fa-envelope", label: "Email", value: "kunjanvhandari9@gmail.com", link: "mailto:kunjanvhandari9@gmail.com" },
  { icon: "fa fa-clock", label: "Working Hours", value: "Sun - Fri: 8:00 AM - 6:00 PM", link: "" }
];

var faqData = [
  {
    id: 1,
    question: "How do I become a member of Saraswati Library?",
    answer: "You can become a member by visiting our library in person or registering online through our website. Fill out the registration form, provide a valid ID, and pay the membership fee. Your membership will be activated immediately."
  },
  {
    id: 2,
    question: "How many books can I borrow at a time?",
    answer: "Standard members can borrow up to 3 books at a time for a period of 14 days. Premium members can borrow up to 5 books for 21 days. You can renew books if no one else has reserved them."
  },
  {
    id: 3,
    question: "What are the late return fees?",
    answer: "A fine of NPR 5 per day is charged for each overdue book. If a book is more than 30 days overdue, you will be charged the full replacement cost of the book. Please return books on time to avoid penalties."
  },
  {
    id: 4,
    question: "Do you offer e-book access?",
    answer: "Yes, we have a growing digital collection of over 100,000 e-books. You can access them through our website or mobile app using your library membership credentials. E-books are available in PDF, EPUB, and MOBI formats."
  },
  {
    id: 5,
    question: "Can I reserve a book that is currently checked out?",
    answer: "Yes, you can place a reservation on any book that is currently checked out. You will be notified via email or SMS when the book becomes available. Reservations are held for 3 days after notification."
  },
  {
    id: 6,
    question: "Do you have a reading room or study area?",
    answer: "Yes, we have a spacious reading room with comfortable seating, good lighting, and free Wi-Fi. There are also individual study carrels available on a first-come, first-served basis. The reading room is open during all library hours."
  },
  {
    id: 7,
    question: "How do I search for books in the catalog?",
    answer: "You can search our catalog by title, author, category, or ISBN using the search bar on our website. You can also browse books by category on our Books page. If you need help finding a specific book, our librarians are always ready to assist."
  },
  {
    id: 8,
    question: "Can I suggest a book for the library to purchase?",
    answer: "Absolutely! We welcome book suggestions from our members. You can submit a purchase suggestion through our Contact page or speak with our library staff. We review all suggestions and do our best to add popular and relevant titles to our collection."
  }
];

var articles = [
  {
    id: 1,
    title: "The Benefits of Reading in the Digital Age",
    excerpt: "Discover how reading books can improve mental health, boost creativity, and enhance cognitive abilities in our increasingly digital world.",
    author: "Kunjan Bhandari",
    date: "2026-07-01",
    image: "images/blog/placeholder.svg",
    category: "Reading Tips",
    content: "In an age dominated by screens and digital distractions, the simple act of reading a book has become more valuable than ever. Studies show that reading for just 30 minutes a day can reduce stress levels by up to 68%, improve memory retention, and enhance analytical thinking skills. At Saraswati Library, we believe that reading is the foundation of lifelong learning and personal growth."
  },
  {
    id: 2,
    title: "Top 10 Must-Read Books of 2026",
    excerpt: "From thought-provoking non-fiction to captivating fiction, here are the books you absolutely need to add to your reading list this year.",
    author: "Kunjan Bhandari",
    date: "2026-06-15",
    image: "images/blog/placeholder.svg",
    category: "Book Reviews",
    content: "2026 has already seen some remarkable literary releases. Whether you are looking for inspiring self-help books, cutting-edge technology guides, or gripping fiction, this year's offerings have something for everyone. We have curated a list of the top 10 books that have captured readers' attention at Saraswati Library."
  },
  {
    id: 3,
    title: "How Libraries Are Evolving in the 21st Century",
    excerpt: "Modern libraries are more than just book repositories. Learn how Saraswati Library is embracing technology and community engagement.",
    author: "Kunjan Bhandari",
    date: "2026-05-20",
    image: "images/blog/placeholder.svg",
    category: "Library News",
    content: "The role of libraries has transformed dramatically over the past decade. No longer just quiet spaces filled with books, modern libraries like Saraswati Library are becoming vibrant community hubs. From digital lending platforms and interactive reading programs to technology workshops and collaborative study spaces, we are committed to meeting the evolving needs of our members."
  }
];

var bookCategories = [
  { id: "all", name: "All" },
  { id: "class-1-5", name: "Class 1-5" },
  { id: "class-6-8", name: "Class 6-8" },
  { id: "class-9-10", name: "Class 9-10" },
  { id: "class-11-12", name: "Class 11-12" },
  { id: "fiction", name: "Fiction" },
  { id: "non-fiction", name: "Non-Fiction" },
  { id: "science", name: "Science" },
  { id: "technology", name: "Technology" },
  { id: "history", name: "History" },
  { id: "self-help", name: "Self-Help" },
  { id: "business", name: "Business" },
  { id: "children", name: "Children" }
];

/* ========================================
   Authors Data
   ======================================== */

var authors = [
  { id: 1, name: "Paulo Coelho", photo: "images/authors/coelho.jpg", country: "Brazil", biography: "Paulo Coelho de Souza is a Brazilian lyricist and novelist, best known for his novel The Alchemist. He has written 29 books, has been translated into 80 languages, and has sold more than 350 million copies worldwide." },
  { id: 2, name: "Harper Lee", photo: "images/authors/lee.jpg", country: "United States", biography: "Nelle Harper Lee was an American novelist best known for her 1960 novel To Kill a Mockingbird, which won the Pulitzer Prize and became a classic of modern American literature." },
  { id: 3, name: "George Orwell", photo: "images/authors/orwell.jpg", country: "United Kingdom", biography: "Eric Arthur Blair, known by his pen name George Orwell, was an English novelist, essayist, journalist, and critic. His work is characterized by lucid prose, social criticism, and opposition to totalitarianism." },
  { id: 4, name: "Jane Austen", photo: "images/authors/austen.jpg", country: "United Kingdom", biography: "Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique, and comment upon the British landed gentry at the end of the 18th century." },
  { id: 5, name: "F. Scott Fitzgerald", photo: "images/authors/fitzgerald.jpg", country: "United States", biography: "Francis Scott Key Fitzgerald was an American novelist, essayist, short story writer, and screenwriter. He is best known for his novels depicting the Jazz Age, especially The Great Gatsby." },
  { id: 6, name: "Yuval Noah Harari", photo: "images/authors/harari.jpg", country: "Israel", biography: "Yuval Noah Harari is an Israeli public intellectual, historian, and professor in the Department of History at the Hebrew University of Jerusalem. He is the author of the bestsellers Sapiens and Homo Deus." },
  { id: 7, name: "Tara Westover", photo: "images/authors/westover.jpg", country: "United States", biography: "Tara Westover is an American author. Born in Idaho to survivalist parents, she did not attend school until age 17, eventually earning a PhD from Cambridge University." },
  { id: 8, name: "Michelle Obama", photo: "images/authors/obama.jpg", country: "United States", biography: "Michelle LaVaughn Robinson Obama is an American attorney and author who served as the First Lady of the United States from 2009 to 2017. She is the author of the memoir Becoming." },
  { id: 9, name: "Rebecca Skloot", photo: "images/authors/skloot.jpg", country: "United States", biography: "Rebecca Skloot is an American science writer whose work has appeared in The New York Times Magazine, among other publications. She is best known for The Immortal Life of Henrietta Lacks." },
  { id: 10, name: "Stephen Hawking", photo: "images/authors/hawking.jpg", country: "United Kingdom", biography: "Stephen William Hawking was an English theoretical physicist, cosmologist, and author who was director of research at the Centre for Theoretical Cosmology at the University of Cambridge." },
  { id: 11, name: "Charles Darwin", photo: "images/authors/darwin.jpg", country: "United Kingdom", biography: "Charles Robert Darwin was an English naturalist, geologist, and biologist, best known for his contribution to the science of evolution through his book On the Origin of Species." },
  { id: 12, name: "Carl Sagan", photo: "images/authors/sagan.jpg", country: "United States", biography: "Carl Edward Sagan was an American astronomer, planetary scientist, cosmologist, astrophysicist, astrobiologist, and science communicator who made contributions to the scientific research of extraterrestrial life." },
  { id: 13, name: "Siddhartha Mukherjee", photo: "images/authors/mukherjee.jpg", country: "India", biography: "Siddhartha Mukherjee is an Indian-American physician, biologist, oncologist, and author. He is best known for his book The Emperor of All Maladies and The Gene." },
  { id: 14, name: "Robert C. Martin", photo: "images/authors/martin.jpg", country: "United States", biography: "Robert Cecil Martin, colloquially known as Uncle Bob, is an American software engineer and author. He is best known for Clean Code and his advocacy of agile software development." },
  { id: 15, name: "James Clear", photo: "images/authors/clear.jpg", country: "United States", biography: "James Clear is an American author and photographer. He is best known for his New York Times bestseller Atomic Habits, which has sold over 15 million copies worldwide." },
  { id: 16, name: "Morgan Housel", photo: "images/authors/housel.jpg", country: "United States", biography: "Morgan Housel is an American author and finance journalist. He is a partner at The Collaborative Fund and the author of The Psychology of Money." },
  { id: 17, name: "Cal Newport", photo: "images/authors/newport.jpg", country: "United States", biography: "Cal Newport is an American professor of computer science at Georgetown University and the author of several books including Deep Work and Digital Minimalism." },
  { id: 18, name: "Napoleon Hill", photo: "images/authors/hill.jpg", country: "United States", biography: "Napoleon Hill was an American self-help author. He is best known for his book Think and Grow Rich, which is among the best-selling personal development books of all time." },
  { id: 19, name: "Robert Kiyosaki", photo: "images/authors/kiyosaki.jpg", country: "United States", biography: "Robert Toru Kiyosaki is an American entrepreneur and author. He is the founder of Rich Global LLC and the Rich Dad Company, and author of Rich Dad Poor Dad." },
  { id: 20, name: "J.K. Rowling", photo: "images/authors/rowling.jpg", country: "United Kingdom", biography: "Joanne Rowling, known by her pen name J.K. Rowling, is a British author, philanthropist, producer, and screenwriter. She is best known as the author of the Harry Potter series." },
  { id: 21, name: "E.B. White", photo: "images/authors/white.jpg", country: "United States", biography: "Elwyn Brooks White was an American writer. He was the author of several children's books including Charlotte's Web and Stuart Little." },
  { id: 22, name: "Dr. Seuss", photo: "images/authors/seuss.jpg", country: "United States", biography: "Theodor Seuss Geisel, known as Dr. Seuss, was an American children's author, political cartoonist, illustrator, poet, and animator. He wrote over 60 books." },
  { id: 23, name: "Haruki Murakami", photo: "images/authors/murakami.jpg", country: "Japan", biography: "Haruki Murakami is a Japanese writer. His novels, essays, and short stories have been bestsellers in Japan as well as internationally, with translations into over 50 languages." },
  { id: 24, name: "J.D. Salinger", photo: "images/authors/salinger.jpg", country: "United States", biography: "Jerome David Salinger was an American writer known for his widely read novel The Catcher in the Rye." },
  { id: 25, name: "Gabriel Garcia Marquez", photo: "images/authors/marquez.jpg", country: "Colombia", biography: "Gabriel Jose de la Concordia Garcia Marquez was a Colombian novelist, short-story writer, screenwriter, and journalist, known for his Nobel Prize-winning works of magical realism." },
  { id: 26, name: "Homer", photo: "images/authors/homer.jpg", country: "Ancient Greece", biography: "Homer is the legendary author of the Iliad and the Odyssey, two epic poems that are the foundational works of ancient Greek literature." },
  { id: 27, name: "Miguel de Cervantes", photo: "images/authors/cervantes.jpg", country: "Spain", biography: "Miguel de Cervantes Saavedra was a Spanish writer widely regarded as the greatest writer in the Spanish language and one of the world's pre-eminent novelists." },
  { id: 28, name: "Ray Bradbury", photo: "images/authors/bradbury.jpg", country: "United States", biography: "Ray Douglas Bradbury was an American science fiction and fantasy author. His works include Fahrenheit 451, The Martian Chronicles, and Something Wicked This Way Comes." },
  { id: 29, name: "Aldous Huxley", photo: "images/authors/huxley.jpg", country: "United Kingdom", biography: "Aldous Leonard Huxley was an English writer and philosopher. He wrote nearly 50 books, including Brave New World and The Perennial Philosophy." },
  { id: 30, name: "J.R.R. Tolkien", photo: "images/authors/tolkien.jpg", country: "United Kingdom", biography: "John Ronald Reuel Tolkien was an English writer, poet, philologist, and academic, best known as the author of the high fantasy works The Hobbit and The Lord of the Rings." },
  { id: 31, name: "Isaac Asimov", photo: "images/authors/asimov.jpg", country: "United States", biography: "Isaac Asimov was an American writer and professor of biochemistry. He was one of the most prolific writers in history, having written or edited more than 500 books." },
  { id: 32, name: "Frank Herbert", photo: "images/authors/herbert.jpg", country: "United States", biography: "Frank Patrick Herbert Jr. was an American science fiction author best known for the novel Dune and its five sequels." },
  { id: 33, name: "Daniel Kahneman", photo: "images/authors/kahneman.jpg", country: "Israel", biography: "Daniel Kahneman was an Israeli-American psychologist and economist notable for his work on the psychology of judgment and decision-making, and behavioral economics." },
  { id: 34, name: "Charles Duhigg", photo: "images/authors/duhigg.jpg", country: "United States", biography: "Charles Duhigg is an American journalist and author. He is best known for his books The Power of Habit and Smarter Faster Better." },
  { id: 35, name: "Malcolm Gladwell", photo: "images/authors/gladwell.jpg", country: "Canada", biography: "Malcolm Timothy Gladwell is a Canadian journalist, author, and public speaker. His books include The Tipping Point, Blink, and Outliers." },
  { id: 36, name: "Anne Frank", photo: "images/authors/frank.jpg", country: "Netherlands", biography: "Annelies Marie Frank was a German-Dutch diarist of Jewish heritage. One of the most discussed Jewish victims of the Holocaust, she gained fame posthumously with the publication of The Diary of a Young Girl." },
  { id: 37, name: "A.P.J. Abdul Kalam", photo: "images/authors/kalam.jpg", country: "India", biography: "Avul Pakir Jainulabdeen Abdul Kalam was an Indian aerospace scientist and politician who served as the 11th President of India from 2002 to 2007." },
  { id: 38, name: "Alexandre Dumas", photo: "images/authors/dumas.jpg", country: "France", biography: "Alexandre Dumas, also known as Alexandre Dumas pere, was a French novelist and playwright. His works include The Three Musketeers and The Count of Monte Cristo." },
  { id: 39, name: "Charles Dickens", photo: "images/authors/dickens.jpg", country: "United Kingdom", biography: "Charles John Huffam Dickens was an English writer and social critic. He created some of the world's best-known fictional characters and is regarded as the greatest novelist of the Victorian era." },
  { id: 40, name: "Mark Twain", photo: "images/authors/twain.jpg", country: "United States", biography: "Samuel Langhorne Clemens, known by his pen name Mark Twain, was an American writer, humorist, entrepreneur, publisher, and lecturer." },
  { id: 41, name: "Leo Tolstoy", photo: "images/authors/tolstoy.jpg", country: "Russia", biography: "Lev Nikolayevich Tolstoy, often referred to in English as Leo Tolstoy, was a Russian writer who is regarded as one of the greatest authors of all time." },
  { id: 42, name: "Arthur Conan Doyle", photo: "images/authors/doyle.jpg", country: "United Kingdom", biography: "Sir Arthur Ignatius Conan Doyle was a British writer and physician, creator of the legendary detective Sherlock Holmes." },
  { id: 43, name: "Thomas Hardy", photo: "images/authors/hardy.jpg", country: "United Kingdom", biography: "Thomas Hardy was an English novelist and poet. His works include Tess of the d'Urbervilles and Far from the Madding Crowd." },
  { id: 44, name: "George Eliot", photo: "images/authors/eliot.jpg", country: "United Kingdom", biography: "George Eliot was the pen name of Mary Ann Evans, an English novelist, poet, journalist, translator, and one of the leading writers of the Victorian era." },
  { id: 45, name: "William Shakespeare", photo: "images/authors/shakespeare.jpg", country: "United Kingdom", biography: "William Shakespeare was an English playwright, poet, and actor, widely regarded as the greatest writer in the English language and the world's greatest dramatist." },
  { id: 46, name: "Edith Wharton", photo: "images/authors/wharton.jpg", country: "United States", biography: "Edith Newbold Jones Wharton was an American writer and designer. She was the first woman to win the Pulitzer Prize for Fiction." },
  { id: 47, name: "Stephen Covey", photo: "images/authors/covey.jpg", country: "United States", biography: "Stephen Richards Covey was an American educator, author, businessman, and keynote speaker. He is best known for The 7 Habits of Highly Effective People." },
  { id: 48, name: "Eckhart Tolle", photo: "images/authors/tolle.jpg", country: "Germany", biography: "Eckhart Tolle is a German-born Canadian author and spiritual teacher. He is best known for The Power of Now and A New Earth." },
  { id: 49, name: "Eric Ries", photo: "images/authors/ries.jpg", country: "United States", biography: "Eric Ries is an American entrepreneur and author of The Lean Startup, a methodology for developing businesses and products." },
  { id: 50, name: "Jim Collins", photo: "images/authors/collins.jpg", country: "United States", biography: "Jim Collins is an American business author and lecturer on the subject of company sustainability and growth. He is best known for Good to Great." },
  { id: 51, name: "Peter Thiel", photo: "images/authors/thiel.jpg", country: "United States", biography: "Peter Andreas Thiel is an American entrepreneur, venture capitalist, and author. He co-founded PayPal and Palantir Technologies." },
  { id: 52, name: "David Thomas", photo: "images/authors/thomas.jpg", country: "United Kingdom", biography: "David Thomas is a British programmer and author, best known as the co-author of The Pragmatic Programmer." },
  { id: 53, name: "Steve McConnell", photo: "images/authors/mcconnell.jpg", country: "United States", biography: "Steve McConnell is an American software engineer and author of several software development books including Code Complete." },
  { id: 54, name: "Jared Diamond", photo: "images/authors/diamond.jpg", country: "United States", biography: "Jared Mason Diamond is an American geographer, historian, anthropologist, ornithologist, and author best known for Guns, Germs, and Steel." },
  { id: 55, name: "Sun Tzu", photo: "images/authors/suntzu.jpg", country: "Ancient China", biography: "Sun Tzu was a Chinese general, military strategist, writer, and philosopher who lived in the Eastern Zhou period of ancient China. He is credited as the author of The Art of War." },
  { id: 56, name: "Mary Beard", photo: "images/authors/beard.jpg", country: "United Kingdom", biography: "Winifred Mary Beard is a British classicist, professor, and author known for her work on ancient Rome, including SPQR." }
];

/* ========================================
   Publishers Data
   ======================================== */

var publishers = [
  { id: 1, name: "HarperCollins", address: "New York, USA", contact: "+1 212-207-7000", email: "info@harpercollins.com", website: "https://www.harpercollins.com" },
  { id: 2, name: "Penguin Books", address: "London, UK", contact: "+44 20 7139 2000", email: "info@penguin.co.uk", website: "https://www.penguin.co.uk" },
  { id: 3, name: "Simon & Schuster", address: "New York, USA", contact: "+1 212-698-7000", email: "info@simonandschuster.com", website: "https://www.simonandschuster.com" },
  { id: 4, name: "Random House", address: "New York, USA", contact: "+1 212-782-9000", email: "info@randomhouse.com", website: "https://www.randomhouse.com" },
  { id: 5, name: "Hachette Livre", address: "Paris, France", contact: "+33 1 57 69 60 00", email: "info@hachette-livre.fr", website: "https://www.hachette-livre.fr" },
  { id: 6, name: "Macmillan Publishers", address: "London, UK", contact: "+44 20 7014 2000", email: "info@macmillan.co.uk", website: "https://www.macmillan.co.uk" },
  { id: 7, name: "Wiley", address: "Hoboken, NJ, USA", contact: "+1 201-748-6000", email: "info@wiley.com", website: "https://www.wiley.com" },
  { id: 8, name: "Oxford University Press", address: "Oxford, UK", contact: "+44 1865 556767", email: "info@oup.com", website: "https://www.oup.com" },
  { id: 9, name: "Cambridge University Press", address: "Cambridge, UK", contact: "+44 1223 358331", email: "information@cambridge.org", website: "https://www.cambridge.org" },
  { id: 10, name: "Scholastic", address: "New York, USA", contact: "+1 212-343-6100", email: "info@scholastic.com", website: "https://www.scholastic.com" },
  { id: 11, name: "NEB Publications", address: "Kathmandu, Nepal", contact: "+977-1-4200001", email: "info@neb.gov.np", website: "https://www.neb.gov.np" },
  { id: 12, name: "NCERT", address: "New Delhi, India", contact: "+91-11-26866364", email: "info@ncert.nic.in", website: "https://www.ncert.nic.in" }
];

/* ========================================
   Admin Categories Data
   ======================================== */

var adminCategories = [
  { id: 1, name: "Fiction", description: "Novels, short stories, and fictional works across all genres including literary fiction, science fiction, fantasy, mystery, and romance.", emoji: "&#128214;", bookCount: 0 },
  { id: 2, name: "Non-Fiction", description: "Factual works including memoirs, biographies, essays, and informative books on a wide range of subjects.", emoji: "&#128218;", bookCount: 0 },
  { id: 3, name: "Science", description: "Scientific works covering physics, chemistry, biology, astronomy, mathematics, and environmental science.", emoji: "&#128300;", bookCount: 0 },
  { id: 4, name: "Technology", description: "Books on computer science, programming, software engineering, digital technology, and IT.", emoji: "&#128187;", bookCount: 0 },
  { id: 5, name: "History", description: "Historical accounts, ancient civilizations, world wars, political history, and cultural heritage.", emoji: "&#127758;", bookCount: 0 },
  { id: 6, name: "Self-Help", description: "Personal development, productivity, motivation, mindfulness, and self-improvement books.", emoji: "&#128161;", bookCount: 0 },
  { id: 7, name: "Business", description: "Business strategy, entrepreneurship, finance, marketing, leadership, and management books.", emoji: "&#128188;", bookCount: 0 },
  { id: 8, name: "Children", description: "Children's literature, picture books, early readers, and middle-grade fiction for young audiences.", emoji: "&#128118;", bookCount: 0 },
  { id: 9, name: "Class 1-5", description: "School textbooks and educational materials for primary school students (Classes 1 through 5).", emoji: "&#127891;", bookCount: 0 },
  { id: 10, name: "Class 6-8", description: "School textbooks and educational materials for middle school students (Classes 6 through 8).", emoji: "&#128218;", bookCount: 0 },
  { id: 11, name: "Class 9-10", description: "School textbooks and educational materials for secondary school students (Classes 9 and 10).", emoji: "&#127891;", bookCount: 0 },
  { id: 12, name: "Class 11-12", description: "School textbooks and educational materials for higher secondary students (Classes 11 and 12).", emoji: "&#128214;", bookCount: 0 }
];
