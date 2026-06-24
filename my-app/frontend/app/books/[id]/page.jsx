"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Grid, Rating, Button, Chip, CircularProgress, Snackbar, Alert, Divider, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../../layouts/HomeLayout/layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

export default function BookDetail() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bookId = params.id;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const hasLocalPdf = book?.sourceUrl?.startsWith("/pdfs/");
  const hasRemoteUrl = book?.sourceUrl?.startsWith("http");

  useEffect(() => { if (bookId) fetchBook(); }, [bookId]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/books/${bookId}`);
      const data = await res.json();
      setBook(data.success && data.book ? data.book : null);
    } catch { setBook(null); }
    finally { setLoading(false); }
  };

  const handleReserve = async () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    try {
      const res = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ bookId: book._id }) });
      const data = await res.json();
      if (data.success) {
        setSnackbar({ open: true, message: "Book reserved successfully!", severity: "success" });
        setTimeout(() => router.push("/reservations"), 1000);
      } else {
        setSnackbar({ open: true, message: data.message || data.error || "Failed to reserve", severity: "error" });
      }
    } catch { setSnackbar({ open: true, message: "Failed to reserve book", severity: "error" }); }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    try {
      const method = wishlist ? "DELETE" : "POST";
      const res = await fetch(`/api/user/wishlist?bookId=${book._id}`, { method, credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setWishlist(!wishlist);
        setSnackbar({ open: true, message: wishlist ? "Removed from wishlist" : "Added to wishlist!", severity: "success" });
      }
    } catch { console.error("Wishlist error:"); }
  };

  if (loading) {
    return (
      <HomeLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress /></Box>
      </HomeLayout>
    );
  }

  if (!book) {
    return (
      <HomeLayout>
        <Container maxWidth="lg" sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", mb: 2 }}>Book Not Found</Typography>
          <Typography sx={{ color: "#888", mb: 4 }}>The book you are looking for does not exist or has been removed.</Typography>
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => router.push("/books")} sx={{ borderRadius: "10px", px: 4 }}>Back to Books</Button>
        </Container>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 4, color: "#64748B", textTransform: "none", "&:hover": { color: "#1E293B" } }}>
          Back
        </Button>

        <Grid container spacing={5}>
          {/* LEFT - Cover Image */}
          <Grid item xs={12} md={5}>
            <Paper sx={{
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              bgcolor: "#FAFAFA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 400,
              position: "relative",
            }}>
              <Box
                component="img"
                src={book.coverImage || "/images/footer/book22.png"}
                alt={book.title}
                sx={{ maxWidth: "100%", maxHeight: 420, objectFit: "contain", p: 3, transition: "transform 0.4s ease", "&:hover": { transform: "scale(1.05)" } }}
              />
            </Paper>
          </Grid>

          {/* RIGHT - Details */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              {book.source === "CDC Nepal" && (
                <Chip label="CDC Nepal" sx={{ bgcolor: "#1E293B", color: "#fff", fontWeight: 600, borderRadius: "8px" }} />
              )}
              {book.badge && (
                <Chip label={book.badge} sx={{ bgcolor: "#0EA5E9", color: "#0F172A", fontWeight: 700, borderRadius: "8px" }} />
              )}
              <Chip label={book.category} sx={{ bgcolor: "rgba(27,58,92,0.08)", color: "#1E293B", fontWeight: 600, borderRadius: "8px" }} />
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
              {book.title}
            </Typography>
            <Typography variant="h6" sx={{ color: "#888", mb: 2, fontWeight: 400 }}>
              by {book.author}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Rating value={book.rating || 0} readOnly size="large" sx={{ color: "#0EA5E9" }} />
              <Typography variant="body1" sx={{ color: "#888" }}>({book.ratingCount || 0} ratings)</Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, color: "#10B981", mb: 3 }}>
              Free Textbook
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              {[
                { label: "Publisher", value: "Curriculum Development Centre" },
                { label: "Published Year", value: book.publishYear || "N/A" },
                { label: "Available Copies", value: `${book.availableCopies || 0} / ${book.totalCopies || 0}`, color: book.availableCopies > 0 ? "#10B981" : "#EF4444" },
                { label: "Language", value: book.language || "N/A" },
                ...(book.pages > 0 ? [{ label: "Pages", value: book.pages }] : []),
              ].map((item) => (
                <Grid item xs={6} key={item.label}>
                  <Typography variant="caption" sx={{ color: "#888", display: "block", mb: 0.2 }}>{item.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: item.color || "#0F172A" }}>{item.value}</Typography>
                </Grid>
              ))}
            </Grid>

            {book.description && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0F172A", mb: 1 }}>Description</Typography>
                <Typography variant="body2" sx={{ color: "#64748B", lineHeight: 1.8 }}>{book.description}</Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              {!hasLocalPdf && !hasRemoteUrl && (
                <Box sx={{ width: "100%", p: 2, bgcolor: "rgba(212,168,75,0.1)", borderRadius: "10px", mb: 1 }}>
                  <Typography variant="body2" sx={{ color: "#D97706" }}>No digital copy available. Check back later or reserve a physical copy.</Typography>
                </Box>
              )}
              {(hasLocalPdf || hasRemoteUrl) && (
                <Button variant="contained" size="medium" startIcon={hasLocalPdf ? <MenuBookIcon /> : <OpenInNewIcon />}
                  onClick={() => { if (hasLocalPdf) router.push(`/books/${book._id}/read`); else window.open(book.sourceUrl, "_blank", "noopener,noreferrer"); }}
                  sx={{ minWidth: "160px", borderRadius: "10px", px: 3, py: 1.2, fontSize: "15px" }}>
                  {hasLocalPdf ? "Read Online" : "Open PDF"}
                </Button>
              )}
              {hasLocalPdf && (
                <Button variant="outlined" size="medium" startIcon={<DownloadIcon />} href={book.sourceUrl} download
                  sx={{ minWidth: "140px", borderRadius: "10px", px: 3, py: 1.2, fontSize: "15px" }}>
                  Download PDF
                </Button>
              )}
              <Button variant="contained" color="secondary" size="medium" startIcon={<LocalLibraryIcon />}
                onClick={handleReserve} disabled={book.availableCopies <= 0}
                sx={{ minWidth: "200px", px: 3, py: 1.2, borderRadius: "10px", fontSize: "15px" }}>
                {book.availableCopies > 0 ? "Reserve Physical Copy" : "Currently Unavailable"}
              </Button>
              <Button variant="outlined" size="medium" startIcon={wishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={handleWishlist}
                sx={{ minWidth: "140px", px: 3, py: 1.2, borderRadius: "10px", fontSize: "15px", borderColor: wishlist ? "#EF4444" : "#E0E0E0", color: wishlist ? "#EF4444" : "#888" }}>
                {wishlist ? "Wishlisted" : "Wishlist"}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Table of Contents */}
        {book.chapters?.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", mb: 3 }}>
              <AutoStoriesIcon sx={{ verticalAlign: "middle", mr: 1, color: "#0EA5E9" }} />
              Table of Contents {book.pages ? `(${book.pages} pages)` : ""}
            </Typography>
            <Paper sx={{ maxHeight: 400, overflow: "auto", bgcolor: "#FAFAFA", borderRadius: "12px", p: 2, border: "1px solid rgba(0,0,0,0.04)" }}>
              {book.chapters.map((ch, i) => (
                <Box key={i} sx={{ py: 0.6, px: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "6px", "&:hover": { bgcolor: "rgba(27,58,92,0.04)" }, ...(ch.depth > 0 ? { pl: 2 + ch.depth * 2 } : {}) }}>
                  <Typography variant="body2" sx={{ fontWeight: ch.depth === 0 ? 600 : 400, color: ch.depth === 0 ? "#1E293B" : "#64748B", fontSize: ch.depth === 0 ? "0.9rem" : "0.82rem", flex: 1 }}>
                    {ch.title}
                  </Typography>
                  {ch.page && <Typography variant="caption" sx={{ color: "#aaa", ml: 2, whiteSpace: "nowrap" }}>p. {ch.page}</Typography>}
                </Box>
              ))}
            </Paper>
          </Box>
        )}

        {/* Digital Copy CTA */}
        {hasLocalPdf && (
          <Box sx={{ mt: 5, p: 4, bgcolor: "rgba(27,58,92,0.03)", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(27,58,92,0.06)" }}>
            <PictureAsPdfIcon sx={{ fontSize: 56, color: "#EF4444", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>Digital Copy Available</Typography>
            <Typography variant="body2" sx={{ color: "#888", mb: 3 }}>Read this book online or download it for offline access.</Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button variant="contained" startIcon={<MenuBookIcon />} onClick={() => router.push(`/books/${book._id}/read`)}
                sx={{ borderRadius: "10px", px: 3, py: 1.2, fontSize: "15px" }}>Read Online</Button>
              <Button variant="outlined" startIcon={<DownloadIcon />} href={book.sourceUrl} download
                sx={{ borderRadius: "10px", px: 3, py: 1.2, fontSize: "15px" }}>Download PDF</Button>
            </Box>
          </Box>
        )}
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ borderRadius: "10px" }}>{snackbar.message}</Alert>
      </Snackbar>
    </HomeLayout>
  );
}
