"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress, Alert, TablePagination, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../../layouts/HomeLayout/layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BookIcon from "@mui/icons-material/Book";
import VisibilityIcon from "@mui/icons-material/Visibility";

const AdminBox = styled(Box)(({ theme }) => ({
  "& .pageHeader": { background: "#000", color: "#fff", padding: "30px 0", borderRadius: "0 0 50px 50px", marginBottom: "30px" },
  "& .statCard": { borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: "24px", textAlign: "center" },
}));

export default function ManageBorrowings() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [borrowings, setBorrowings] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBorrowing, setSelectedBorrowing] = useState(null);
  const [message, setMessage] = useState({ show: false, success: false, text: "" });

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) router.push("/");
  }, [loading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) fetchBorrowings();
  }, [isAdmin, page, rowsPerPage, statusFilter]);

  const fetchBorrowings = async () => {
    try {
      const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/borrowings/admin?${params}`);
      const data = await res.json();
      if (data.success) { setBorrowings(data.borrowings); setTotal(data.pagination.total); setStats(data.stats); }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  if (loading || !isAuthenticated || !isAdmin) {
    return <HomeLayout><Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress /></Box></HomeLayout>;
  }

  return (
    <HomeLayout>
      <AdminBox>
        <Box className="pageHeader">
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Manage Borrowings</Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>Track and manage all book borrowings</Typography>
          </Container>
        </Box>
        <Container maxWidth="lg">
          {message.show && <Alert severity={message.success ? "success" : "error"} sx={{ mb: 3 }}>{message.text}</Alert>}

          {stats && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Card className="statCard"><BookIcon sx={{ fontSize: 32, color: "#1a1a1a", mb: 1 }} /><Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.total}</Typography><Typography variant="caption">Total</Typography></Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card className="statCard"><BookIcon sx={{ fontSize: 32, color: "#FF9800", mb: 1 }} /><Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.activeCount}</Typography><Typography variant="caption">Active</Typography></Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card className="statCard"><BookIcon sx={{ fontSize: 32, color: "#4CAF50", mb: 1 }} /><Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.returnedCount}</Typography><Typography variant="caption">Returned</Typography></Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card className="statCard"><BookIcon sx={{ fontSize: 32, color: "#f44336", mb: 1 }} /><Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.overdueCount}</Typography><Typography variant="caption">Overdue</Typography></Card>
              </Grid>
            </Grid>
          )}

          <Box sx={{ mb: 3, maxWidth: 300 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select value={statusFilter} label="Filter by Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="returned">Returned</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Book</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Borrow Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Return Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Late Fee</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>
                ) : borrowings.length === 0 ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: "#888" }}>No borrowings found</TableCell></TableRow>
                ) : borrowings.map((b) => (
                  <TableRow key={b._id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>{b.user?.name || "Unknown"}</Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>{b.user?.membershipId || ""}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>{b.book?.title || "Unknown"}</Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>{b.book?.author || ""}</Typography>
                    </TableCell>
                    <TableCell>{b.borrowDate ? new Date(b.borrowDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{b.dueDate ? new Date(b.dueDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{b.returnDate ? new Date(b.returnDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <Chip label={b.status} size="small" sx={{
                        bgcolor: b.status === "active" ? "#e3f2fd" : b.status === "returned" ? "#e8f5e9" : "#ffebee",
                        color: b.status === "active" ? "#1976d2" : b.status === "returned" ? "#4CAF50" : "#f44336",
                        fontWeight: 600,
                      }} />
                    </TableCell>
                    <TableCell>{b.lateFee ? `Rs. ${b.lateFee}` : "-"}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => { setSelectedBorrowing(b); setDetailOpen(true); }}><VisibilityIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination component="div" count={total} page={page} onPageChange={(e, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
          </TableContainer>
        </Container>
      </AdminBox>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Borrowing Details</DialogTitle>
        <DialogContent>
          {selectedBorrowing && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <Typography><strong>User:</strong> {selectedBorrowing.user?.name} ({selectedBorrowing.user?.email})</Typography>
              <Typography><strong>Book:</strong> {selectedBorrowing.book?.title} by {selectedBorrowing.book?.author}</Typography>
              <Typography><strong>Borrow Date:</strong> {new Date(selectedBorrowing.borrowDate).toLocaleDateString()}</Typography>
              <Typography><strong>Due Date:</strong> {new Date(selectedBorrowing.dueDate).toLocaleDateString()}</Typography>
              <Typography><strong>Return Date:</strong> {selectedBorrowing.returnDate ? new Date(selectedBorrowing.returnDate).toLocaleDateString() : "Not returned"}</Typography>
              <Typography><strong>Status:</strong> <Chip label={selectedBorrowing.status} size="small" color={selectedBorrowing.status === "returned" ? "success" : selectedBorrowing.status === "active" ? "info" : "error"} /></Typography>
              {selectedBorrowing.lateFee > 0 && <Typography><strong>Late Fee:</strong> Rs. {selectedBorrowing.lateFee}</Typography>}
              {selectedBorrowing.notes && <Typography><strong>Notes:</strong> {selectedBorrowing.notes}</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setDetailOpen(false)} sx={{ textTransform: "none" }}>Close</Button></DialogActions>
      </Dialog>
    </HomeLayout>
  );
}
