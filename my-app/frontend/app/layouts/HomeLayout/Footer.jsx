"use client";
import Avatar from '@mui/material/Avatar';
import { styled } from "@mui/system";
import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  Typography,
  Divider,
} from "@mui/material";
import Link from 'next/link';

const MainComponent = styled(Box)(({ theme }) => ({
  "& .footerSection": {
    position: "relative",
    padding: "60px 0 0",
    zIndex: "2",
    overflow: "hidden",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    "& .footerContentBox": {
      maxWidth: "280px",
      [theme.breakpoints.down("xs")]: {
        maxWidth: "100%",
      },
    },
    "& .copy": {
      borderTop: "1px solid rgba(255, 255, 255, 0.15)",
      padding: "20px 0",
      textAlign: "center",
      fontWeight: 300,
      fontSize: "13px",
      color: "rgba(255, 255, 255, 0.6)",
    },
    "& svg": {
      fontSize: "20px !important",
      cursor: "pointer",
      color: "#FFFFFF",
    },
    "& h6": {
      [theme.breakpoints.down("sm")]: {
        marginTop: "30px",
      },
      [theme.breakpoints.down("xs")]: {
        marginTop: "10px",
      },
    },
    "& a": {
      display: "flex",
      fontSize: "14px",
      alignItems: "center",
      fontWeight: "400",
      paddingLeft: "0px",
      paddingRight: "0px",
      textDecoration: "none",
      color: "rgba(255, 255, 255, 0.7)",
      transition: "color 0.3s",
      [theme.breakpoints.only("xs")]: {
        fontSize: "12px",
      },
      "&:hover": {
        color: "#FFFFFF",
        textDecoration: "none",
      },
    },
    "& .socialIcons": {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      "& .MuiIconButton-root": {
        background: "rgba(255, 255, 255, 0.1)",
        marginRight: "0",
        padding: "10px",
        borderRadius: "50%",
        transition: "background 0.3s",
        "&:hover": {
          background: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
    "& .footerTitle": {
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "2px",
      color: "#FFFFFF",
      marginBottom: "20px",
    },
    "& .newsItem": {
      display: "flex",
      gap: "12px",
      marginBottom: "20px",
      "& img": {
        width: "70px",
        height: "70px",
        borderRadius: "8px",
        objectFit: "cover",
        filter: "grayscale(100%)",
      },
    },
    "& .newsDate": {
      fontSize: "12px",
      color: "rgba(255, 255, 255, 0.5)",
    },
  },
}));

const Footer = () => {
  return (
    <MainComponent>
      <Box className="footerSection">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box className="footerContentBox">
                <Box mb={2}>
                  <Link href="/">
                    <Avatar
                      alt="LibriVista"
                      src="/images/footer/footer_logo.svg"
                      sx={{ width: "60px", height: "60px", mb: 2 }}
                    />
                  </Link>
                </Box>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.7, fontSize: "14px" }}>
                  LibriVista Library Management System - Your gateway to knowledge. Explore 50,000+ physical books and 100,000+ digital resources.
                </Typography>
                <Box className="socialIcons" mt={3}>
                  <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
                      <Box component="img" src="/images/footer/facebook.svg" sx={{ width: 18, height: 18 }} />
                    </Box>
                  </Link>
                  <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
                      <Box component="img" src="/images/footer/in.svg" sx={{ width: 18, height: 18 }} />
                    </Box>
                  </Link>
                  <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
                      <Box component="img" src="/images/footer/twit.svg" sx={{ width: 18, height: 18 }} />
                    </Box>
                  </Link>
                  <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
                      <Box component="img" src="/images/footer/youtube.svg" sx={{ width: 18, height: 18 }} />
                    </Box>
                  </Link>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography className="footerTitle">
                Quick Links
              </Typography>
              <List sx={{ p: 0 }}>
                <ListItem component={Link} href="/">Home</ListItem>
                <ListItem component={Link} href="/about-us">About Us</ListItem>
                <ListItem component={Link} href="/books">Books</ListItem>
                <ListItem component={Link} href="/new-release">New Releases</ListItem>
                <ListItem component={Link} href="/blog">Blog</ListItem>
                <ListItem component={Link} href="/contact-us">Contact Us</ListItem>
                <ListItem component={Link} href="/account">My Account</ListItem>
                <ListItem component={Link} href="/cart">Cart</ListItem>
              </List>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography className="footerTitle">
                Latest News
              </Typography>

              <Box className="newsItem">
                <Box>
                  <Box component="img" src="/images/footer/latest.svg" alt="news" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#FFFFFF", fontWeight: 600, lineHeight: 1.4 }}>
                    New Digital Collection
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", display: "block", mt: 0.5 }}>
                    10,000+ e-books added...
                  </Typography>
                  <Typography className="newsDate">25 April 2026</Typography>
                </Box>
              </Box>

              <Box className="newsItem">
                <Box>
                  <Box component="img" src="/images/footer/news.svg" alt="news" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#FFFFFF", fontWeight: 600, lineHeight: 1.4 }}>
                    Author Meet & Greet
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", display: "block", mt: 0.5 }}>
                    Evening with authors...
                  </Typography>
                  <Typography className="newsDate">18 April 2026</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.15)", mt: 4 }} />

        <Box className="copy">
          <Container>
            <Box
              alignItems="center"
              flexWrap="wrap"
              display="flex"
              justifyContent="space-between"
              sx={{ gap: 2 }}
            >
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
                2026 LibriVista Library Management System. All Rights Reserved
              </Typography>
              <List sx={{ display: "flex", gap: 2, p: 0 }}>
                <ListItem component={Link} href="/privacy-policy">Privacy Policy</ListItem>
                <ListItem component={Link} href="/terms-condition">Terms of Service</ListItem>
              </List>
            </Box>
          </Container>
        </Box>
      </Box>
    </MainComponent>
  );
};

export default Footer;
