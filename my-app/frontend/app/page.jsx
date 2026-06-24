"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Box, Container, Typography, Button, TextField, InputAdornment,
  Grid, Card, CardContent, Chip, Avatar, Rating, IconButton, Paper, Divider,
  useMediaQuery, Snackbar, Alert,
  CircularProgress, Dialog, DialogContent, DialogTitle, Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import HomeLayout from "./layouts/HomeLayout/layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/src/lib/api";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const sliderImages = [
    { id: 1, image: "/images/footer/book22.png", title: "The Psychology of Money", subtitle: "Morgan Housel" },
    { id: 2, image: "/images/footer/book19.svg", title: "Atomic Habits", subtitle: "James Clear" },
  { id: 3, image: "/images/books/book_14618737.jpg", title: "The Alchemist", subtitle: "Paulo Coelho" },
  { id: 4, image: "/images/books/book_12875748.jpg", title: "Rich Dad Poor Dad", subtitle: "Robert Kiyosaki" },
  { id: 5, image: "/images/books/book_12973053.jpg", title: "Think and Grow Rich", subtitle: "Napoleon Hill" },
  { id: 6, image: "/images/books/book_14314858.jpg", title: "Deep Work", subtitle: "Cal Newport" },
];

const featuredBooks = [
  { id: 1, title: "Atomic Habits", author: "James Clear", rating: 5, price: "Rs. 1100", badge: "Bestseller", image: "/images/footer/book19.svg" },
  { id: 2, title: "The Psychology of Money", author: "Morgan Housel", rating: 5, price: "Rs. 950", badge: "Popular", image: "/images/footer/book20.svg" },
  { id: 3, title: "The Alchemist", author: "Paulo Coelho", rating: 5, price: "Rs. 700", badge: "Staff Pick", image: "/images/footer/book4.svg" },
  { id: 4, title: "Educated", author: "Tara Westover", rating: 4, price: "Rs. 1300", badge: "New", image: "/images/footer/book13.svg" },
];

const ebooks = [
  { id: 1, title: "JavaScript: The Good Parts", author: "Douglas Crockford", format: "PDF", size: "2.1 MB", image: "/images/footer/book1.svg", file: "/ebooks/javascript-the-good-parts.pdf" },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", format: "EPUB", size: "3.5 MB", image: "/images/footer/book2.svg", file: "/ebooks/clean-code.epub" },
  { id: 3, title: "Design Patterns", author: "Gang of Four", format: "PDF", size: "4.2 MB", image: "/images/footer/book3.svg", file: "/ebooks/design-patterns.pdf" },
  { id: 4, title: "The Pragmatic Programmer", author: "Andrew Hunt", format: "EPUB", size: "1.8 MB", image: "/images/footer/book5.svg", file: "/ebooks/pragmatic-programmer.epub" },
];

const categories = [
  { name: "Fiction", emoji: "📖", count: 12500 },
  { name: "Non-Fiction", emoji: "📚", count: 8900 },
  { name: "Science", emoji: "🔬", count: 5600 },
  { name: "Technology", emoji: "💻", count: 7800 },
  { name: "History", emoji: "🏛️", count: 4200 },
  { name: "Self-Help", emoji: "🧠", count: 3100 },
  { name: "Business", emoji: "💼", count: 2800 },
  { name: "Children", emoji: "🎨", count: 6500 },
];

const statsData = [
  { label: "Physical Books", value: "50,000+", icon: <LibraryBooksIcon sx={{ fontSize: 36 }} />, color: "#1E293B" },
  { label: "E-Books", value: "100,000+", icon: <CloudDownloadIcon sx={{ fontSize: 36 }} />, color: "#10B981" },
  { label: "Active Members", value: "25,000+", icon: <PeopleIcon sx={{ fontSize: 36 }} />, color: "#0EA5E9" },
  { label: "Daily Visitors", value: "5,000+", icon: <AccessTimeIcon sx={{ fontSize: 36 }} />, color: "#EF4444" },
];

const testimonials = [
  { name: "Kushal Bhandari", role: "Student", text: "LibriVista has transformed my learning. The digital collection is incredible!", rating: 5, avatar: "K" },
  { name: "Dipek Bhandari", role: "Researcher", text: "The vast collection and easy search make this an invaluable resource for research.", rating: 5, avatar: "D" },
  { name: "Roma Pandey", role: "Book Lover", text: "I love discovering new books here. The recommendations are always spot on!", rating: 4, avatar: "R" },
];

