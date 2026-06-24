"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Card, CardContent, Button, Chip, CircularProgress, Alert, Grid, Divider } from "@mui/material";
import HomeLayout from "../layouts/HomeLayout/layout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BookIcon from "@mui/icons-material/Book";
import CancelIcon from "@mui/icons-material/Cancel";

export default function MyReservations() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchReservations();
  }, [isAuthenticated]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/v1/reservations");
      const data = await res.json();
      if (data.success) {
        setReservations(data.reservations || []);
      } else {
        setError(data.message || "Failed to fetch reservations");
      }
    } catch (error) {
      setError("Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;
    
    try {
      const res = await apiFetch(`/v1/reservations/${reservationId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setReservations(reservations.filter(r => r._id !== reservationId));
      }
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "success";
      case "pending": return "warning";
      case "cancelled": return "error";
      case "expired": return "default";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <HomeLayout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8, minHeight: "60vh", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <Box sx={{ py: 6, minHeight: "calc(100vh - 300px)" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#173F5F", mb: 4 }}>
            My Reservations
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          )}

          {reservations.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <BookIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#666", mb: 2 }}>
                No reservations yet
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push("/books")}
                sx={{ bgcolor: "#ED553B", borderRadius: "8px", px: 4 }}
              >
                Browse Books
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {reservations.map((reservation) => (
                <Grid item xs={12} md={6} key={reservation._id}>
                  <Card sx={{ borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                    <CardContent>
                      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <Box
                          component="img"
                          src={reservation.book?.coverImage?.replace('M.jpg', 'L.jpg') || "/images/footer/book22.png"}
                          alt={reservation.book?.title}
                          sx={{ width: 80, height: 100, objectFit: "contain", borderRadius: "8px" }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: "#173F5F", mb: 0.5 }}>
                            {reservation.book?.title || "Book not available"}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                            by {reservation.book?.author}
                          </Typography>
                          <Chip 
                            label={reservation.status} 
                            color={getStatusColor(reservation.status)}
                            size="small"
                            sx={{ textTransform: "capitalize" }}
                          />
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="caption" sx={{ color: "#888" }}>
                          Reserved On
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {new Date(reservation.reservedOn).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="caption" sx={{ color: "#888" }}>
                          Expires On
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {new Date(reservation.reserveExpiry).toLocaleDateString()}
                        </Typography>
                      </Box>

                      {reservation.totalPrice > 0 && (
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                          <Typography variant="caption" sx={{ color: "#888" }}>
                            Total Price
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#ED553B" }}>
                            Rs. {reservation.totalPrice}
                          </Typography>
                        </Box>
                      )}

                      {reservation.status === "pending" && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => handleCancel(reservation._id)}
                          sx={{ borderRadius: "8px", textTransform: "none" }}
                        >
                          Cancel Reservation
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </HomeLayout>
  );
}
