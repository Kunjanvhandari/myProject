"use client";
import { useState, useEffect, useRef } from "react";
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, Button, TextField, Divider, Chip, Tabs, Tab, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
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
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useRouter, useSearchParams } from "next/navigation";

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
  const { user, loading, isAuthenticated, logout, refreshUser, changePassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef(null);
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [borrowings, setBorrowings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [updateMessage, setUpdateMessage] = useState({ show: false, success: false, text: "" });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changingPassword, setChangingPassword] = useState(false);

  const demoBorrowings = [
    { _id: "b1", book: { title: "Atomic Habits", author: "James Clear" }, borrowDate: "2026-04-10", dueDate: "2026-04-24", status: "active" },
    { _id: "b2", book: { title: "The Alchemist", author: "Paulo Coelho" }, borrowDate: "2026-04-05", dueDate: "2026-04-19", status: "active" },
    { _id: "b3", book: { title: "Clean Code", author: "Robert C. Martin" }, borrowDate: "2026-03-20", dueDate: "2026-04-03", status: "returned" },
    { _id: "b4", book: { title: "Ikigai", author: "Hector Garcia" }, borrowDate: "2026-03-15", dueDate: "2026-03-29", status: "returned" },
    { _id: "b5", book: { title: "Deep Work", author: "Cal Newport" }, borrowDate: "2026-03-01", dueDate: "2026-03-15", status: "returned" },
  ];

  const demoReservations = [
    { _id: "r1", book: { title: "JavaScript: The Good Parts", author: "Douglas Crockford" }, reservedOn: "2026-04-15", totalPrice: 850, status: "pending" },
    { _id: "r2", book: { title: "Design Patterns", author: "Gang of Four" }, reservedOn: "2026-04-12", totalPrice: 1200, status: "confirmed" },
  ];

  const demoNotifications = [
    { title: "Book Due Soon", message: "Atomic Habits is due in 3 days. Return or renew to avoid late fees." },
    { title: "Reservation Ready", message: "Your reserved book 'Design Patterns' is ready for pickup." },
    { title: "Welcome!", message: "Welcome to LibriVista! Explore our collection of 50,000+ books." },
  ];

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam !== null) {
      setTabValue(parseInt(tabParam));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setProfileImagePreview(user.profileImage || "");
      fetchBorrowings();
      fetchReservations();
      setNotifications(user.notifications || demoNotifications);
      setIsLoadingData(false);
    }
  }, [user]);

  const fetchBorrowings = async () => {
    try {
      const res = await apiFetch("/borrowings");
      const data = await res.json();
      if (data.success && data.borrowings && data.borrowings.length > 0) {
        setBorrowings(data.borrowings);
      } else {
        setBorrowings(demoBorrowings);
      }
    } catch (error) {
      console.error("Failed to fetch borrowings:", error);
      setBorrowings(demoBorrowings);
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await apiFetch("/reservations");
      const data = await res.json();
      if (data.success && data.reservations && data.reservations.length > 0) {
        setReservations(data.reservations);
      } else {
        setReservations(demoReservations);
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
      setReservations(demoReservations);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await apiFetch("/v1/user/profile", {
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUpdateMessage({ show: true, success: false, text: "Please select an image file" });
      setTimeout(() => setUpdateMessage({ show: false, success: false, text: "" }), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUpdateMessage({ show: true, success: false, text: "Image size must be less than 5MB" });
      setTimeout(() => setUpdateMessage({ show: false, success: false, text: "" }), 3000);
      return;
    }

    setUploadingImage(true);

    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);

    const formDataUpload = new FormData();
    formDataUpload.append("profileImage", file);

    try {
      const response = await fetch("/api/user/profile/upload-image", {
        method: "POST",
        credentials: "include",
        body: formDataUpload,
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setUpdateMessage({ show: true, success: true, text: "Profile picture updated successfully!" });
        setProfileImagePreview(data.imageUrl);
        if (refreshUser) {
          await refreshUser();
        }
      } else {
        setUpdateMessage({ show: true, success: false, text: data.message || "Failed to upload image" });
        setProfileImagePreview(user?.profileImage || "");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUpdateMessage({ show: true, success: false, text: "Failed to upload image" });
      setProfileImagePreview(user?.profileImage || "");
    } finally {
      setUploadingImage(false);
    }

    setTimeout(() => setUpdateMessage({ show: false, success: false, text: "" }), 3000);
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setUpdateMessage({ show: true, success: false, text: "All fields are required" });
      setTimeout(() => setUpdateMessage({ show: false, success: false, text: "" }), 3000);
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setUpdateMessage({ show: true, success: false, text: "New password must be at least 6 characters" });
      setTimeout(() => setUpdateMessage({ show: false, success: false, text: "" }), 3000);
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setUpdateMessage({ show: true, success: false, text: "Passwords do not match" });
      setTimeout(() => setUpdateMessage({ show: false, success: false, text: "" }), 3000);
      return;
    }
    setChangingPassword(true);
    const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
    if (result.success) {
      setUpdateMessage({ show: true, success: true, text: "Password changed successfully!" });
      setPasswordDialogOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setUpdateMessage({ show: true, success: false, text: result.message || "Failed to change password" });
    }
    setChangingPassword(false);
    setTimeout(() => setUpdateMessage({ show: false, success: false, text: "" }), 3000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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

  const profileImageUrl = profileImagePreview ? `${profileImagePreview}` : "";

  return (
    <HomeLayout>
      <AccountBox>
        <Box className="heroSection">
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "#333333",
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    border: "4px solid rgba(255,255,255,0.3)",
                  }}
                  src={profileImageUrl || undefined}
                >
                  {!profileImageUrl && (user?.name?.charAt(0) || "U")}
                </Avatar>
                <Box
                  onClick={triggerFileInput}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: "#2D5016",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "2px solid #fff",
                    "&:hover": { bgcolor: "#1A3810" },
                  }}
                >
                  <PhotoCameraIcon sx={{ fontSize: 16, color: "#fff" }} />
                </Box>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </Box>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Box sx={{ position: "relative" }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: "#333333",
                            fontSize: "2rem",
                            fontWeight: 700,
                          }}
                          src={profileImageUrl || undefined}
                        >
                          {!profileImageUrl && (user?.name?.charAt(0) || "U")}
                        </Avatar>
                        <Box
                          onClick={triggerFileInput}
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: "#2D5016",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            border: "2px solid #fff",
                            "&:hover": { bgcolor: "#1A3810" },
                          }}
                        >
                          {uploadingImage ? (
                            <CircularProgress size={14} sx={{ color: "#fff" }} />
                          ) : (
                            <PhotoCameraIcon sx={{ fontSize: 14, color: "#fff" }} />
                          )}
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {user?.name}
                        </Typography>
                        <Button
                          size="small"
                          onClick={triggerFileInput}
                          disabled={uploadingImage}
                          sx={{ textTransform: "none", p: 0, minWidth: "auto", color: "#2D5016" }}
                        >
                          {uploadingImage ? "Uploading..." : "Change Photo"}
                        </Button>
                      </Box>
                    </Box>
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
                    <Button fullWidth variant="contained" sx={{ mb: 1, borderRadius: "8px", bgcolor: "#333333", textTransform: "none" }} onClick={() => router.push("/account?tab=3")}>
                      Renew Membership
                    </Button>
                    <Button fullWidth variant="outlined" sx={{ mb: 1, borderRadius: "8px", textTransform: "none" }} onClick={() => router.push("/account?tab=0")}>
                      Download Receipts
                    </Button>
                    <Button fullWidth variant="outlined" sx={{ mb: 1, borderRadius: "8px", textTransform: "none" }} onClick={() => router.push("/books")}>
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
                      <Tab label="Fines" />
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
                          Notifications
                        </Typography>
                        {notifications.length === 0 ? (
                          <Typography sx={{ color: "#888", textAlign: "center", py: 4 }}>No new notifications</Typography>
                        ) : (
                          notifications.map((notif, index) => (
                            <Box key={index}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
                                <NotificationsIcon sx={{ color: "#333333" }} />
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{notif.title || "Notification"}</Typography>
                                  <Typography variant="caption" sx={{ color: "#888" }}>{notif.message || "No message"}</Typography>
                                </Box>
                              </Box>
                              {index < notifications.length - 1 && <Divider />}
                            </Box>
                          ))
                        )}
                      </Box>
                    )}

                    {tabValue === 3 && (
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
                              <Button size="small" sx={{ textTransform: "none" }} onClick={() => setPasswordDialogOpen(true)}>Update</Button>
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

                    {tabValue === 4 && (
                      <Box>
                        <Typography variant="h6" className="sectionTitle" sx={{ mb: 3 }}>
                          My Fines & Penalties
                        </Typography>
                        <FinesList />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
        {/* Password Change Dialog */}
        <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>Change Password</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setPasswordDialogOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handlePasswordChange}
              disabled={changingPassword}
              sx={{ bgcolor: "#333333", textTransform: "none" }}
            >
              {changingPassword ? "Changing..." : "Change Password"}
            </Button>
          </DialogActions>
        </Dialog>
      </AccountBox>
    </HomeLayout>
  );
}

function FinesList() {
  const [fines, setFines] = useState([]);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const res = await fetch("/api/fines/my");
      const data = await res.json();
      if (data.success) {
        setFines(data.fines);
        setTotalUnpaid(data.totalUnpaid || 0);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handlePayFine = async (fineId) => {
    try {
      const res = await fetch(`/api/fines/${fineId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "pay" }),
      });
      const data = await res.json();
      if (data.success) fetchFines();
    } catch (e) { console.error(e); }
  };

  if (loading) return <Box sx={{ textAlign: "center", py: 4 }}><CircularProgress /></Box>;

  return (
    <Box>
      {totalUnpaid > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have <strong>Rs. {totalUnpaid}</strong> in unpaid fines. Please pay to avoid service restrictions.
        </Alert>
      )}

      {fines.length === 0 ? (
        <Typography sx={{ color: "#888", textAlign: "center", py: 4 }}>No fines or penalties</Typography>
      ) : (
        fines.map((fine, index) => (
          <Box key={fine._id || index}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2, flexWrap: "wrap", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <MonetizationOnIcon sx={{ color: fine.status === "unpaid" ? "#f44336" : fine.status === "paid" ? "#4CAF50" : "#FF9800" }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Rs. {fine.amount} - {fine.book?.title || "Unknown Book"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#888" }}>
                    {fine.daysLate} day(s) late &middot; Rs. {fine.ratePerDay}/day
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Chip
                  label={fine.status}
                  size="small"
                  sx={{
                    bgcolor: fine.status === "unpaid" ? "#ffebee" : fine.status === "paid" ? "#e8f5e9" : "#fff3e0",
                    color: fine.status === "unpaid" ? "#f44336" : fine.status === "paid" ? "#4CAF50" : "#FF9800",
                    fontWeight: 600,
                  }}
                />
                {fine.status === "unpaid" && (
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => handlePayFine(fine._id)}
                    sx={{ textTransform: "none", borderRadius: "8px" }}
                  >
                    Pay Now
                  </Button>
                )}
              </Box>
            </Box>
            {index < fines.length - 1 && <Divider />}
          </Box>
        ))
      )}
    </Box>
  );
}
