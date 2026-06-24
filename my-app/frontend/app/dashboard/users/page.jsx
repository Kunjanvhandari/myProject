"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Card, CardContent, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, TablePagination, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../../layouts/HomeLayout/layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import SearchIcon from "@mui/icons-material/Search";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", role: "user", membershipType: "Free", isActive: true });
  const [message, setMessage] = useState({ show: false, success: false, text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) router.push("/");
  }, [loading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, page, rowsPerPage]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ page: page + 1, limit: rowsPerPage });
      if (search) params.set("search", search);
      const res = await fetch(`/api/users?${params}`);
      const data = await res.json();
      if (data.success) { setUsers(data.users); setTotal(data.pagination.total); }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleOpenEdit = (u) => {
    setEditUser(u);
    setFormData({ name: u.name || "", email: u.email || "", phone: u.phone || "", address: u.address || "", role: u.role || "user", membershipType: u.membershipType || "Free", isActive: u.isActive });
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
      const res = await fetch(`/api/users/${editUser._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(formData) });
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
      const res = await fetch(`/api/users/${userId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ isActive: !currentActive }) });
      const data = await res.json();
      if (data.success) {
        setMessage({ show: true, success: true, text: currentActive ? "User deactivated" : "User activated" });
        fetchUsers();
      }
    } catch (e) { setMessage({ show: true, success: false, text: "Failed to update user" }); }
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
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Manage Users</Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>View and manage all library members</Typography>
          </Container>
        </Box>
        <Container maxWidth="lg">
          {message.show && <Alert severity={message.success ? "success" : "error"} sx={{ mb: 3 }}>{message.text}</Alert>}

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1, maxWidth: 400 }}>
              <TextField size="small" fullWidth placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchUsers()} />
              <Button variant="contained" sx={{ bgcolor: "#000", borderRadius: "8px", minWidth: 40 }} onClick={fetchUsers}><SearchIcon /></Button>
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Membership</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Books</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>
                ) : users.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: "#888" }}>No users found</TableCell></TableRow>
                ) : users.map((u) => (
                  <TableRow key={u._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: "#333", fontSize: "0.9rem" }}>{u.name?.charAt(0)}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{u.name}</Typography>
                          <Typography variant="caption" sx={{ color: "#888" }}>{u.membershipId || "N/A"}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><Chip label={u.membershipType} size="small" sx={{ bgcolor: u.membershipType === "Premium" ? "#fff3e0" : "#f0f0f0", fontWeight: 600 }} /></TableCell>
                    <TableCell><Chip label={u.role} size="small" color={u.role === "admin" ? "primary" : "default"} /></TableCell>
                    <TableCell>
                      <Typography variant="body2">{u.currentlyBorrowed} active</Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>{u.booksBorrowed} total</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={u.isActive ? "Active" : "Inactive"} size="small" sx={{ bgcolor: u.isActive ? "#e8f5e9" : "#ffebee", color: u.isActive ? "#4CAF50" : "#f44336", fontWeight: 600 }} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenEdit(u)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton onClick={() => handleToggleActive(u._id, u.isActive)} color={u.isActive ? "error" : "success"}><BlockIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination component="div" count={total} page={page} onPageChange={(e, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
          </TableContainer>
        </Container>
      </AdminBox>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField fullWidth label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField fullWidth label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <TextField fullWidth label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
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
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ bgcolor: "#000", textTransform: "none" }}>{saving ? "Saving..." : "Save Changes"}</Button>
        </DialogActions>
      </Dialog>
    </HomeLayout>
  );
}
