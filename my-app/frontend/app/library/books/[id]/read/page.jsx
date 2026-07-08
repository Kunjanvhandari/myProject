"use client";
import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dynamic from "next/dynamic";

const PdfBookReader = dynamic(() => import("@/src/components/PdfBookReader"), {
  ssr: false,
  loading: () => (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#1a1a2e", flexDirection: "column", gap: 2 }}>
      <CircularProgress sx={{ color: "#fff" }} />
      <Typography sx={{ color: "#aaa" }}>Loading reader...</Typography>
    </Box>
  ),
});

export default function BookReaderPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/books/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.book) {
          setBook(data.book);
        } else {
          setError("Book not found");
        }
      })
      .catch(() => setError("Failed to load book"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#1a1a2e", flexDirection: "column", gap: 2 }}>
        <CircularProgress sx={{ color: "#fff" }} />
        <Typography sx={{ color: "#aaa" }}>Loading book...</Typography>
      </Box>
    );
  }

  if (error || !book) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#1a1a2e", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" sx={{ color: "#fff" }}>{error || "Book not found"}</Typography>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ color: "#fff", borderColor: "#fff" }}>Go Back</Button>
      </Box>
    );
  }

  if (!book.sourceUrl) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#1a1a2e", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" sx={{ color: "#fff" }}>No digital copy available</Typography>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ color: "#fff", borderColor: "#fff" }}>Go Back</Button>
      </Box>
    );
  }

  const pdfUrl = encodeURI(book.sourceUrl);

  return <PdfBookReader pdfUrl={pdfUrl} title={book.title} />;
}
