"use client";
import { styled } from "@mui/system";
import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SendIcon from "@mui/icons-material/Send";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const MainComponent = styled(Box)(({ theme }) => ({
  "& .ctaSection": {
    background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
    padding: "60px 0",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-50%",
      right: "-20%",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: "rgba(14, 165, 233, 0.08)",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-30%",
      left: "-10%",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.03)",
    },
    "& h2": { fontSize: "32px", fontWeight: 700, color: "#fff", marginBottom: "12px" },
    "& p": { fontSize: "16px", color: "rgba(255,255,255,0.75)", marginBottom: "28px", maxWidth: "500px", margin: "0 auto 28px" },
    "& .ctaButton": {
      background: "#0EA5E9",
      color: "#1E293B",
      padding: "14px 40px",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: 700,
      "&:hover": { background: "#38BDF8", transform: "translateY(-2px)", boxShadow: "0 8px 25px rgba(14,165,233,0.35)" },
    },
  },
  "& .footerSection": {
    background: "#0F172A",
    padding: "60px 0 0",
    color: "#fff",
    "& h6": { color: "#0EA5E9", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" },
    "& a, & .footerLink": {
      color: "rgba(255,255,255,0.6)",
      textDecoration: "none",
      fontSize: "14px",
      transition: "color 0.2s",
      display: "inline-block",
      padding: "4px 0",
      "&:hover": { color: "#0EA5E9" },
    },
    "& .socialCircle": {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s",
      cursor: "pointer",
      "&:hover": { background: "#0EA5E9", "& svg": { color: "#0F172A" } },
    },
    "& .newsletterInput": {
      "& .MuiOutlinedInput-root": {
        background: "rgba(255,255,255,0.06)",
        borderRadius: "12px",
        "& fieldset": { border: "1px solid rgba(255,255,255,0.1)" },
        "&:hover fieldset": { borderColor: "rgba(14,165,233,0.4)" },
        "&.Mui-focused fieldset": { borderColor: "#0EA5E9" },
        "& input": { color: "#fff", "&::placeholder": { color: "rgba(255,255,255,0.4)" } },
      },
    },
    "& .copy": {
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "20px 0",
      marginTop: "40px",
    },
  },
}));

const Footer = () => {
  return (
    <MainComponent>
      {/* CTA SECTION */}
      <Box className="ctaSection">
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h2">Ready to Start Reading?</Typography>
          <Typography>
            Join thousands of readers discovering their next favorite book at LibriVista.
          </Typography>
          <Button className="ctaButton" component={Link} href="/books">
            <LibraryBooksIcon sx={{ mr: 1, fontSize: 20 }} />
            Explore Books Now
          </Button>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box className="footerSection">
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            {/* About */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: "50%", background: "#0EA5E9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LibraryBooksIcon sx={{ color: "#0F172A", fontSize: 22 }} />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: "22px", color: "#fff" }}>
                  Libri<span style={{ color: "#0EA5E9" }}>Vista</span>
                </Typography>
              </Box>
              <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: 1.8, mb: 3, maxWidth: "300px" }}>
                Your gateway to knowledge — explore 50,000+ physical books and 100,000+ digital resources.
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Box className="socialCircle"><FacebookIcon sx={{ fontSize: 18 }} /></Box>
                <Box className="socialCircle"><InstagramIcon sx={{ fontSize: 18 }} /></Box>
                <Box className="socialCircle"><TwitterIcon sx={{ fontSize: 18 }} /></Box>
                <Box className="socialCircle"><YouTubeIcon sx={{ fontSize: 18 }} /></Box>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} md={2}>
              <Typography variant="h6">Quick Links</Typography>
              <List sx={{ p: 0 }}>
                {["Home", "Books", "New Releases", "About Us", "Blog", "Contact"].map((item) => (
                  <ListItem key={item} sx={{ p: 0 }}>
                    <Link href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s+/g, "-")}`}>{item}</Link>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Support */}
            <Grid item xs={6} md={2}>
              <Typography variant="h6">Support</Typography>
              <List sx={{ p: 0 }}>
                {["My Account", "FAQs", "Privacy Policy", "Terms of Service", "Help Center"].map((item) => (
                  <ListItem key={item} sx={{ p: 0 }}>
                    <Link href={"/"}>{item}</Link>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Stay Updated</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", mb: 2 }}>
                Subscribe to our newsletter for new arrivals, events, and reading tips.
              </Typography>
              <Box className="newsletterInput" sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Your email address"
                  size="small"
                  InputProps={{ sx: { color: "#fff" } }}
                />
                <IconButton
                  sx={{ bgcolor: "#0EA5E9", borderRadius: "12px", "&:hover": { bgcolor: "#38BDF8" }, width: 48, height: 48 }}
                >
                  <SendIcon sx={{ color: "#0F172A", fontSize: 20 }} />
                </IconButton>
              </Box>
              <Box sx={{ mt: 2.5, display: "flex", gap: 1.5, alignItems: "center", color: "rgba(255,255,255,0.45)", fontSize: "13px" }}>
                <PhoneIcon sx={{ fontSize: 14 }} /> +977-9763942189
              </Box>
            </Grid>
          </Grid>

          <Box className="copy">
            <Container>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" sx={{ gap: 2 }}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                  &copy; {new Date().getFullYear()} LibriVista Library Management System. All rights reserved.
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Link href="/privacy-policy" style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Privacy Policy</Link>
                  <Link href="/terms-condition" style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Terms of Service</Link>
                </Box>
              </Box>
            </Container>
          </Box>
        </Container>
      </Box>
    </MainComponent>
  );
};

export default Footer;
