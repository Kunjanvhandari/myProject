"use client";
import { Box, Typography, Container, Grid, Card, CardContent, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../layouts/HomeLayout/layout";
import Link from "next/link";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const HeroSection = styled(Box)({
  background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
  padding: "80px 0",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    right: "-20%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "rgba(14, 165, 233, 0.08)",
  },
});

const FeatureCard = styled(Card)({
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  height: "100%",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
});

const features = [
  { title: "Browse Books", desc: "Explore our vast collection of 50,000+ physical books and 100,000+ e-books across all genres.", icon: <LibraryBooksIcon sx={{ fontSize: 40 }} />, href: "/library/books" },
  { title: "Search & Discover", desc: "Find your next read with powerful search, filters, and personalized recommendations.", icon: <SearchIcon sx={{ fontSize: 40 }} />, href: "/library/books" },
  { title: "New Releases", desc: "Stay up to date with the latest arrivals and newly added books to our collection.", icon: <NewReleasesIcon sx={{ fontSize: 40 }} />, href: "/library/new-release" },
  { title: "Read Online", desc: "Access e-books and PDFs directly in your browser with our built-in reader.", icon: <AutoStoriesIcon sx={{ fontSize: 40 }} />, href: "/library/books" },
  { title: "My Account", desc: "Manage your reservations, borrowing history, wishlist, and profile settings.", icon: <AccountCircleIcon sx={{ fontSize: 40 }} />, href: "/library/account" },
  { title: "Admin Dashboard", desc: "Library administrators can manage books, users, borrowings, and reservations.", icon: <DashboardIcon sx={{ fontSize: 40 }} />, href: "/library/dashboard" },
];

export default function LibraryHome() {
  return (
    <HomeLayout>
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#fff", mb: 2, fontSize: { xs: "28px", md: "42px" } }}>
            Welcome to the Library
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: "18px", mb: 4, maxWidth: 600, mx: "auto" }}>
            Discover, borrow, and read thousands of books from our digital and physical collection.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button component={Link} href="/library/books" variant="contained" size="large" sx={{ borderRadius: "12px", px: 4, py: 1.5, bgcolor: "#0EA5E9", color: "#0F172A", fontWeight: 700, "&:hover": { bgcolor: "#38BDF8" } }}>
              <LibraryBooksIcon sx={{ mr: 1 }} /> Browse Books
            </Button>
            <Button component={Link} href="/library/new-release" variant="outlined" size="large" sx={{ borderRadius: "12px", px: 4, py: 1.5, borderColor: "rgba(255,255,255,0.3)", color: "#fff", "&:hover": { borderColor: "#0EA5E9", bgcolor: "rgba(14,165,233,0.1)" } }}>
              <NewReleasesIcon sx={{ mr: 1 }} /> New Releases
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 6, color: "#1E293B" }}>
          Explore Library Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Link href={f.href} style={{ textDecoration: "none" }}>
                <FeatureCard>
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Box sx={{ color: "#0EA5E9", mb: 2 }}>{f.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#1E293B" }}>{f.title}</Typography>
                    <Typography variant="body2" sx={{ color: "#5A5A7A", lineHeight: 1.7 }}>{f.desc}</Typography>
                  </CardContent>
                </FeatureCard>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </HomeLayout>
  );
}