const teamMembers = [
  { name: "Kunjan Bhandari", role: "Web Developer", age: 17, address: "Satyawati-06, Juniya, Gulmi", phone: "9763942189", study: "Diploma in Computer Engineering", image: "/images/footer/kunjan.jpg.jpg", facebook: "https://www.facebook.com/kunjan.vhandari", instagram: "https://www.instagram.com/the_hunter_kunjan/", description: "Kunjan Bhandari is a passionate web developer from Satyawati-06, Juniya, Gulmi. Currently pursuing a Diploma in Computer Engineering, Kunjan has developed strong skills in modern web technologies including React, Next.js, and Node.js. He is the lead frontend developer behind LibriVista's intuitive and responsive user interface. Kunjan is dedicated to creating seamless digital experiences that make knowledge accessible to everyone." },
  { name: "Tika B.K.", role: "Web Developer", age: 18, address: "Satyawati-06, Gulmi", phone: "9768337162", study: "Diploma in Computer Engineering", image: "/images/footer/aswbin.jpg", facebook: "https://www.facebook.com/aakash.cunar", description: "Tika B.K. is a skilled web developer from Satyawati-06, Gulmi, currently studying Diploma in Computer Engineering. With expertise in backend development, database management, and API integration, Tika has played a crucial role in building the robust backend infrastructure of LibriVista. He is passionate about leveraging technology to solve real-world problems and improve community access to educational resources." },
];

