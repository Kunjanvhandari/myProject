"use client";
import { Box, Container, Grid, Typography, TextField, IconButton, Divider } from "@mui/material";
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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Library", href: "/library" },
      { label: "Books", href: "/library/books" },
      { label: "About", href: "/about-us" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact-us" },
      { label: "Developer", href: "/head-developer" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "My Account", href: "/library/account" },
      { label: "FAQs", href: "/faqs" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-condition" },
    ],
  },
];

const socialLinks = [
  { icon: <FacebookIcon sx={{ fontSize: 18 }} />, href: "#", color: "#1877F2" },
  { icon: <InstagramIcon sx={{ fontSize: 18 }} />, href: "#", color: "#E4405F" },
  { icon: <TwitterIcon sx={{ fontSize: 18 }} />, href: "#", color: "#1DA1F2" },
  { icon: <YouTubeIcon sx={{ fontSize: 18 }} />, href: "#", color: "#FF0000" },
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <Box sx={{ position: "relative" }}>
      {/* Newsletter CTA */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #1E293B 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-30%", right: "-10%", width: "400px", height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-40%", left: "-10%", width: "300px", height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 6, md: 8 }, textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#fff", mb: 1.5 }}>
              Stay Connected
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", mb: 4, maxWidth: 480, mx: "auto", fontSize: "16px" }}>
              Subscribe to our newsletter for new arrivals, events, and reading tips.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, maxWidth: 420, mx: "auto" }}>
              <TextField
                fullWidth
                placeholder="Your email address"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    "& fieldset": { border: "1px solid rgba(255,255,255,0.1)" },
                    "&:hover fieldset": { borderColor: "rgba(14,165,233,0.4)" },
                    "&.Mui-focused fieldset": { borderColor: "#0EA5E9" },
                    "& input": { color: "#fff", "&::placeholder": { color: "rgba(255,255,255,0.4)" } },
                  },
                }}
              />
              <IconButton
                sx={{
                  bgcolor: "#0EA5E9",
                  borderRadius: "12px",
                  width: 48,
                  height: 48,
                  transition: "all 0.3s ease",
                  "&:hover": { bgcolor: "#38BDF8", transform: "scale(1.05)" },
                }}
              >
                <SendIcon sx={{ color: "#0F172A" }} />
              </IconButton>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Main Footer */}
      <Box sx={{ background: "#0A0A0F", pt: { xs: 6, md: 8 }, pb: 0 }}>
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            {/* Brand */}
            <Grid item xs={12} md={4}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "linear-gradient(135deg, #0EA5E9, #8B5CF6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <LibraryBooksIcon sx={{ color: "#fff", fontSize: 22 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "22px", color: "#fff" }}>
                    Saraswati<span style={{ color: "#0EA5E9" }}>Library</span>
                  </Typography>
                </Box>
                <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", lineHeight: 1.8, mb: 3, maxWidth: 320 }}>
                  Your gateway to knowledge — explore 50,000+ physical books and 100,000+ digital resources.
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  {socialLinks.map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -3, scale: 1.1 }}>
                      <Box
                        component="a"
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          width: 40, height: 40, borderRadius: "50%",
                          background: "rgba(255,255,255,0.06)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "rgba(255,255,255,0.5)",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          "&:hover": { background: s.color, color: "#fff", transform: "translateY(-3px)" },
                        }}
                      >
                        {s.icon}
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Link Sections */}
            {sections.map((sec, i) => (
              <Grid item xs={6} md={2} key={sec.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                >
                  <Typography sx={{ color: "#0EA5E9", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", mb: 2.5 }}>
                    {sec.title}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {sec.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        style={{
                          color: "rgba(255,255,255,0.45)",
                          textDecoration: "none",
                          fontSize: "14px",
                          transition: "color 0.2s ease",
                          width: "fit-content",
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#0EA5E9"}
                        onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.45)"}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            ))}

            {/* Contact */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Typography sx={{ color: "#0EA5E9", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", mb: 2.5 }}>
                  Get In Touch
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[
                    { icon: <LocationOnIcon sx={{ fontSize: 16 }} />, text: "Saraswati Secondary School, Nepal" },
                    { icon: <PhoneIcon sx={{ fontSize: 16 }} />, text: "+977-9763942189" },
                    { icon: <EmailIcon sx={{ fontSize: 16 }} />, text: "kunjanvhandari9@gmail.com" },
                  ].map((item, i) => (
                    <Box key={i} sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                      <Box sx={{ color: "#0EA5E9", display: "flex" }}>{item.icon}</Box>
                      <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>{item.text}</Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", my: 4 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 4, flexWrap: "wrap", gap: 2 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
              &copy; {new Date().getFullYear()} Saraswati Secondary School Library. All rights reserved.
            </Typography>
            <Box
              onClick={scrollToTop}
              sx={{
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "rgba(255,255,255,0.4)",
                transition: "all 0.3s ease",
                "&:hover": { background: "#0EA5E9", color: "#0F172A", transform: "translateY(-3px)" },
              }}
            >
              <KeyboardArrowUpIcon />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
