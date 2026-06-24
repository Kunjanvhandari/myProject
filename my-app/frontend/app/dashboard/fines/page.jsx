"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, TablePagination, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../../layouts/HomeLayout/layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";

const AdminBox = styled(Box)(({ theme }) => ({
  "& .pageHeader": { background: "#000", color: "#fff", padding: "30px 0", borderRadius: "0 0 50px 50px", marginBottom: "30px" },
  "& .statCard": { borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: "24px", textAlign: "center" },
}));

export default function ManageFines() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [fines, setFines] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState({ show: false, success: false, text: "" });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) router.push("/");
  }, [loading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) fetchFines();
  }, [isAdmin, page, rowsPerPage, statusFilter]);

  const fetchFines = async () => {
    try {
      const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/fines?${params}`);
      const data = await res.json();
      if (data.success) { setFines(data.fines); setTotal(data.pagination.total); setStats(data.stats); }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleAction = async (fineId, action) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/fines/${fineId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ action }) });
      const data = await res.json();
      if (data.success) {
        setMessage({ show: true, success: true, text: `Fine ${action}ed successfully!` });
        fetchFines();
      } else { setMessage({ show: true, success: false, text: data.message }); }
    } catch (e) { setMessage({ show: true, success: false, text: "Failed to update fine" }); }
    setActionLoading(false);
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
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Manage Fines</Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>Track late fees and penalties</Typography>
          </Container>
        </Box>
        <Container maxWidth="lg">
          {message.show && <Alert severity={message.success ? "success" : "error"} sx={{ mb: 3 }}>{message.text}</Alert>}

          {stats && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Card className="statCard"><MonetizationOnIcon sx={{ fontSize: 32, color: "#1a1a1a", mb: 1 }} /><Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.totalFines}</Typography><Typography variant="caption">Total Fines</Typography></Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card className="statCard"><MonetizationOnIcon sx={{ fontSize: 32, color: "#f44336", mb: 1 }} /><Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.unpaidFines}</Typography><Typography variant="caption">Unpaid</Typography></Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card className="statCard"><CheckCircleIcon sx={{ fontSize: 32, color: "#4CAF50", mb: 1 }} /><Typography variant="h4" sx={{ fontWeight: 800 }}>{stats.paidFines}</Typography><Typography variant="caption">Paid</Typography></Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card className="statCard"><MonetizationOnIcon sx={{ fontSize: 32, color: "#FF9800", mb: 1 }} /><Typography variant="h4" sx={{ fontWeight: 800 }}>Rs. {stats.totalAmount?.toLocaleString() || 0}</Typography><Typography variant="caption">Total Amount</Typography></Card>
              </Grid>
            </Grid>
          )}

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            {["", "unpaid", "paid", "waived"].map((s) => (
              <Chip key={s} label={s || "All"} onClick={() => { setStatusFilter(s); setPage(0); }} variant={statusFilter === s ? "filled" : "outlined"} sx={{ fontWeight: 600, cursor: "pointer", bgcolor: statusFilter === s ? "#000" : "transparent", color: statusFilter === s ? "#fff" : "#000" }} />
            ))}
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Book</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Days Late</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>
                ) : fines.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: "#888" }}>No fines found</TableCell></TableRow>
                ) : fines.map((fine) => (
                  <TableRow key={fine._id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>{fine.user?.name || "Unknown"}</Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>{fine.user?.email || ""}</Typography>
                    </TableCell>
                    <TableCell>{fine.book?.title || "Unknown"}</TableCell>
                    <TableCell><Typography sx={{ fontWeight: 700 }}>Rs. {fine.amount}</Typography></TableCell>
                    <TableCell>{fine.daysLate} day(s)</TableCell>
                    <TableCell>
                      <Chip label={fine.status} size="small" sx={{
                        bgcolor: fine.status === "unpaid" ? "#ffebee" : fine.status === "paid" ? "#e8f5e9" : "#fff3e0",
                        color: fine.status === "unpaid" ? "#f44336" : fine.status === "paid" ? "#4CAF50" : "#FF9800",
                        fontWeight: 600,
                      }} />
                    </TableCell>
                    <TableCell>{fine.createdAt ? new Date(fine.createdAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell align="right">
                      {fine.status === "unpaid" && (
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                          <Button size="small" variant="contained" color="success" onClick={() => handleAction(fine._id, "pay")} disabled={actionLoading} sx={{ textTransform: "none", borderRadius: "8px" }}>Mark Paid</Button>
                          <Button size="small" variant="outlined" color="warning" onClick={() => handleAction(fine._id, "waive")} disabled={actionLoading} sx={{ textTransform: "none", borderRadius: "8px" }}>Waive</Button>
                        </Box>
                      )}
                      {fine.status !== "unpaid" && <Chip label={fine.status === "paid" ? `Paid on ${fine.paidDate ? new Date(fine.paidDate).toLocaleDateString() : ""}` : "Waived"} size="small" variant="outlined" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination component="div" count={total} page={page} onPageChange={(e, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
          </TableContainer>
        </Container>
      </AdminBox>
    </HomeLayout>
  );
}
