"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Container, Grid, Card, CardContent, Button, TextField, Divider, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../layouts/HomeLayout/layout";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/src/lib/api";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";

const CartBox = styled(Box)(({ theme }) => ({
  "& .cartBox": {
    padding: "40px 0",
    minHeight: "calc(100vh - 300px)",
  },
  "& .heroSection": {
    background: "#000000",
    color: "#fff",
    padding: "50px 0",
    textAlign: "center",
    borderRadius: "0 0 50px 50px",
    marginBottom: "40px",
  },
  "& .summaryCard": {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    position: "sticky",
    top: "100px",
  },
}));

export default function Cart() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Pickup");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
    }
  }, [isAuthenticated]);

  const fetchReservations = async () => {
    try {
      const res = await apiFetch("/api/reservations?status=pending");
      const data = await res.json();
      if (data.success) {
        setReservations(data.reservations);
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = reservations.reduce((acc, res) => acc + (res.totalPrice || 0), 0);
  const deliveryFee = 100;
  const discount = 150;
  const total = subtotal + deliveryFee - discount;

  const handleCheckout = async () => {
    try {
      for (const res of reservations) {
        await apiFetch(`/api/reservations/${res._id}`, {
          method: "PUT",
          body: JSON.stringify({ status: "confirmed", paymentMethod }),
        });
      }
      setOpenCheckout(false);
      setOpenSuccess(true);
      fetchReservations();
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      await apiFetch(`/api/reservations/${id}`, { method: "DELETE" });
      fetchReservations();
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
    }
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

  return (
    <HomeLayout>
      <CartBox>
        <Box className="heroSection">
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
              <ShoppingCartIcon sx={{ fontSize: 32 }} />
              <Typography variant="h2" sx={{ fontWeight: 800, color: "white" }}>
                Your Reserved Books
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: "600px", margin: "0 auto", opacity: 0.9, color: "white" }}>
              {reservations.length} book(s) reserved. Complete your reservation to pick up or get home delivery.
            </Typography>
          </Container>
        </Box>

        <Box className="cartBox">
          <Container maxWidth="lg">
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : reservations.length === 0 ? (
              <Card sx={{ borderRadius: "16px", textAlign: "center", py: 8 }}>
                <LocalLibraryIcon sx={{ fontSize: 80, color: "#ccc", mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#000000", mb: 2 }}>
                  Your cart is empty
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
                  Browse our collection and reserve books to get started.
                </Typography>
                <Button
                  variant="contained"
                  href="/books"
                  sx={{ bgcolor: "#000000", borderRadius: "8px", px: 4, py: 1.5, textTransform: "none" }}
                >
                  Browse Books
                </Button>
              </Card>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#000000", mb: 3 }}>
                    Reserved Books ({reservations.length})
                  </Typography>

                  {reservations.map((reservation, index) => (
                    <Card key={reservation._id} sx={{ borderRadius: "16px", mb: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                          <Box
                            component="img"
                            src={reservation.book?.coverImage || "/images/footer/book22.png"}
                            alt={reservation.book?.title}
                            sx={{
                              width: 100,
                              height: 140,
                              objectFit: "contain",
                              borderRadius: "8px",
                              bgcolor: "#f5f5f5",
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#000000" }}>
                                  {reservation.book?.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#888", mb: 1 }}>
                                  by {reservation.book?.author}
                                </Typography>
                                <Chip label={reservation.book?.category} size="small" sx={{ mb: 2, bgcolor: "#f0f0f0" }} />
                              </Box>
                              <IconButton size="small" sx={{ color: "#f44336" }} onClick={() => handleCancelReservation(reservation._id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 2 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <CalendarTodayIcon sx={{ fontSize: 16, color: "#888" }} />
                                <Typography variant="caption" sx={{ color: "#888" }}>
                                  Reserved: {new Date(reservation.reservedOn).toLocaleDateString()}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <CalendarTodayIcon sx={{ fontSize: 16, color: "#000000" }} />
                                <Typography variant="caption" sx={{ color: "#000000", fontWeight: 600 }}>
                                  Expires: {new Date(reservation.reserveExpiry).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: "#000000" }}>
                                Rs. {reservation.totalPrice}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{ borderRadius: "8px", textTransform: "none" }}
                                  onClick={() => handleCancelReservation(reservation._id)}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}

                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      href="/books"
                      sx={{ borderRadius: "8px", textTransform: "none" }}
                    >
                      Continue Browsing
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card className="summaryCard">
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#000000", mb: 3 }}>
                        Order Summary
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            Subtotal ({reservations.length} books)
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Rs. {subtotal}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            Delivery Fee
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Rs. {deliveryFee}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                          <Typography variant="body2" sx={{ color: "#4CAF50" }}>
                            Member Discount
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#4CAF50" }}>
                            - Rs. {discount}
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "#000000" }}>
                            Total
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "#000000" }}>
                            Rs. {total}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => setOpenCheckout(true)}
                        sx={{
                          bgcolor: "#000000",
                          borderRadius: "8px",
                          py: 1.5,
                          fontSize: "16px",
                          fontWeight: 600,
                          textTransform: "none",
                          mb: 2,
                          "&:hover": { bgcolor: "#333333" },
                        }}
                      >
                        Proceed to Checkout
                      </Button>

                      <Typography variant="caption" sx={{ color: "#888", display: "block", textAlign: "center" }}>
                        Secure checkout powered by eSewa and Khalti
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ borderRadius: "16px", mt: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", bgcolor: "#f8f9fa" }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <CheckCircleIcon sx={{ color: "#4CAF50" }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Premium Member Benefits
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.7 }}>
                        Free delivery within Kathmandu valley. 15% discount on all purchases. Extended borrowing period of 21 days.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Container>
        </Box>

        <Dialog open={openCheckout} onClose={() => setOpenCheckout(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, color: "#000000" }}>Confirm Reservation</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
              You are reserving {reservations.length} book(s) for a total of Rs. {total}.
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Select Payment Method:</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
              {["eSewa", "Khalti", "Cash on Pickup"].map((method) => (
                <Button
                  key={method}
                  variant={paymentMethod === method ? "contained" : "outlined"}
                  fullWidth
                  sx={{ justifyContent: "flex-start", borderRadius: "8px", bgcolor: paymentMethod === method ? "#000000" : "transparent" }}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </Button>
              ))}
            </Box>
            <Typography variant="body2" sx={{ color: "#888" }}>
              Books will be held for 48 hours after reservation confirmation.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCheckout(false)} sx={{ textTransform: "none" }}>Cancel</Button>
            <Button onClick={handleCheckout} variant="contained" sx={{ bgcolor: "#000000", borderRadius: "8px", textTransform: "none" }}>
              Confirm & Pay
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openSuccess} onClose={() => setOpenSuccess(false)} maxWidth="sm" fullWidth>
          <DialogContent sx={{ textAlign: "center", py: 6 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: "#4CAF50", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#000000", mb: 1 }}>
              Reservation Confirmed!
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
              Your books have been reserved successfully. You will receive a confirmation email and SMS shortly.
            </Typography>
            <Typography variant="body2" sx={{ color: "#888", mb: 3 }}>
              Order #LIB-{Date.now().toString().slice(-4)}
            </Typography>
            <Button
              variant="contained"
              href="/account"
              sx={{ bgcolor: "#000000", borderRadius: "8px", px: 4, textTransform: "none" }}
            >
              View My Orders
            </Button>
          </DialogContent>
        </Dialog>
      </CartBox>
    </HomeLayout>
  );
}
