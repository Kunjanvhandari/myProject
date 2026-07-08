"use client";
import { useState } from "react";
import { Box, Typography, Container, Grid, Card, CardContent, Rating, Button, IconButton, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../../layouts/HomeLayout/layout";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";

const WishlistBox = styled(Box)(({ theme }) => ({
  "& .wishlistBox": {
    padding: "40px 0",
    minHeight: "calc(100vh - 300px)",
  },
  "& .heroSection": {
    background: "linear-gradient(135deg, #173F5F 0%, #393280 100%)",
    color: "#fff",
    padding: "50px 0",
    textAlign: "center",
    borderRadius: "0 0 50px 50px",
    marginBottom: "40px",
  },
  "& .bookCard": {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    },
  },
}));

const wishlistData = [
  { id: 1, title: "Thinking in Bets", author: "Annie Duke", rating: 4, price: "Rs. 1200", addedOn: "15 Apr 2026", image: "/images/footer/book16.svg" },
  { id: 2, title: "The Subtle Art", author: "Mark Manson", rating: 4, price: "Rs. 850", addedOn: "12 Apr 2026", image: "/images/footer/book15.svg" },
  { id: 3, title: "Educated", author: "Tara Westover", rating: 5, price: "Rs. 1300", addedOn: "10 Apr 2026", image: "/images/footer/book13.svg" },
  { id: 4, title: "The Great Gatsby", author: "F. Scott Fitzgerald", rating: 4, price: "Rs. 600", addedOn: "08 Apr 2026", image: "/images/footer/book14.svg" },
];

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(wishlistData);

  const handleRemove = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <HomeLayout>
      <WishlistBox>
        <Box className="heroSection">
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
              <FavoriteIcon sx={{ fontSize: 32, color: "#ED553B" }} />
              <Typography variant="h2" sx={{ fontWeight: 800 }}>
                My Wishlist
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: "600px", margin: "0 auto", opacity: 0.9 }}>
              {wishlist.length} book(s) saved. Reserve or buy your favorite books anytime.
            </Typography>
          </Container>
        </Box>

        <Box className="wishlistBox">
          <Container maxWidth="lg">
            {wishlist.length === 0 ? (
              <Card sx={{ borderRadius: "16px", textAlign: "center", py: 8 }}>
                <FavoriteBorderIcon sx={{ fontSize: 80, color: "#ccc", mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#173F5F", mb: 2 }}>
                  Your wishlist is empty
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
                  Browse our collection and add books you love to your wishlist.
                </Typography>
                <Button
                  variant="contained"
                  href="/books"
                  sx={{ bgcolor: "#ED553B", borderRadius: "8px", px: 4, py: 1.5, textTransform: "none" }}
                >
                  Browse Books
                </Button>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {wishlist.map((book) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                    <Card className="bookCard">
                      <CardContent sx={{ p: 3, position: "relative" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleRemove(book.id)}
                          sx={{ position: "absolute", top: 8, right: 8, color: "#f44336" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <Box
                          component="img"
                          src={book.image}
                          alt={book.title}
                          sx={{
                            width: "100%",
                            height: "200px",
                            objectFit: "contain",
                            mb: 2,
                            borderRadius: 1,
                          }}
                        />
                        <Chip label="Wishlist" size="small" sx={{ mb: 1, bgcolor: "#fce4ec", color: "#ED553B", fontWeight: 600 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#173F5F", mb: 0.5 }}>
                          {book.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#999", display: "block", mb: 1 }}>
                          by {book.author}
                        </Typography>
                        <Rating value={book.rating} readOnly size="small" sx={{ color: "#ffb400", mb: 1 }} />
                        <Typography variant="caption" sx={{ color: "#888", display: "block", mb: 2 }}>
                          Added on {book.addedOn}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "#ED553B" }}>
                            {book.price}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<ShoppingCartIcon sx={{ fontSize: 16 }} />}
                            sx={{
                              bgcolor: "#393280",
                              borderRadius: "8px",
                              textTransform: "none",
                              fontSize: "0.75rem",
                              "&:hover": { bgcolor: "#2a2560" },
                            }}
                          >
                            Reserve
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>
      </WishlistBox>
    </HomeLayout>
  );
}
