"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Grid, Card, CardContent, Rating, Button, TextField, InputAdornment, Chip, CircularProgress, Pagination, Snackbar, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../layouts/HomeLayout/layout";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/src/lib/api";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useRouter } from "next/navigation";

const BooksBox = styled(Box)(({ theme }) => ({
  "& .booksBox": {
    padding: "60px 0",
    minHeight: "calc(100vh - 300px)",
  },
  "& .heroSection": {
    background: "#000000",
    color: "#fff",
    padding: "60px 0",
    textAlign: "center",
    borderRadius: "0 0 50px 50px",
    marginBottom: "40px",
  },
  "& .bookCard": {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    },
  },
  "& .categoryChip": {
    cursor: "pointer",
    borderRadius: "20px",
    padding: "8px 16px",
    "&.active": {
      bgcolor: "#000000",
      color: "#fff",
    },
  },
}));

const categories = ["All", "Fiction", "Non-Fiction", "Academic", "Science", "History", "Children", "Self-Help", "Business", "Technology", "Biography", "Philosophy"];

export default function Books() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchBooks();
  }, [page, selectedCategory]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let url = `/api/books?page=${page}&limit=12`;
      if (selectedCategory !== "All") {
        url += `&category=${selectedCategory}`;
      }
      if (searchQuery) {
        url += `&search=${searchQuery}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setBooks(data.books);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleReserve = async (bookId) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await apiFetch("/api/reservations", {
        method: "POST",
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();

      if (data.success) {
        setSnackbar({ open: true, message: "Book reserved successfully!", severity: "success" });
      } else {
        setSnackbar({ open: true, message: data.message || "Failed to reserve book", severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to reserve book", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <HomeLayout>
      <BooksBox>
        <Box className="heroSection">
          <Container maxWidth="lg">
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: "white" }}>
              Explore Our Library
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: "700px", margin: "0 auto", opacity: 0.9, color: "white" }}>
              Browse through our extensive collection of 50,000+ books across all genres.
            </Typography>
          </Container>
        </Box>

        <Box className="booksBox">
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
              <form onSubmit={handleSearch} style={{ minWidth: "100%", display: "flex", gap: 2 }}>
                <TextField
                  placeholder="Search books, authors, ISBN..."
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button type="submit" variant="contained" sx={{ borderRadius: "8px", bgcolor: "#000000", px: 3 }}>
                  Search
                </Button>
              </form>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={{ borderRadius: "20px", px: 3 }}
              >
                Filters
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap", justifyContent: "center" }}>
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  className={`categoryChip ${selectedCategory === cat ? "active" : ""}`}
                  variant="outlined"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                />
              ))}
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : books.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" sx={{ color: "#888" }}>No books found</Typography>
                <Typography sx={{ color: "#666" }}>Try adjusting your search or filters</Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {books.map((book) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
                    <Card className="bookCard">
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          component="img"
                          src={book.coverImage || "/images/footer/book22.png"}
                          alt={book.title}
                          sx={{
                            width: "100%",
                            height: "220px",
                            objectFit: "contain",
                            mb: 2,
                            borderRadius: 1,
                          }}
                        />
                        {book.badge && (
                          <Chip label={book.badge} size="small" sx={{ mb: 1, bgcolor: "#000000", color: "#fff" }} />
                        )}
                        <Chip label={book.category} size="small" sx={{ mb: 1, ml: 1, bgcolor: "#f0f0f0" }} />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: "#000000", mb: 0.5 }}
                        >
                          {book.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#999", display: "block", mb: 1 }}>
                          by {book.author}
                        </Typography>
                        <Rating value={book.rating || 0} readOnly size="small" sx={{ color: "#ffb400", mb: 1 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "#000000" }}>
                            Rs. {book.price}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={book.availableCopies <= 0}
                            onClick={() => handleReserve(book._id)}
                            sx={{
                              bgcolor: book.availableCopies > 0 ? "#000000" : "#ccc",
                              borderRadius: "8px",
                              textTransform: "none",
                              "&:hover": { bgcolor: book.availableCopies > 0 ? "#333333" : "#ccc" },
                            }}
                          >
                            {book.availableCopies > 0 ? "Reserve" : "Unavailable"}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
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
                  color="standard"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: "8px",
                    },
                    "& .Mui-selected": {
                      bgcolor: "#000000 !important",
                      color: "#fff",
                    },
                  }}
                />
              </Box>
            )}
          </Container>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </BooksBox>
    </HomeLayout>
  );
}