const SectionTitle = ({ label, title, subtitle }) => (
  <Box sx={{ textAlign: "center", mb: 5 }}>
    {label && (
      <Chip label={label} sx={{ bgcolor: "rgba(212,168,75,0.15)", color: "#0EA5E9", fontWeight: 700, mb: 2, borderRadius: "8px", px: 1 }} />
    )}
    <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", mb: 1.5 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="h6" sx={{ color: "#6B7280", maxWidth: "550px", mx: "auto", fontWeight: 400, fontSize: "16px" }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

const GlassCard = styled(Card)({
  borderRadius: "16px",
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
  border: "1px solid rgba(255,255,255,0.8)",
  transition: "all 0.3s ease",
  height: "100%",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
  },
});

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [showCategoryBooks, setShowCategoryBooks] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeStep, setWelcomeStep] = useState(0);

  useEffect(() => {
    if (!showWelcome) return;
    const t1 = setTimeout(() => setWelcomeStep(1), 2000);
    const t2 = setTimeout(() => setWelcomeStep(2), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [showWelcome]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((p) => (p + 1) % sliderImages.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const getSampleBooksByCategory = (category) => {
    const map = {
      "Fiction": [
        { _id: "s1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", coverImage: "/images/footer/book19.svg", rating: 4.5, price: 15.99 },
        { _id: "s2", title: "1984", author: "George Orwell", category: "Fiction", coverImage: "/images/footer/book20.svg", rating: 4.7, price: 14.99 },
        { _id: "s3", title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", coverImage: "/images/footer/book21.svg", rating: 4.8, price: 12.99 },
        { _id: "s4", title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", coverImage: "/images/footer/book22.svg", rating: 4.6, price: 11.99 },
        { _id: "s5", title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction", coverImage: "/images/footer/book19.svg", rating: 4.6, price: 9.99 },
      ],
      "Non-Fiction": [
        { _id: "s6", title: "Atomic Habits", author: "James Clear", category: "Non-Fiction", coverImage: "/images/footer/book20.svg", rating: 5.0, price: 18.99 },
        { _id: "s7", title: "The Psychology of Money", author: "Morgan Housel", category: "Non-Fiction", coverImage: "/images/footer/book21.svg", rating: 5.0, price: 16.99 },
        { _id: "s8", title: "Educated", author: "Tara Westover", category: "Non-Fiction", coverImage: "/images/footer/book22.svg", rating: 4.7, price: 14.99 },
        { _id: "s9", title: "Sapiens", author: "Yuval Noah Harari", category: "Non-Fiction", coverImage: "/images/footer/book19.svg", rating: 4.8, price: 17.99 },
      ],
      "Science": [
        { _id: "s10", title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", coverImage: "/images/footer/book20.svg", rating: 4.8, price: 19.99 },
        { _id: "s11", title: "The Selfish Gene", author: "Richard Dawkins", category: "Science", coverImage: "/images/footer/book21.svg", rating: 4.6, price: 15.99 },
        { _id: "s12", title: "Cosmos", author: "Carl Sagan", category: "Science", coverImage: "/images/footer/book22.svg", rating: 4.9, price: 18.99 },
      ],
      "Technology": [
        { _id: "s13", title: "The Pragmatic Programmer", author: "David Thomas", category: "Technology", coverImage: "/images/footer/book19.svg", rating: 4.7, price: 34.99 },
        { _id: "s14", title: "Clean Code", author: "Robert Martin", category: "Technology", coverImage: "/images/footer/book20.svg", rating: 4.6, price: 29.99 },
        { _id: "s15", title: "Design Patterns", author: "Gang of Four", category: "Technology", coverImage: "/images/footer/book21.svg", rating: 4.5, price: 39.99 },
      ],
      "History": [
        { _id: "s16", title: "Guns, Germs, and Steel", author: "Jared Diamond", category: "History", coverImage: "/images/footer/book22.svg", rating: 4.5, price: 16.99 },
        { _id: "s17", title: "The Diary of Anne Frank", author: "Anne Frank", category: "History", coverImage: "/images/footer/book19.svg", rating: 4.9, price: 12.99 },
        { _id: "s18", title: "A People's History", author: "Howard Zinn", category: "History", coverImage: "/images/footer/book20.svg", rating: 4.4, price: 19.99 },
      ],
      "Self-Help": [
        { _id: "s19", title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", category: "Self-Help", coverImage: "/images/footer/book21.svg", rating: 4.7, price: 14.99 },
        { _id: "s20", title: "How to Win Friends", author: "Dale Carnegie", category: "Self-Help", coverImage: "/images/footer/book22.svg", rating: 4.6, price: 11.99 },
        { _id: "s21", title: "Mindset", author: "Carol Dweck", category: "Self-Help", coverImage: "/images/footer/book19.svg", rating: 4.5, price: 13.99 },
      ],
      "Business": [
        { _id: "s22", title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Business", coverImage: "/images/footer/book20.svg", rating: 4.5, price: 14.99 },
        { _id: "s23", title: "Zero to One", author: "Peter Thiel", category: "Business", coverImage: "/images/footer/book21.svg", rating: 4.6, price: 17.99 },
        { _id: "s24", title: "The Lean Startup", author: "Eric Ries", category: "Business", coverImage: "/images/footer/book22.svg", rating: 4.4, price: 16.99 },
      ],
      "Children": [
        { _id: "s25", title: "Harry Potter", author: "J.K. Rowling", category: "Children", coverImage: "/images/footer/book19.svg", rating: 4.9, price: 19.99 },
        { _id: "s26", title: "The Hobbit", author: "J.R.R. Tolkien", category: "Children", coverImage: "/images/footer/book20.svg", rating: 4.8, price: 15.99 },
        { _id: "s27", title: "Matilda", author: "Roald Dahl", category: "Children", coverImage: "/images/footer/book21.svg", rating: 4.7, price: 10.99 },
      ],
    };
    return map[category] || [];
  };

  const handleCategoryClick = async (categoryName) => {
    setSelectedCategory(categoryName);
    setLoadingCategory(true);
    setShowCategoryBooks(true);
    try {
      const res = await fetch(`/api/books?category=${encodeURIComponent(categoryName)}&limit=15`);
      const data = await res.json();
      if (data.success && data.books?.length > 0) {
        setCategoryBooks(data.books);
      } else {
        const searchRes = await fetch(`/api/books?search=${encodeURIComponent(categoryName)}&limit=15`);
        const searchData = await searchRes.json();
        if (searchData.success && searchData.books?.length > 0) {
          setCategoryBooks(searchData.books);
        } else {
          setCategoryBooks(getSampleBooksByCategory(categoryName));
        }
      }
    } catch {
      setCategoryBooks(getSampleBooksByCategory(categoryName));
    } finally {
      setLoadingCategory(false);
    }
  };

  const closeCategoryBooks = () => {
    setShowCategoryBooks(false);
    setSelectedCategory(null);
    setCategoryBooks([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchPerformed(true);
    try {
      const res = await fetch(`/api/books?search=${encodeURIComponent(searchQuery)}&limit=12`);
      const data = await res.json();
      setSearchResults(data.success ? data.books : []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleReserve = async (bookId) => {
    if (!isAuthenticated) { router.push("/login"); return; }
    try {
      const res = await apiFetch("/reservations", { method: "POST", body: JSON.stringify({ bookId }) });
      const data = await res.json();
      if (data.success) {
        setSnackbar({ open: true, message: "Book reserved! Redirecting to cart...", severity: "success" });
        setTimeout(() => router.push("/cart"), 1000);
      } else {
        setSnackbar({ open: true, message: data.message || "Failed to reserve", severity: "error" });
      }
    } catch {
      setSnackbar({ open: true, message: "Failed to reserve book", severity: "error" });
    }
  };

  const handleRead = (ebook) => {
    if (!isAuthenticated) { router.push("/login"); return; }
    window.open(ebook.file, "_blank");
  };

  const handleDownload = (ebook) => {
    if (!isAuthenticated) { router.push("/login"); return; }
    const link = document.createElement("a");
    link.href = ebook.file;
    link.download = ebook.file.split('/').pop();
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSnackbar({ open: true, message: `Downloading ${ebook.title}...`, severity: "success" });
  };

  return (
    <>
      {showWelcome && (
        <Box sx={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          transition: "opacity 0.8s"
        }}>
          {welcomeStep === 0 && (
            <Fade in={welcomeStep === 0} timeout={1000}>
              <Box sx={{ textAlign: "center", px: 3 }}>
                <Typography variant="h2" sx={{ fontWeight: 900, color: "#0EA5E9", fontSize: { xs: "2rem", md: "3.5rem" }, mb: 2, letterSpacing: 2 }}>
                  WELCOME TO LIBRIVISTA
                </Typography>
                <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>
                  Loading amazing content for you...
                </Typography>
              </Box>
            </Fade>
          )}
          {welcomeStep === 1 && (
            <Fade in={welcomeStep === 1} timeout={1000}>
              <Box sx={{ textAlign: "center", px: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#fff", mb: 4, fontSize: { xs: "1.5rem", md: "2.5rem" } }}>
                  Meet Our Developers
                </Typography>
                <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Avatar src="/images/footer/kunjan.jpg.jpg" alt="Kunjan Bhandari"
                      sx={{ width: 120, height: 120, mx: "auto", mb: 2, border: "3px solid #0EA5E9" }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff" }}>Kunjan Bhandari</Typography>
                    <Typography sx={{ color: "#0EA5E9", fontWeight: 500 }}>Web Developer</Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Avatar src="/images/footer/aswbin.jpg" alt="Tika B.K."
                      sx={{ width: 120, height: 120, mx: "auto", mb: 2, border: "3px solid #0EA5E9" }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff" }}>Tika B.K.</Typography>
                    <Typography sx={{ color: "#0EA5E9", fontWeight: 500 }}>Web Developer</Typography>
                  </Box>
                </Box>
              </Box>
            </Fade>
          )}
          {welcomeStep === 2 && (
            <Fade in={welcomeStep === 2} timeout={1000}>
              <Box sx={{ textAlign: "center", px: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#fff", mb: 3, fontSize: { xs: "1.3rem", md: "2rem" } }}>
                  Ready to explore?
                </Typography>
                <Button variant="contained" size="large" onClick={() => setShowWelcome(false)}
                  sx={{ borderRadius: "12px", px: 5, py: 1.5, bgcolor: "#0EA5E9", color: "#0F172A", fontWeight: 700, fontSize: "18px", "&:hover": { bgcolor: "#38BDF8" } }}>
                  Enter LibriVista
                </Button>
              </Box>
            </Fade>
          )}
        </Box>
      )}
      <HomeLayout>
      <Box>
        {/* ===== HERO ===== */}
        <Box sx={{ position: "relative", minHeight: { xs: "80vh", md: "90vh" }, overflow: "hidden", background: "#0F172A" }}>
          {sliderImages.map((slide, i) => (
            <Box key={slide.id} sx={{ position: "absolute", inset: 0, opacity: i === currentSlide ? 1 : 0, transition: "opacity 1s" }}>
              <Box component="img" src={slide.image} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45)" }} />
            </Box>
          ))}
          <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(45,58,110,0.85) 50%, rgba(15,23,42,0.6) 100%)" }} />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, minHeight: "inherit", display: "flex", alignItems: "center" }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Box sx={{ animation: "fadeInUp 0.8s ease" }}>
                  <Chip label="✨ New Digital Collection Added" sx={{ bgcolor: "rgba(212,168,75,0.2)", color: "#0EA5E9", fontWeight: 700, mb: 2, borderRadius: "8px" }} />
                  <Typography sx={{ fontWeight: 800, fontSize: { xs: "2.2rem", md: "3.5rem" }, color: "#fff", lineHeight: 1.15, mb: 2 }}>
                    Discover Your Next
                    <Box component="span" sx={{ color: "#0EA5E9", display: "block" }}>Great Read</Box>
                  </Typography>
                  <Typography sx={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", maxWidth: "540px", lineHeight: 1.8, mb: 4 }}>
                    Explore 50,000+ physical books and 100,000+ digital resources. Your gateway to infinite knowledge starts here.
                  </Typography>

                  <Paper sx={{ p: 1.5, borderRadius: "14px", bgcolor: "#fff", maxWidth: "580px", boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}>
                    <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <TextField fullWidth placeholder="Search books, authors..." variant="outlined" size="small" value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); if (searchPerformed && !e.target.value) { setSearchPerformed(false); setSearchResults([]); } }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#bbb" }} /></InputAdornment>, sx: { borderRadius: "10px", "& fieldset": { border: "none" }, bgcolor: "#F5F5F5" } }} />
                      <Button type="submit" variant="contained" disabled={searchLoading}
                        sx={{ borderRadius: "10px", px: 3, py: 1.2, whiteSpace: "nowrap", minWidth: 100 }}>
                        {searchLoading ? "Searching..." : "Search"}
                      </Button>
                    </Box>
                  </Paper>

                  {searchPerformed && (
                    <Paper sx={{ mt: 1.5, borderRadius: "12px", bgcolor: "#fff", maxWidth: "580px", maxHeight: "380px", overflow: "auto", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
                      {searchLoading ? (
                        <Box sx={{ p: 3, textAlign: "center" }}><CircularProgress size={24} /></Box>
                      ) : searchResults.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: "center" }}>
                          <Typography sx={{ color: "#888", fontSize: "14px" }}>No books found for "{searchQuery}"</Typography>
                          <Button size="small" onClick={() => router.push(`/books?search=${encodeURIComponent(searchQuery)}`)} sx={{ mt: 1, textTransform: "none" }}>View all results</Button>
                        </Box>
                      ) : (
                        <Box>
                          <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "13px" }}>
                              {searchResults.length} result{searchResults.length > 1 ? "s" : ""} found
                            </Typography>
                          </Box>
                          {searchResults.map((book) => (
                            <Box key={book._id} onClick={() => router.push(`/books/${book._id}`)}
                              sx={{ display: "flex", gap: 2, p: 1.5, borderBottom: "1px solid #f5f5f5", cursor: "pointer", "&:hover": { bgcolor: "#f9f9f9" } }}>
                              <Box component="img" src={book.coverImage || "/images/footer/book22.png"} alt={book.title}
                                sx={{ width: 44, height: 58, objectFit: "contain", borderRadius: 1, flexShrink: 0 }} />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "13px", mb: 0.25 }}>{book.title}</Typography>
                                <Typography variant="caption" sx={{ color: "#888", display: "block", mb: 0.5 }}>by {book.author}</Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Chip label={book.category} size="small" sx={{ height: 20, fontSize: "10px", bgcolor: "#f0f0f0" }} />
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#EF4444" }}>Rs. {book.price}</Typography>
                                </Box>
                              </Box>
                              <Rating value={book.rating || 0} readOnly size="small" sx={{ color: "#0EA5E9" }} />
                            </Box>
                          ))}
                          <Box sx={{ p: 1.5, textAlign: "center" }}>
                            <Button size="small" onClick={() => router.push(`/books?search=${encodeURIComponent(searchQuery)}`)} endIcon={<ArrowForwardIcon />} sx={{ textTransform: "none", fontSize: "13px" }}>View all results</Button>
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  )}

                  <Box sx={{ display: "flex", gap: 3, mt: 3, flexWrap: "wrap" }}>
                    {["Free Access", "24/7 Digital", "Expert Support"].map((text) => (
                      <Box key={text} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                        <CheckCircleIcon sx={{ color: "#10B981", fontSize: 18 }} />
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", fontSize: "14px" }}>{text}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>

          {/* Slide nav */}
          <Box sx={{ position: "absolute", bottom: 30, left: 0, right: 0, zIndex: 3, display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5 }}>
            <IconButton onClick={() => setCurrentSlide((p) => (p - 1 + sliderImages.length) % sliderImages.length)}
              sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.12)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }, width: 32, height: 32 }}>
              <ArrowBackIosIcon sx={{ fontSize: 14 }} />
            </IconButton>
            {sliderImages.map((_, i) => (
              <Box key={i} onClick={() => setCurrentSlide(i)}
                sx={{ width: i === currentSlide ? 28 : 10, height: 10, borderRadius: "5px", bgcolor: i === currentSlide ? "#0EA5E9" : "rgba(255,255,255,0.3)", cursor: "pointer", transition: "all 0.3s" }} />
            ))}
            <IconButton onClick={() => setCurrentSlide((p) => (p + 1) % sliderImages.length)}
              sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.12)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }, width: 32, height: 32 }}>
              <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>

        {/* ===== STATISTICS ===== */}
        <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: "#FFFFFF" }}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {statsData.map((stat, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <GlassCard sx={{ textAlign: "center", py: 4, px: 2 }}>
                    <Box sx={{ color: stat.color, mb: 1.5, display: "flex", justifyContent: "center" }}>{stat.icon}</Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", mb: 0.5, fontSize: { xs: "28px", md: "36px" } }}>{stat.value}</Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "14px" }}>{stat.label}</Typography>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ===== E-BOOKS ===== */}
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
          <Container maxWidth="lg">
            <SectionTitle label="Digital Library" title="E-Books Collection" subtitle="Access thousands of e-books instantly. Read on any device, anywhere." />
            <Grid container spacing={3}>
              {ebooks.map((book) => (
                <Grid item xs={12} sm={6} md={3} key={book.id}>
                  <GlassCard>
                    <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                      <Box component="img" src={book.image} alt={book.title}
                        sx={{ width: "100%", height: 180, objectFit: "contain", mb: 2, borderRadius: 1, bgcolor: "#f9f9f9" }} />
                      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <Chip label={book.format} size="small" sx={{ bgcolor: "#1E293B", color: "#fff", fontSize: "10px", borderRadius: "6px" }} />
                        <Chip label={book.size} size="small" sx={{ borderRadius: "6px", fontSize: "10px" }} />
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0F172A", mb: 0.3 }}>{book.title}</Typography>
                      <Typography variant="caption" sx={{ color: "#888", display: "block", mb: 2 }}>by {book.author}</Typography>
                      <Box sx={{ mt: "auto", display: "flex", gap: 1 }}>
                        <Button variant="contained" size="small" startIcon={<CloudDownloadIcon />} onClick={() => handleDownload(book)}
                          sx={{ flex: 1, borderRadius: "8px", textTransform: "none" }}>
                          Download
                        </Button>
                        <Button variant="outlined" size="small" onClick={() => handleRead(book)}
                          sx={{ borderRadius: "8px", textTransform: "none", minWidth: 80 }}>
                          Read
                        </Button>
                      </Box>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ borderRadius: "10px", px: 4, py: 1.3 }}>Browse All E-Books</Button>
            </Box>
          </Container>
        </Box>

        {/* ===== FEATURED BOOKS ===== */}
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#FFFFFF" }}>
          <Container maxWidth="lg">
            <SectionTitle label="Staff Picks" title="Featured Books" subtitle="Hand-picked recommendations from our library experts." />
            <Grid container spacing={3}>
              {featuredBooks.map((book) => (
                <Grid item xs={12} sm={6} md={3} key={book.id}>
                  <GlassCard>
                    <CardContent sx={{ p: 3, position: "relative" }}>
                      <Chip label={book.badge} size="small"
                        sx={{ position: "absolute", top: 12, right: 12, bgcolor: "#0EA5E9", color: "#0F172A", fontWeight: 700, borderRadius: "6px", fontSize: "10px" }} />
                      <Box component="img" src={book.image} alt={book.title}
                        sx={{ width: "100%", height: 220, objectFit: "contain", mb: 2, borderRadius: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0F172A", mb: 0.3 }}>{book.title}</Typography>
                      <Typography variant="caption" sx={{ color: "#888", display: "block", mb: 0.8 }}>by {book.author}</Typography>
                      <Rating value={book.rating} readOnly size="small" sx={{ color: "#0EA5E9", mb: 1.5 }} />
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1E293B" }}>{book.price}</Typography>
                        <Button variant="contained" size="small" onClick={() => router.push(`/books?search=${encodeURIComponent(book.title)}`)}
                          sx={{ borderRadius: "8px", textTransform: "none" }}>
                          View
                        </Button>
                      </Box>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button variant="contained" endIcon={<ArrowForwardIcon />} href="/books" sx={{ borderRadius: "10px", px: 4, py: 1.3 }}>
                View All Books
              </Button>
            </Box>
          </Container>
        </Box>

        {/* ===== CATEGORIES ===== */}
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
          <Container maxWidth="lg">
            <SectionTitle label="Browse" title="Explore Categories" subtitle="Find your next read from our diverse collection of genres." />
            <Grid container spacing={2}>
              {categories.map((cat, i) => (
                <Grid item xs={6} sm={4} md={3} key={i}>
                  <Card onClick={() => handleCategoryClick(cat.name)}
                    sx={{ borderRadius: "16px", textAlign: "center", py: 3.5, px: 2, cursor: "pointer",
                      transition: "all 0.3s ease", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                      "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 30px rgba(27,58,92,0.15)", bgcolor: "#1E293B", "& .catIcon, & .catTitle, & .catCount": { color: "#fff !important" } } }}>
                    <CardContent sx={{ p: 0 }}>
                      <Typography sx={{ fontSize: "40px", mb: 1.5, lineHeight: 1 }}>{cat.emoji}</Typography>
                      <Typography className="catTitle" variant="subtitle1" sx={{ fontWeight: 700, color: "#0F172A", mb: 0.5, transition: "color 0.3s" }}>{cat.name}</Typography>
                      <Typography className="catCount" variant="body2" sx={{ color: "#888", transition: "color 0.3s" }}>{cat.count.toLocaleString()} books</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ===== CATEGORY BOOKS ===== */}
        {showCategoryBooks && (
          <Box sx={{ bgcolor: "#FFFFFF", py: 5 }}>
            <Container maxWidth="lg">
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A" }}>{selectedCategory} Books</Typography>
                <Button variant="outlined" onClick={closeCategoryBooks} sx={{ borderRadius: "8px" }}>Close</Button>
              </Box>
              {loadingCategory ? (
                <Box sx={{ textAlign: "center", py: 8 }}><CircularProgress /></Box>
              ) : categoryBooks.length === 0 ? (
                <Typography sx={{ textAlign: "center", py: 4, color: "#888" }}>No books found in this category</Typography>
              ) : (
                <Grid container spacing={3}>
                  {categoryBooks.map((book, idx) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={book._id || idx}>
                      <GlassCard>
                        <Box component="img" src={book.coverImage || "/images/footer/book22.png"} alt={book.title}
                          sx={{ width: "100%", height: 200, objectFit: "contain", p: 2, bgcolor: "#f9f9f9", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }} />
                        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.3, color: "#0F172A" }}>{book.title}</Typography>
                          <Typography variant="caption" sx={{ color: "#888", mb: 0.8 }}>by {book.author}</Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Rating value={book.rating || 0} readOnly size="small" sx={{ color: "#0EA5E9" }} />
                          </Box>
                          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                            <Chip label={book.category} size="small" sx={{ bgcolor: "#1E293B", color: "#fff", fontSize: "10px", borderRadius: "6px" }} />
                            <Chip label={`Rs. ${book.price}`} size="small" sx={{ bgcolor: "#EF4444", color: "#fff", fontSize: "10px", borderRadius: "6px" }} />
                          </Box>
                          <Box sx={{ mt: "auto", display: "flex", gap: 1 }}>
                            <Button size="small" variant="contained" fullWidth onClick={() => router.push(`/books/${book._id}`)}
                              sx={{ borderRadius: "8px", textTransform: "none" }}>
                              View Details
                            </Button>
                            {isAuthenticated && (
                              <Button size="small" variant="outlined" fullWidth onClick={() => handleReserve(book._id)}
                                disabled={book.availableCopies <= 0} sx={{ borderRadius: "8px", textTransform: "none" }}>
                                Reserve
                              </Button>
                            )}
                          </Box>
                        </CardContent>
                      </GlassCard>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Container>
          </Box>
        )}

        {/* ===== NEW RELEASES ===== */}
        <Box sx={{ py: { xs: 6, md: 8 }, background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", color: "#fff" }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Chip label="Just Added" sx={{ bgcolor: "rgba(212,168,75,0.2)", color: "#0EA5E9", fontWeight: 700, mb: 2, borderRadius: "8px" }} />
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                  <AutoStoriesIcon sx={{ verticalAlign: "middle", mr: 1, color: "#0EA5E9" }} />
                  New Releases
                </Typography>
                <Typography sx={{ opacity: 0.75, mb: 4, lineHeight: 1.8, fontSize: "16px" }}>
                  Discover the latest additions to our library. Fresh books added weekly to keep you inspired and informed.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button variant="contained" endIcon={<ArrowForwardIcon />} href="/new-release" sx={{ borderRadius: "10px", px: 4, py: 1.3, bgcolor: "#0EA5E9", color: "#0F172A", fontWeight: 700, "&:hover": { bgcolor: "#38BDF8" } }}>
                    See New Releases
                  </Button>
                  <Button variant="outlined" sx={{ borderRadius: "10px", px: 4, py: 1.3, borderColor: "rgba(255,255,255,0.3)", color: "#fff", "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.05)" } }}>
                    Coming Soon
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  {[
                    { title: "Atomic Habits", author: "James Clear", image: "/images/footer/book19.svg" },
                    { title: "Ikigai", author: "Hector Garcia", image: "/images/footer/book21.svg" },
                    { title: "Deep Work", author: "Cal Newport", image: "/images/footer/book14.svg" },
                    { title: "The Subtle Art", author: "Mark Manson", image: "/images/footer/book15.svg" },
                  ].map((book, idx) => (
                    <Grid item xs={6} key={idx}>
                      <Paper sx={{ p: 2, borderRadius: "12px", bgcolor: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 2 }}>
                        <Box component="img" src={book.image} alt={book.title} sx={{ width: 50, height: 60, objectFit: "contain" }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 700, fontSize: "13px", mb: 0.2 }}>{book.title}</Typography>
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>{book.author}</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* ===== TEAM ===== */}
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#fff" }}>
          <Container maxWidth="lg">
            <SectionTitle label="Our Team" title="Meet Our Developers" subtitle="The talented people behind LibriVista." />
            <Grid container spacing={3} justifyContent="center">
              {teamMembers.map((member, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <GlassCard sx={{ textAlign: "center", overflow: "visible" }}>
                    <Box sx={{ pt: 4, pb: 3, px: 3 }}>
                      <Avatar src={member.image} alt={member.name}
                        sx={{ width: 100, height: 100, mx: "auto", mb: 2, border: "3px solid #0EA5E9", boxShadow: "0 4px 20px rgba(212,168,75,0.3)" }}>
                        {member.name.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0F172A", mb: 0.3 }}>{member.name}</Typography>
                      <Typography variant="caption" sx={{ color: "#0EA5E9", fontWeight: 600, display: "block", mb: 1.5 }}>{member.role}</Typography>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        <IconButton size="small" onClick={() => { setSelectedTeamMember(member); }} sx={{ bgcolor: "#F5F5F5", "&:hover": { bgcolor: "#1E293B", "& svg": { color: "#fff" } }, width: 36, height: 36 }}>
                          <FacebookIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                        </IconButton>
                        <IconButton size="small" onClick={() => { setSelectedTeamMember(member); }} sx={{ bgcolor: "#F5F5F5", "&:hover": { bgcolor: "#1E293B", "& svg": { color: "#fff" } }, width: 36, height: 36 }}>
                          <InstagramIcon sx={{ fontSize: 18, color: "#6B7280" }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Team Member Dialog */}
        <Dialog open={!!selectedTeamMember} onClose={() => setSelectedTeamMember(null)} maxWidth="sm" fullWidth>
          {selectedTeamMember && (
            <>
              <DialogTitle sx={{ textAlign: "center", pt: 3, pb: 0 }}>
                <IconButton onClick={() => setSelectedTeamMember(null)} sx={{ position: "absolute", right: 12, top: 12 }}>
                  <CloseIcon />
                </IconButton>
                <Avatar src={selectedTeamMember.image} alt={selectedTeamMember.name}
                  sx={{ width: 80, height: 80, mx: "auto", mb: 1.5, border: "3px solid #0EA5E9" }}>
                  {selectedTeamMember.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A" }}>{selectedTeamMember.name}</Typography>
                <Chip label={selectedTeamMember.role} sx={{ bgcolor: "rgba(212,168,75,0.15)", color: "#0EA5E9", fontWeight: 600, mt: 0.5, borderRadius: "8px" }} />
              </DialogTitle>
              <DialogContent sx={{ px: 4, pb: 3 }}>
                <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.9, mt: 2, mb: 2 }}>
                  {selectedTeamMember.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 2.5 }}>
                  <Button variant="outlined" size="small" startIcon={<FacebookIcon />} href={selectedTeamMember.facebook} target="_blank" sx={{ borderRadius: "8px" }}>Facebook</Button>
                  <Button variant="outlined" size="small" startIcon={<InstagramIcon />} href={selectedTeamMember.instagram} target="_blank" sx={{ borderRadius: "8px" }}>Instagram</Button>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>

        {/* ===== TESTIMONIALS ===== */}
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#FFFFFF" }}>
          <Container maxWidth="lg">
            <SectionTitle label="Testimonials" title="What Our Readers Say" subtitle="Hear from our community of readers and researchers." />
            <Grid container spacing={3}>
              {testimonials.map((t, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <GlassCard>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ width: 48, height: 48, bgcolor: "#1E293B", color: "#fff", fontWeight: 700 }}>{t.avatar}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A" }}>{t.name}</Typography>
                          <Typography variant="caption" sx={{ color: "#888" }}>{t.role}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#6B7280", lineHeight: 1.7, mb: 1.5, fontStyle: "italic" }}>"{t.text}"</Typography>
                      <Rating value={t.rating} readOnly size="small" sx={{ color: "#0EA5E9" }} />
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ===== NEWSLETTER ===== */}
        <Box sx={{ py: { xs: 6, md: 8 }, background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)" }}>
          <Container maxWidth="sm" sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#fff", mb: 1.5 }}>
              Stay in the Loop
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 3, fontSize: "16px" }}>
              Get notified about new arrivals, events, and exclusive reading tips.
            </Typography>
            <Paper sx={{ p: 0.5, pl: 2, borderRadius: "14px", display: "flex", alignItems: "center", bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
              <TextField fullWidth placeholder="Enter your email" variant="standard"
                InputProps={{ disableUnderline: true, sx: { color: "#fff", "&::placeholder": { color: "rgba(255,255,255,0.5)" } } }} />
              <Button variant="contained" sx={{ borderRadius: "12px", px: 3, py: 1.5, bgcolor: "#0EA5E9", color: "#0F172A", fontWeight: 700, "&:hover": { bgcolor: "#38BDF8" }, whiteSpace: "nowrap" }}>
                Subscribe
              </Button>
            </Paper>
          </Container>
        </Box>

        {/* ===== CTA ===== */}
        <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: "#fff", textAlign: "center" }}>
          <Container maxWidth="sm">
            <FavoriteIcon sx={{ fontSize: 40, color: "#EF4444", mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", mb: 1.5 }}>
              Ready to Start Reading?
            </Typography>
            <Typography sx={{ color: "#6B7280", mb: 3, fontSize: "16px" }}>
              Join thousands of readers who have discovered their next favorite book at LibriVista.
            </Typography>
            <Button variant="contained" size="large" href="/books" sx={{ borderRadius: "12px", px: 5, py: 1.5, fontSize: "16px" }}>
              <LibraryBooksIcon sx={{ mr: 1 }} />
              Explore Books Now
            </Button>
          </Container>
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ borderRadius: "10px" }}>{snackbar.message}</Alert>
      </Snackbar>
    </HomeLayout>
    </>
  );
}
