"use client";
import { useState, useEffect } from "react";
import {
  Box, Typography, Container, Card, CardContent, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert,
  TablePagination, Avatar, Tabs, Tab, Divider, Grid, Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../../../layouts/HomeLayout/layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import BookIcon from "@mui/icons-material/Book";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BadgeIcon from "@mui/icons-material/Badge";

const AdminBox = styled(Box)(({ theme }) => ({
  "& .pageHeader": { background: "#000", color: "#fff", padding: "30px 0", borderRadius: "0 0 50px 50px", marginBottom: "30px" },
}));

export default function ManageUsers() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", username: "", email: "", phone: "", address: "", studentId: "", role: "user", membershipType: "Free", isActive: true });
  const [message, setMessage] = useState({ show: false, success: false, text: "" });
  const [saving, setSaving] = useState(false);

  // Detail view
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [detailTab, setDetailTab] = useState(0);
  const [detailBorrowings, setDetailBorrowings] = useState([]);
  const [detailReservations, setDetailReservations] = useState([]);
  const [detailFines, setDetailFines] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) router.push("/");
  }, [loading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, page, rowsPerPage, statusFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/users?${params}`);
      const data = await res.json();
      if (data.success) { setUsers(data.users); setTotal(data.pagination.total); }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleOpenEdit = (u) => {
    setEditUser(u);
    setFormData({
      name: u.name || "", username: u.username || "", email: u.email || "",
      phone: u.phone || "", address: u.address || "", studentId: u.studentId || "",
      role: u.role || "user", membershipType: u.membershipType || "Free", isActive: u.isActive !== false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      setMessage({ show: true, success: false, text: "Name and email are required" });
      setTimeout(() => setMessage({ show: false }), 3000);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${editUser._id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ show: true, success: true, text: "User updated successfully!" });
        setDialogOpen(false);
        fetchUsers();
      } else {
        setMessage({ show: true, success: false, text: data.message || "Failed to update user" });
      }
    } catch (e) { setMessage({ show: true, success: false, text: "Failed to update user" }); }
    setSaving(false);
    setTimeout(() => setMessage({ show: false }), 3000);
  };

  const handleToggleActive = async (userId, currentActive) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ isActive: !currentActive }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ show: true, success: true, text: currentActive ? "User suspended" : "User activated" });
        fetchUsers();
      }
    } catch (e) { setMessage({ show: true, success: false, text: "Failed to update user" }); }
    setTimeout(() => setMessage({ show: false }), 3000);
  };

  const handleViewDetails = async (u) => {
    setDetailUser(u);
    setDetailOpen(true);
    setDetailTab(0);
    setDetailLoading(true);
    try {
      const [borrRes, resvRes, fineRes] = await Promise.all([
        fetch(`/api/users/${u._id}/borrowings`, { credentials: "include" }),
        fetch(`/api/users/${u._id}/reservations`, { credentials: "include" }),
        fetch(`/api/users/${u._id}/fines`, { credentials: "include" }),
      ]);
      const borrData = await borrRes.json();
      const resvData = await resvRes.json();
      const fineData = await fineRes.json();
      if (borrData.success) setDetailBorrowings(borrData.borrowings);
      if (resvData.success) setDetailReservations(resvData.reservations);
      if (fineData.success) setDetailFines(fineData.fines);
    } catch (e) { console.error(e); }
    setDetailLoading(false);
  };

  if (loading || !isAuthenticated || !isAdmin) {
    return <HomeLayout><Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><CircularProgress /></Box></HomeLayout>;
  }

  return (
    <HomeLayout>
      <AdminBox>
        <Box className="pageHeader">
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Manage Users</Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>View, search, edit, and manage all library members</Typography>
          </Container>
        </Box>
        <Container maxWidth="lg">
          {message.show && <Alert severity={message.success ? "success" : "error"} sx={{ mb: 3 }}>{message.text}</Alert>}

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1, maxWidth: 500 }}>
              <TextField size="small" fullWidth placeholder="Search by name, email, username, student ID, phone..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setPage(0); fetchUsers(); } }}
              />
              <Button variant="contained" sx={{ bgcolor: "#000", borderRadius: "8px", minWidth: 40 }} onClick={() => { setPage(0); fetchUsers(); }}><SearchIcon /></Button>
            </Box>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} displayEmpty>
                <MenuItem value="">All Users</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Username / ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email / Phone</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Membership</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Stats</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>
                ) : users.length === 0 ? (
                  <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: "#888" }}>No users found</TableCell></TableRow>
                ) : users.map((u) => (
                  <TableRow key={u._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: "#333", fontSize: "0.9rem" }}>
                          {u.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>{u.name}</Typography>
                          <Typography variant="caption" sx={{ color: "#888" }}>{u.membershipId || "N/A"}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: "13px" }}>{u.username || "—"}</Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>{u.studentId || ""}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: "13px" }}>{u.email}</Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>{u.phone || ""}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={u.membershipType} size="small" sx={{ bgcolor: u.membershipType === "Premium" ? "#fff3e0" : u.membershipType === "Basic" ? "#e3f2fd" : "#f0f0f0", fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={u.role} size="small" color={u.role === "admin" ? "primary" : "default"} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: "13px" }}>{u.currentlyBorrowed || 0} active</Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>{u.booksBorrowed || 0} total, {u.reservations || 0} reservations</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={u.isActive ? "Active" : "Inactive"} size="small"
                        sx={{ bgcolor: u.isActive ? "#e8f5e9" : "#ffebee", color: u.isActive ? "#4CAF50" : "#f44336", fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton onClick={() => handleViewDetails(u)}><VisibilityIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton onClick={() => handleOpenEdit(u)}><EditIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title={u.isActive ? "Suspend User" : "Activate User"}>
                        <IconButton onClick={() => handleToggleActive(u._id, u.isActive)} color={u.isActive ? "error" : "success"}>
                          {u.isActive ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination component="div" count={total} page={page}
              onPageChange={(e, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />
          </TableContainer>
        </Container>
      </AdminBox>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Student ID" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select value={formData.role} label="Role" onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Membership Type</InputLabel>
              <Select value={formData.membershipType} label="Membership Type" onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}>
                <MenuItem value="Free">Free</MenuItem>
                <MenuItem value="Basic">Basic</MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ bgcolor: "#000", textTransform: "none" }}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#333", width: 40, height: 40 }}>{detailUser?.name?.charAt(0)}</Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{detailUser?.name}</Typography>
            <Typography variant="caption" sx={{ color: "#888" }}>{detailUser?.email} — {detailUser?.membershipId}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Tabs value={detailTab} onChange={(e, v) => setDetailTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}>
            <Tab label={`Borrowings (${detailBorrowings.length})`} />
            <Tab label={`Reservations (${detailReservations.length})`} />
            <Tab label={`Fines (${detailFines.length})`} />
          </Tabs>
          {detailLoading ? (
            <Box sx={{ textAlign: "center", py: 4 }}><CircularProgress /></Box>
          ) : (
            <>
              {detailTab === 0 && (
                <Box>
                  {detailBorrowings.length === 0 ? (
                    <Typography sx={{ color: "#888", textAlign: "center", py: 4 }}>No borrowing history</Typography>
                  ) : (
                    detailBorrowings.map((b, i) => (
                      <Box key={b._id}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, flexWrap: "wrap", gap: 1 }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{b.book?.title || "Unknown"}</Typography>
                            <Typography variant="caption" sx={{ color: "#888" }}>Borrowed: {new Date(b.borrowDate).toLocaleDateString()} | Due: {new Date(b.dueDate).toLocaleDateString()}</Typography>
                          </Box>
                          <Chip label={b.status} size="small"
                            sx={{ bgcolor: b.status === "active" ? "#e3f2fd" : b.status === "returned" ? "#e8f5e9" : "#ffebee", fontWeight: 600 }}
                          />
                        </Box>
                        {i < detailBorrowings.length - 1 && <Divider />}
                      </Box>
                    ))
                  )}
                </Box>
              )}
              {detailTab === 1 && (
                <Box>
                  {detailReservations.length === 0 ? (
                    <Typography sx={{ color: "#888", textAlign: "center", py: 4 }}>No reservations</Typography>
                  ) : (
                    detailReservations.map((r, i) => (
                      <Box key={r._id}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, flexWrap: "wrap", gap: 1 }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.book?.title || "Unknown"}</Typography>
                            <Typography variant="caption" sx={{ color: "#888" }}>Reserved: {new Date(r.reservedOn).toLocaleDateString()} | Price: Rs. {r.totalPrice}</Typography>
                          </Box>
                          <Chip label={r.status} size="small"
                            sx={{ bgcolor: r.status === "pending" ? "#fff3e0" : r.status === "confirmed" ? "#e8f5e9" : "#ffebee", fontWeight: 600 }}
                          />
                        </Box>
                        {i < detailReservations.length - 1 && <Divider />}
                      </Box>
                    ))
                  )}
                </Box>
              )}
              {detailTab === 2 && (
                <Box>
                  {detailFines.length === 0 ? (
                    <Typography sx={{ color: "#888", textAlign: "center", py: 4 }}>No fines</Typography>
                  ) : (
                    detailFines.map((f, i) => (
                      <Box key={f._id}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.5, flexWrap: "wrap", gap: 1 }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Rs. {f.amount} — {f.book?.title || "Unknown"}</Typography>
                            <Typography variant="caption" sx={{ color: "#888" }}>{f.daysLate} days late at Rs. {f.ratePerDay}/day</Typography>
                          </Box>
                          <Chip label={f.status} size="small"
                            sx={{ bgcolor: f.status === "unpaid" ? "#ffebee" : f.status === "paid" ? "#e8f5e9" : "#fff3e0", fontWeight: 600 }}
                          />
                        </Box>
                        {i < detailFines.length - 1 && <Divider />}
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)} sx={{ textTransform: "none" }}>Close</Button>
        </DialogActions>
      </Dialog>
    </HomeLayout>
  );
}
