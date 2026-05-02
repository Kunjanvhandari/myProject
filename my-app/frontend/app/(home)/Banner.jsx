"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const SliderDot = styled(Box)(({ active }) => ({
  width: active ? 16 : 8,
  height: 16,
  borderRadius: "50%",
  backgroundColor: active ? "#ED553B" : "#D9D9D9",
  border: active ? "4px solid rgba(237, 85, 59, 0.2)" : "none",
  cursor: "pointer",
  transition: "0.3s",
}));

export default function Banner() {
  return (
    <Box sx={{ bgcolor: "#fff" }}>
      <Box sx={{ background: "linear-gradient(135deg, #fff 0%, #FDF8F7 100%)", py: 10 }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ width: 30, height: 2, bgcolor: "#ED553B", mr: 1.5 }} />
                <Typography variant="overline" sx={{ color: "#ED553B", fontWeight: 700 }}>DIGITAL LIBRARY</Typography>
              </Box>
              <Typography variant="h2" sx={{ fontWeight: 800, color: "#173F5F", mb: 3 }}>
                Discover a World of Knowledge
              </Typography>
              <Typography sx={{ color: "#666", mb: 4, lineHeight: 1.8 }}>
                Explore thousands of books, journals, and digital resources at your fingertips.
                Our library management system provides seamless access to academic materials,
                e-books, and research papers for students, educators, and lifelong learners.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="contained" endIcon={<ArrowForwardIcon />} sx={{ borderRadius: "4px", px: 4, py: 1.5, bgcolor: "#ED553B", color: "#fff" }}>
                  EXPLORE BOOKS
                </Button>
                <Button variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ borderRadius: "4px", px: 4, py: 1.5, color: "#173F5F", borderColor: "#D9D9D9" }}>
                  LEARN MORE
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5, mt: 6 }}>
                <SliderDot active={true} />
                <SliderDot active={false} />
                <SliderDot active={false} />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }} sx={{ display: "flex", justifyContent: "center" }}>
              <Box component="img" src="/images/footer/book.png" sx={{ maxWidth: "100%", height: "auto" }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
