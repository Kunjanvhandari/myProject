"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress, Alert, TablePagination, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../../layouts/HomeLayout/layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import EventIcon from "@mui/icons-material/Event";
import EditIcon from "@mui/icons-material/Edit";

const AdminBox = styled(Box)(({ theme }) => ({
  "& .pageHeader": { background: "#000", color: "#fff", padding: "30px 0", borderRadius: "0 0 50px 50px", marginBottom: "30px" },
  "& .statCard": { borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: "24px", textAlign: "center" },
}));

export default function ManageReservations() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [message, setMessage] = useState({ show: false, success: false, text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) router.push("/");
  }, [loading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) fetchReservations();
  }, [isAdmin, page, rowsPerPage, statusFilter]);

  const fetchReservations = async () => {
    try {
      const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/reservations/admin?${params}`);
      const data = await res.json();
      if (data.success) { setReservations(data.reservations); setTotal(data.pagination.total); setStats(data.stats); }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleEdit = (res) => {
    setSelectedReservation(res);
    setEditStatus(res.status);
    setEditOpen(true);
  };

  const handleSaveStatus = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/reservations/admin/${selectedReservation._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ status: editStatus }) });
      const data = await res.json();
      if (data.success) {
        setMessage({ show: true, success: true, text: "Reservation updated!" });
        setEditOpen(false);
        fetchReservations();
      } else { setMessage({ show: true, success: false, text: data.message }); }
    } catch (e) { setMessage({ show: true, success: false, text: "Failed to update" }); }
    setSaving(false);
    setTimeout(() => setMessage({ show: false }), 3000);
  };

  if (loading || !isAuthenticated || !isAdmin) {
    return <HomeLayout><Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress /></Box></HomeLayout>;
  }

  return (
    <HomeLayout>
      <AdminBox>
        <Box className="pageHeader">
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Manage Reservations</Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>View and manage all book reservations</Typography>
          </Container>
        </Box>
        <Container maxWidth="lg">
          {message.show && <Alert severity={message.success ? "success" : "error"} sx={{ mb: 3 }}>{message.text}</Alert>}

          {stats && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Card className="statCard"><EventIcon sx={{ fontSize: 32, color: "#1a1a1a", mb: 1 }} /><Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.total}</Typography><Typography variant="caption">Total</Typography></Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card className="statCard"><EventIcon sx={{ fontSize: 32, color: "#FF9800", mb: 1 }} /><Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.pendingCount}</Typography><Typography variant="caption">Pending</Typography></Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card className="statCard"><EventIcon sx={{ fontSize: 32, color: "#4CAF50", mb: 1 }} /><Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.confirmedCount}</Typography><Typography variant="caption">Confirmed</Typography></Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card className="statCard"><EventIcon sx={{ fontSize: 32, color: "#f44336", mb: 1 }} /><Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.cancelledCount}</Typography><Typography variant="caption">Cancelled</Typography></Card>
              </Grid>
            </Grid>
          )}

          <Box sx={{ mb: 3, maxWidth: 300 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select value={statusFilter} label="Filter by Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Book</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Reserved On</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Expires</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>
                ) : reservations.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: "#888" }}>No reservations found</TableCell></TableRow>
                ) : reservations.map((res) => (
                  <TableRow key={res._id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>{res.user?.name || "Unknown"}</Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>{res.user?.membershipId || ""}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>{res.book?.title || "Unknown"}</Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>{res.book?.author || ""}</Typography>
                    </TableCell>
                    <TableCell>{res.reservedOn ? new Date(res.reservedOn).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{res.reserveExpiry ? new Date(res.reserveExpiry).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>Rs. {res.totalPrice || 0}</TableCell>
                    <TableCell>
                      <Chip label={res.status} size="small" sx={{
                        bgcolor: res.status === "pending" ? "#fff3e0" : res.status === "confirmed" ? "#e8f5e9" : res.status === "cancelled" ? "#ffebee" : "#f3e5f5",
                        color: res.status === "pending" ? "#FF9800" : res.status === "confirmed" ? "#4CAF50" : res.status === "cancelled" ? "#f44336" : "#9C27B0",
                        fontWeight: 600,
                      }} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(res)}><EditIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination component="div" count={total} page={page} onPageChange={(e, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
          </TableContainer>
        </Container>
      </AdminBox>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Update Reservation Status</DialogTitle>
        <DialogContent>
          {selectedReservation && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Book:</strong> {selectedReservation.book?.title}<br />
                <strong>User:</strong> {selectedReservation.user?.name}
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={editStatus} label="Status" onChange={(e) => setEditStatus(e.target.value)}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveStatus} disabled={saving} sx={{ bgcolor: "#000", textTransform: "none" }}>{saving ? "Saving..." : "Update"}</Button>
        </DialogActions>
      </Dialog>

      {/* Admin update API for reservations */}
    </HomeLayout>
  );
}
