"use client";
import { Box, Typography, Container, Grid, Card, CardContent, Rating, Button, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../layouts/HomeLayout/layout";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const NewReleaseBox = styled(Box)(({ theme }) => ({
  "& .newReleaseBox": {
    padding: "60px 0",
    minHeight: "calc(100vh - 300px)",
  },
  "& .heroSection": {
    background: "linear-gradient(135deg, #173F5F 0%, #393280 100%)",
    color: "#fff",
    padding: "60px 0",
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

const newReleases = [
  { id: 1, title: "Atomic Habits", author: "James Clear", rating: 5, price: "Rs. 1100", badge: "New", image: "/images/footer/book19.svg" },
  { id: 2, title: "The Psychology of Money", author: "Morgan Housel", rating: 5, price: "Rs. 950", badge: "Trending", image: "/images/footer/book20.svg" },
  { id: 3, title: "Ikigai", author: "Hector Garcia", rating: 4, price: "Rs. 800", badge: "New", image: "/images/footer/book21.svg" },
  { id: 4, title: "The Alchemist", author: "Paulo Coelho", rating: 5, price: "Rs. 700", badge: "Popular", image: "/images/footer/book4.svg" },
  { id: 5, title: "Educated", author: "Tara Westover", rating: 4, price: "Rs. 1300", badge: "New", image: "/images/footer/book13.svg" },
  { id: 6, title: "Deep Work", author: "Cal Newport", rating: 5, price: "Rs. 1050", badge: "Trending", image: "/images/footer/book14.svg" },
  { id: 7, title: "The Subtle Art", author: "Mark Manson", rating: 4, price: "Rs. 850", badge: "Popular", image: "/images/footer/book15.svg" },
  { id: 8, title: "Thinking in Bets", author: "Annie Duke", rating: 4, price: "Rs. 1200", badge: "New", image: "/images/footer/book16.svg" },
];

export default function NewRelease() {
  return (
    <HomeLayout>
      <NewReleaseBox>
        <Box className="heroSection">
          <Container maxWidth="lg">
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
              <LocalFireDepartmentIcon sx={{ color: "#ED553B", fontSize: 32 }} />
              <Typography variant="h2" sx={{ fontWeight: 800, color:"white" }}>
                New Releases
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: "700px", margin: "0 auto", opacity: 0.9, color:"white" }}>
              Discover the latest additions to our library. Fresh books added weekly to keep you inspired.
            </Typography>
          </Container>
        </Box>

        <Box className="newReleaseBox">
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              {newReleases.map((book) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                  <Card className="bookCard">
                    <CardContent sx={{ p: 3, position: "relative" }}>
                      <Chip
                        label={book.badge}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          bgcolor: book.badge === "Trending" ? "#ED553B" : book.badge === "Popular" ? "#393280" : "#4CAF50",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      />
                      <Box
                        component="img"
                        src={book.image}
                        alt={book.title}
                        sx={{
                          width: "100%",
                          height: "220px",
                          objectFit: "contain",
                          mb: 2,
                          borderRadius: 1,
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: "#173F5F", mb: 0.5 }}
                      >
                        {book.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#999", display: "block", mb: 1 }}>
                        by {book.author}
                      </Typography>
                      <Rating value={book.rating} readOnly size="small" sx={{ color: "#ffb400", mb: 1 }} />
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#ED553B" }}>
                          {book.price}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            bgcolor: "#393280",
                            borderRadius: "8px",
                            textTransform: "none",
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

            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
                Showing 8 of 120+ new releases this month
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "#ED553B",
                  borderRadius: "8px",
                  px: 5,
                  py: 1.5,
                  fontSize: "16px",
                  "&:hover": { bgcolor: "#d94a32" },
                }}
              >
                View All New Releases
              </Button>
            </Box>
          </Container>
        </Box>
      </NewReleaseBox>
    </HomeLayout>
  );
}
