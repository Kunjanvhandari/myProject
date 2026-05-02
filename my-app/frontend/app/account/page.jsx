"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, Button, TextField, Divider, Chip, Tabs, Tab, CircularProgress, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../layouts/HomeLayout/layout";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/src/lib/api";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BookIcon from "@mui/icons-material/Book";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import SecurityIcon from "@mui/icons-material/Security";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

const AccountBox = styled(Box)(({ theme }) => ({
  "& .accountBox": {
    padding: "40px 0",
    minHeight: "calc(100vh - 300px)",
  },
  "& .heroSection": {
    background: "#000000",
    color: "#fff",
    padding: "50px 0",
    borderRadius: "0 0 50px 50px",
    marginBottom: "40px",
  },
  "& .statCard": {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
    padding: "24px 16px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-3px)",
    },
  },
  "& .sectionTitle": {
    color: "#000000",
    fontWeight: 700,
    marginBottom: "20px",
  },
}));

export default function Account() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [borrowings, setBorrowings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [updateMessage, setUpdateMessage] = useState({ show: false, success: false, text: "" });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      fetchBorrowings();
      fetchReservations();
      setNotifications(user.notifications || []);
      setIsLoadingData(false);
    }
  }, [user]);

  const fetchBorrowings = async () => {
    try {
      const res = await apiFetch("/api/borrowings");
      const data = await res.json();
      if (data.success) {
        setBorrowings(data.borrowings);
      }
    } catch (error) {
      console.error("Failed to fetch borrowings:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await apiFetch("/api/reservations");
      const data = await res.json();
      if (data.success) {
        setReservations(data.reservations);
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await apiFetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setUpdateMessage({ show: true, success: true, text: "Profile updated successfully!" });
        setEditMode(false);
      } else {
        setUpdateMessage({ show: true, success: false, text: data.message || "Failed to update profile" });
      }
    } catch (error) {
      setUpdateMessage({ show: true, success: false, text: "Failed to update profile" });
    }

    setTimeout(() => setUpdateMessage({ show: false, success: false, text: "" }), 3000);
  };

  if (loading || !isAuthenticated) {
    return (
      <HomeLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <CircularProgress />
        </Box>
      </HomeLayout>
    );
  }

  const membershipExpiry = user.membershipExpiry ? new Date(user.membershipExpiry).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "N/A";

  return (
    <HomeLayout>
      <AccountBox>
        <Box className="heroSection">
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "#333333",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  border: "4px solid rgba(255,255,255,0.3)",
                }}
              >
                {user?.name?.charAt(0) || "U"}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: "white" }}>
                  {user?.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Chip
                    label={user?.membershipType || "Free"}
                    sx={{ bgcolor: "#333333", color: "#fff", fontWeight: 600 }}
                    size="small"
                  />
                  <Typography variant="body2" sx={{ opacity: 0.8, color: "white" }}>
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.7, color: "white" }}>
                  ID: {user?.membershipId || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        <Box className="accountBox">
          <Container maxWidth="lg">
            {updateMessage.show && (
              <Alert severity={updateMessage.success ? "success" : "error"} sx={{ mb: 3 }}>
                {updateMessage.text}
              </Alert>
            )}

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" className="sectionTitle">
                      Profile Information
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <PersonIcon sx={{ color: "#333333" }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#888" }}>Full Name</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <EmailIcon sx={{ color: "#333333" }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#888" }}>Email</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.email}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <PhoneIcon sx={{ color: "#333333" }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#888" }}>Phone</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.phone || "Not provided"}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <LocationOnIcon sx={{ color: "#333333" }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#888" }}>Address</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.address || "Not provided"}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <CalendarTodayIcon sx={{ color: "#333333" }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#888" }}>Membership Expires</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{membershipExpiry}</Typography>
                      </Box>
                    </Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setEditMode(!editMode)}
                      sx={{ borderRadius: "8px", textTransform: "none", mb: 1 }}
                    >
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" className="sectionTitle">
                      Quick Actions
                    </Typography>
                    <Button fullWidth variant="contained" sx={{ mb: 1, borderRadius: "8px", bgcolor: "#333333", textTransform: "none" }}>
                      Renew Membership
                    </Button>
                    <Button fullWidth variant="outlined" sx={{ mb: 1, borderRadius: "8px", textTransform: "none" }}>
                      Download Receipts
                    </Button>
                    <Button fullWidth variant="outlined" sx={{ mb: 1, borderRadius: "8px", textTransform: "none" }}>
                      Request Book
                    </Button>
                    <Button fullWidth variant="outlined" sx={{ borderRadius: "8px", textTransform: "none", borderColor: "#f44336", color: "#f44336" }} onClick={logout}>
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={6} sm={3}>
                    <Card className="statCard">
                      <BookIcon sx={{ fontSize: 32, color: "#1a1a1a", mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a1a1a" }}>
                        {user?.currentlyBorrowed || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>
                        Active Books
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card className="statCard">
                      <BookIcon sx={{ fontSize: 32, color: "#333333", mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#333333" }}>
                        {user?.booksBorrowed || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>
                        Total Borrowed
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card className="statCard">
                      <BookIcon sx={{ fontSize: 32, color: "#4CAF50", mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#4CAF50" }}>
                        {user?.booksReturned || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>
                        Returned
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card className="statCard">
                      <BookIcon sx={{ fontSize: 32, color: "#333333", mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#333333" }}>
                        {user?.reservations || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#888" }}>
                        Reservations
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ px: 2 }}>
                      <Tab label="Borrowing History" />
                      <Tab label="Reservations" />
                      <Tab label="Notifications" />
                      <Tab label="Settings" />
                    </Tabs>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    {tabValue === 0 && (
                      <Box>
                        <Typography variant="h6" className="sectionTitle" sx={{ mb: 3 }}>
                          Current & Recent Borrowings
                        </Typography>
                        {isLoadingData ? (
                          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress />
                          </Box>
                        ) : borrowings.length === 0 ? (
                          <Typography sx={{ color: "#888", textAlign: "center", py: 4 }}>No borrowing history found</Typography>
                        ) : (
                          borrowings.map((book, index) => (
                            <Box key={book._id || index}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2, flexWrap: "wrap", gap: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                  <Avatar sx={{ bgcolor: book.status === "active" ? "#333333" : "#4CAF50", width: 40, height: 40 }}>
                                    <BookIcon sx={{ fontSize: 20 }} />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                      {book.book?.title || "Unknown Book"}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#888" }}>
                                      {book.book?.author || ""} &middot; Borrowed: {book.borrowDate ? new Date(book.borrowDate).toLocaleDateString() : "N/A"}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                  <Typography variant="caption" sx={{ color: "#888" }}>
                                    Due: {new Date(book.dueDate).toLocaleDateString()}
                                  </Typography>
                                  <Chip
                                    label={book.status ? book.status.charAt(0).toUpperCase() + book.status.slice(1) : "Unknown"}
                                    size="small"
                                    sx={{
                                      bgcolor: book.status === "active" ? "#f5f5f5" : "#e8f5e9",
                                      color: book.status === "active" ? "#333333" : "#4CAF50",
                                      fontWeight: 600,
                                    }}
                                  />
                                </Box>
                              </Box>
                              {index < borrowings.length - 1 && <Divider />}
                            </Box>
                          ))
                        )}
                      </Box>
                    )}

                    {tabValue === 1 && (
                      <Box>
                        <Typography variant="h6" className="sectionTitle" sx={{ mb: 3 }}>
                          Your Reservations
                        </Typography>
                        {isLoadingData ? (
                          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress />
                          </Box>
                        ) : reservations.length === 0 ? (
                          <Typography sx={{ color: "#888", textAlign: "center", py: 4 }}>No reservations found</Typography>
                        ) : (
                          reservations.map((res, index) => (
                            <Box key={res._id || index}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2, flexWrap: "wrap", gap: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                  <Avatar sx={{ bgcolor: res.status === "pending" ? "#333333" : res.status === "confirmed" ? "#4CAF50" : "#f44336", width: 40, height: 40 }}>
                                    <BookIcon sx={{ fontSize: 20 }} />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                      {res.book?.title || "Unknown Book"}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#888" }}>
                                      {res.book?.author || ""} &middot; Reserved: {res.reservedOn ? new Date(res.reservedOn).toLocaleDateString() : "N/A"}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                  <Typography variant="caption" sx={{ color: "#888" }}>
                                    Rs. {res.totalPrice}
                                  </Typography>
                                  <Chip
                                    label={res.status ? res.status.charAt(0).toUpperCase() + res.status.slice(1) : "Unknown"}
                                    size="small"
                                    sx={{
                                      bgcolor: res.status === "pending" ? "#fff3e0" : res.status === "confirmed" ? "#e8f5e9" : "#ffebee",
                                      color: res.status === "pending" ? "#333333" : res.status === "confirmed" ? "#4CAF50" : "#f44336",
                                      fontWeight: 600,
                                    }}
                                  />
                                </Box>
                              </Box>
                              {index < reservations.length - 1 && <Divider />}
                            </Box>
                          ))
                        )}
                      </Box>
                    )}

                    {tabValue === 2 && (
                      <Box>
                        <Typography variant="h6" className="sectionTitle" sx={{ mb: 3 }}>
                          Account Settings
                        </Typography>
                        {editMode ? (
                          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Email" value={user?.email || ""} disabled />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                              </Grid>
                            </Grid>
                            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                              <Button variant="contained" sx={{ bgcolor: "#333333", borderRadius: "8px", textTransform: "none" }} onClick={handleUpdateProfile}>
                                Save Changes
                              </Button>
                              <Button variant="outlined" sx={{ borderRadius: "8px", textTransform: "none" }} onClick={() => setEditMode(false)}>
                                Cancel
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <SecurityIcon sx={{ color: "#333333" }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Change Password</Typography>
                              </Box>
                              <Button size="small" sx={{ textTransform: "none" }}>Update</Button>
                            </Box>
                            <Divider />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <NotificationsIcon sx={{ color: "#333333" }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Email Notifications</Typography>
                              </Box>
                              <Chip label="Enabled" size="small" sx={{ bgcolor: "#e8f5e9", color: "#4CAF50", fontWeight: 600 }} />
                            </Box>
                            <Divider />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <DeleteIcon sx={{ color: "#f44336" }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#f44336" }}>Delete Account</Typography>
                              </Box>
                              <Button size="small" sx={{ textTransform: "none", color: "#f44336" }}>Request</Button>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </AccountBox>
    </HomeLayout>
  );
}
