"use client";
import { useState } from "react";
import { Box, Typography, Container, Button, Card, CardContent, Grid, Chip, CircularProgress, Alert, Snackbar } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import LinkIcon from "@mui/icons-material/Link";

export default function ImportBooksPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleImport = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/pustakalaya-seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.success) {
        setResult({ success: true, books: data.books, count: data.booksAdded });
        setSnackbar({ open: true, message: `Successfully imported ${data.booksAdded} books!`, severity: "success" });
      } else {
        setResult({ success: false, message: data.message });
        setSnackbar({ open: true, message: data.message, severity: "warning" });
      }
    } catch (error) {
      setResult({ success: false, message: "Failed to import books" });
      setSnackbar({ open: true, message: "Failed to import books", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
          Import Books from E-Pustakalaya
        </Typography>
        <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
          Import 25+ popular Nepali and English books from OLE Nepal&apos;s E-Pustakalaya digital library
        </Typography>
        <Chip label="Source: pustakalaya.org" sx={{ bgcolor: "#E3F2FD", color: "#1565C0", mb: 3, fontWeight: 600 }} />
        <br />
        <Button
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <DownloadIcon />}
          onClick={handleImport}
          disabled={loading}
          sx={{
            bgcolor: "#000000",
            borderRadius: "8px",
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontSize: "16px",
            "&:hover": { bgcolor: "#333333" },
          }}
        >
          {loading ? "Importing..." : "Import Books"}
        </Button>
      </Box>

      {result && result.success && (
        <Box sx={{ mt: 4 }}>
          <Alert icon={<CheckCircleIcon />} severity="success" sx={{ mb: 3 }}>
            Successfully imported {result.count} books from E-Pustakalaya!
          </Alert>
          <Grid container spacing={2}>
            {result.books.map((book, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                      by {book.author}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip label={book.category} size="small" sx={{ bgcolor: "#f0f0f0" }} />
                      <Chip label={book.language} size="small" sx={{ bgcolor: "#E8F5E9", color: "#2E7D32" }} />
                    </Box>
                    <Box
                      component="a"
                      href={book.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 1,
                        color: "#1565C0",
                        fontSize: "0.75rem",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      <LinkIcon fontSize="small" />
                      Read on E-Pustakalaya
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {result && !result.success && (
        <Alert icon={<ErrorIcon />} severity="warning" sx={{ mt: 3 }}>
          {result.message}
        </Alert>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
