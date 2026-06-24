"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, TablePagination } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../../layouts/HomeLayout/layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const AdminBox = styled(Box)(({ theme }) => ({
  "& .pageHeader": { background: "#000", color: "#fff", padding: "30px 0", borderRadius: "0 0 50px 50px", marginBottom: "30px" },
  "& .statCard": { borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: "24px", textAlign: "center" },
}));

const categories = ["Fiction", "Non-Fiction", "Science", "Technology", "History", "Biography", "Self-Help", "Business", "Academic", "Children", "Romance", "Mystery", "Fantasy", "Poetry", "Philosophy", "Religion", "Art", "Other"];

export default function ManageBooks() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [formData, setFormData] = useState({ title: "", author: "", isbn: "", category: "Other", description: "", publisher: "", publishYear: "", pages: "", price: "", totalCopies: 1, availableCopies: 1, status: "available" });
  const [message, setMessage] = useState({ show: false, success: false, text: "" });
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, bookId: null });

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) router.push("/");
  }, [loading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) fetchBooks();
  }, [isAdmin, page, rowsPerPage]);

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
      if (search) params.set("search", search);
      const res = await fetch(`/api/books?${params}`);
      const data = await res.json();
      if (data.success) { setBooks(data.books); setTotal(data.pagination.total); }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleOpenAdd = () => {
    setEditBook(null);
    setFormData({ title: "", author: "", isbn: "", category: "Other", description: "", publisher: "", publishYear: "", pages: "", price: "", totalCopies: 1, availableCopies: 1, status: "available" });
    setDialogOpen(true);
  };

  const handleOpenEdit = (book) => {
    setEditBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      category: book.category || "Other",
      description: book.description || "",
      publisher: book.publisher || "",
      publishYear: book.publishYear?.toString() || "",
      pages: book.pages?.toString() || "",
      price: book.price?.toString() || "",
      totalCopies: book.totalCopies || 1,
      availableCopies: book.availableCopies || 1,
      status: book.status || "available",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.author) {
      setMessage({ show: true, success: false, text: "Title and author are required" });
      setTimeout(() => setMessage({ show: false }), 3000);
      return;
    }
    setSaving(true);
    try {
      const payload = { ...formData, publishYear: formData.publishYear ? parseInt(formData.publishYear) : null, pages: formData.pages ? parseInt(formData.pages) : 0, price: formData.price ? parseFloat(formData.price) : 0 };
      const url = editBook ? `/api/books/${editBook._id}` : "/api/books";
      const method = editBook ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        setMessage({ show: true, success: true, text: editBook ? "Book updated successfully!" : "Book created successfully!" });
        setDialogOpen(false);
        fetchBooks();
      } else {
        setMessage({ show: true, success: false, text: data.message || "Failed to save book" });
      }
    } catch (e) {
      setMessage({ show: true, success: false, text: "Failed to save book" });
    }
    setSaving(false);
    setTimeout(() => setMessage({ show: false }), 3000);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/books/${deleteDialog.bookId}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setMessage({ show: true, success: true, text: "Book deleted successfully!" });
        setDeleteDialog({ open: false, bookId: null });
        fetchBooks();
      } else {
        setMessage({ show: true, success: false, text: data.message || "Failed to delete book" });
      }
    } catch (e) {
      setMessage({ show: true, success: false, text: "Failed to delete book" });
    }
    setTimeout(() => setMessage({ show: false }), 3000);
  };

  const handleSearch = () => { setIsLoading(true); setPage(0); fetchBooks(); };

  if (loading || !isAuthenticated || !isAdmin) {
    return <HomeLayout><Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress /></Box></HomeLayout>;
  }

  return (
    <HomeLayout>
      <AdminBox>
        <Box className="pageHeader">
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Manage Books</Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>Add, edit, or remove books from the library collection</Typography>
          </Container>
        </Box>
        <Container maxWidth="lg">
          {message.show && <Alert severity={message.success ? "success" : "error"} sx={{ mb: 3 }}>{message.text}</Alert>}

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1, maxWidth: 500 }}>
              <TextField size="small" fullWidth placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
              <Button variant="contained" sx={{ bgcolor: "#000", borderRadius: "8px", minWidth: 40 }} onClick={handleSearch}><SearchIcon /></Button>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#000", borderRadius: "8px", textTransform: "none" }} onClick={handleOpenAdd}>Add New Book</Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Copies</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>
                ) : books.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: "#888" }}>No books found</TableCell></TableRow>
                ) : books.map((book) => (
                  <TableRow key={book._id} hover>
                    <TableCell><Typography sx={{ fontWeight: 600 }}>{book.title}</Typography></TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell><Chip label={book.category} size="small" sx={{ bgcolor: "#f0f0f0", borderRadius: "8px" }} /></TableCell>
                    <TableCell>{book.availableCopies}/{book.totalCopies}</TableCell>
                    <TableCell>Rs. {book.price}</TableCell>
                    <TableCell>
                      <Chip label={book.status} size="small" sx={{
                        bgcolor: book.status === "available" ? "#e8f5e9" : book.status === "checkedOut" ? "#fff3e0" : "#ffebee",
                        color: book.status === "available" ? "#4CAF50" : book.status === "checkedOut" ? "#FF9800" : "#f44336",
                        fontWeight: 600,
                      }} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenEdit(book)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton onClick={() => setDeleteDialog({ open: true, bookId: book._id })} color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination component="div" count={total} page={page} onPageChange={(e, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
          </TableContainer>
        </Container>
      </AdminBox>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editBook ? "Edit Book" : "Add New Book"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="ISBN" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={formData.category} label="Category" onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Publisher" value={formData.publisher} onChange={(e) => setFormData({ ...formData, publisher: e.target.value })} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Publish Year" type="number" value={formData.publishYear} onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Pages" type="number" value={formData.pages} onChange={(e) => setFormData({ ...formData, pages: e.target.value })} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Price (Rs.)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Total Copies" type="number" value={formData.totalCopies} onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) || 1 })} /></Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={formData.status} label="Status" onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="checkedOut">Checked Out</MenuItem>
                  <MenuItem value="unavailable">Unavailable</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ bgcolor: "#000", textTransform: "none" }}>{saving ? "Saving..." : "Save"}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, bookId: null })}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this book? This action cannot be undone.</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, bookId: null })} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete} sx={{ textTransform: "none" }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </HomeLayout>
  );
}
