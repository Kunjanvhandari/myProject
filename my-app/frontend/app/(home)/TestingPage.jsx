"use client";
import { Box, Button, Typography, Grid, Container } from "@mui/material";
import Logo from "@/src/components/Logo";

export default function TestingPage() {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "white" }}>
      {/* 1. Header Logo Area */}
      <Container maxWidth="lg">
        <Box sx={{ py: 2 }}>
          <Logo />
        </Box>
      </Container>

      {/* 2. Hero Section (Split Layout) */}
      <Container maxWidth="lg">
        <Grid container alignItems="center" spacing={4} sx={{ py: 8 }}>
          
          {/* LEFT SIDE: Text and Button */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h2" 
              sx={{ fontWeight: 800, color: "#2E266F", fontSize: "3rem", mb: 2 }}
            >
              Ipsum Dolor Si
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: "#555", fontSize: "1.1rem", mb: 4, maxWidth: "90%" }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed eu feugiat amet, libero ipsum enim pharetra hac. 
              Urna commodo, lacus ut magna velit eleifend.
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ 
                borderRadius: "4px", 
                borderColor: "#2E266F", 
                color: "#2E266F",
                px: 4, py: 1
              }}
            >
              READ MORE →
            </Button>
          </Grid>

          {/* RIGHT SIDE: The Image */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              src="/Screenshot 2026-02-10 183043.jpg" // Ensure this matches your file name in the public folder
              alt="Book Collage"
              sx={{
                width: "100%",
                maxWidth: "500px",
                height: "auto",
                objectFit: "contain"
              }}
            />
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}