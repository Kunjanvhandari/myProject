"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Grid, Button, TextField, InputAdornment, Chip, CircularProgress, Pagination, Snackbar, Alert } from "@mui/material";
import HomeLayout from "../../layouts/HomeLayout/layout";
import SearchIcon from "@mui/icons-material/Search";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BookCard from "../../components/BookCard";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const categories = ["All", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];

function BooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => { fetchBooks(); }, [page, selectedCategory, searchQuery]);

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) { setSearchQuery(urlSearch); setPage(1); setSelectedCategory("All"); }
  }, [searchParams.get("search")]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const effectiveSearch = searchQuery || searchParams.get("search") || "";
      let localUrl = `/api/books?page=${page}&limit=24`;
      if (effectiveSearch) localUrl += `&search=${encodeURIComponent(effectiveSearch)}`;
      if (selectedCategory !== "All") localUrl += `&category=${selectedCategory}`;
      const localRes = await fetch(localUrl);
      const localData = await localRes.json();
      if (localData.success && localData.books?.length > 0) {
        setBooks(localData.books.map((b) => ({ ...b, id: b._id })));
        setTotalPages(localData.pagination.pages);
      } else { setBooks([]); setTotalPages(1); }
    } catch { setBooks([]); setTotalPages(1); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); };

  return (
    <HomeLayout>
      <Box>
        {/* HERO */}
        <Box sx={{ background: "linear-gradient(135deg, #0F1A2E 0%, #1B3A5C 100%)", py: { xs: 6, md: 8 }, textAlign: "center", position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", top: "-50%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(212,168,75,0.06)" }} />
          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <LibraryBooksIcon sx={{ fontSize: 48, color: "#D4A84B", mb: 2 }} />
            <Typography variant="h2" sx={{ fontWeight: 800, color: "#fff", mb: 2 }}>
              Explore Our Library
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", maxWidth: "600px", mx: "auto" }}>
              Browse CDC Nepal textbooks from Class 1 to Class 12 — all free and open.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 5 }}>
          {/* Search & Filters */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 5 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                placeholder="Search books, authors..."
                variant="outlined"
                sx={{ flex: 1, minWidth: "280px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#bbb" }} /></InputAdornment>,
                  sx: { borderRadius: "12px", bgcolor: "#fff", "& fieldset": { borderColor: "#E8E8E8" } },
                }}
              />
              <Button type="submit" variant="contained" onClick={handleSearch} sx={{ borderRadius: "10px", px: 3 }}>
                Search
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => { setSelectedCategory(cat); setPage(1); setSearchQuery(""); if (searchParams.get("search")) router.push("/library/books"); }}
                  sx={{
                    borderRadius: "10px",
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    bgcolor: selectedCategory === cat ? "#1B3A5C" : "transparent",
                    color: selectedCategory === cat ? "#fff" : "#5A5A7A",
                    border: selectedCategory === cat ? "none" : "1px solid #E0E0E0",
                    "&:hover": { bgcolor: selectedCategory === cat ? "#1B3A5C" : "#F5F5F5" },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Books Grid */}
          {loading ? (
            <Box sx={{ textAlign: "center", py: 10 }}><CircularProgress /></Box>
          ) : books.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography variant="h6" sx={{ color: "#888", mb: 1 }}>No books found</Typography>
              <Typography sx={{ color: "#aaa" }}>Try adjusting your search or select a different class</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {books.map((book) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
                  <BookCard
                    book={book}
                    onViewDetails={(id) => router.push(`/library/books/${id}`)}
                    isAuthenticated={false}
                    showReserve={false}
                    showPrice={false}
                    badgeColor="#D4A84B"
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, val) => setPage(val)}
                sx={{
                  "& .MuiPaginationItem-root": { borderRadius: "8px" },
                  "& .Mui-selected": { bgcolor: "#1B3A5C !important", color: "#fff", fontWeight: 700 },
                }}
              />
            </Box>
          )}
        </Container>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ borderRadius: "10px", width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </HomeLayout>
  );
}

export default function Books() {
  return (
    <Suspense fallback={<Box sx={{ textAlign: "center", py: 8 }}><CircularProgress /></Box>}>
      <BooksContent />
    </Suspense>
  );
}
