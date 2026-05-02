import HomeLayout from "../layouts/HomeLayout/layout";
import { Box, Container, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Home() {
  return (
    <HomeLayout>
      <Box sx={{ bgcolor: "#fff", py: 8 }}>
        <Container maxWidth="xl">
          <Typography variant="h2" sx={{ fontWeight: 800, color: "#173F5F", mb: 3 }}>
            Welcome to LibriVista Library
          </Typography>
          <Typography sx={{ color: "#666", mb: 4, lineHeight: 1.8 }}>
            Discover thousands of books, journals, and digital resources at your fingertips.
          </Typography>
          <Button 
            variant="contained" 
            endIcon={<ArrowForwardIcon />} 
            sx={{ borderRadius: "4px", px: 4, py: 1.5, bgcolor: "#ED553B", color: "#fff" }}
            href="/books"
          >
            EXPLORE BOOKS
          </Button>
        </Container>
      </Box>
    </HomeLayout>
  );
}
