"use client";
import { Box, Typography, Container, Grid, Card, CardContent, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../layouts/HomeLayout/layout";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import ComputerIcon from "@mui/icons-material/Computer";

const AboutUsBox = styled(Box)(({ theme }) => ({
  "& .aboutBox": {
    padding: "60px 0",
  },
  "& .heroSection": {
    background: "linear-gradient(135deg, #173F5F 0%, #393280 100%)",
    color: "#fff",
    padding: "80px 0",
    textAlign: "center",
    borderRadius: "0 0 50px 50px",
    marginBottom: "60px",
  },
  "& .statCard": {
    textAlign: "center",
    padding: "30px 20px",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  "& .sectionTitle": {
    color: "#173F5F",
    fontWeight: 800,
    marginBottom: "20px",
    position: "relative",
    "&::after": {
      content: '""',
      display: "block",
      width: "60px",
      height: "4px",
      background: "#ED553B",
      margin: "10px auto",
      borderRadius: "2px",
    },
  },
}));

export default function AboutUs() {
  return (
    <HomeLayout>
      <AboutUsBox>
        <Box className="heroSection">
          <Container maxWidth="lg">
            <animate__slideInRight>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, color: "white" }}>
                About LibriVista Library
              </Typography>
            </animate__slideInRight>

            <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: "700px", margin: "0 auto", opacity: 0.9, color: "white" }}>
              Empowering minds through knowledge since 2015. We are committed to providing
              accessible, diverse, and comprehensive library services to our community.
            </Typography>
          </Container>
        </Box>

        <Box className="aboutBox">
          <Container maxWidth="lg">
            <Box sx={{ mb: 8 }}>
              <Typography variant="h3" className="sectionTitle" textAlign="center">
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.9, maxWidth: "900px", margin: "0 auto", textAlign: "center", mb: 4 }}>
                LibriVista Library Management System is a comprehensive digital platform designed to
                modernize how libraries operate and how readers access knowledge. Our mission is to
                bridge the gap between traditional library services and modern technology, making
                books, journals, research papers, and digital content accessible to everyone,
                everywhere. We believe that knowledge should be free-flowing and that libraries
                should be the heart of every community.
              </Typography>
            </Box>

            <Grid container spacing={4} sx={{ mb: 8 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 4, height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <CardContent sx={{ p: 4 }}>
                    <LibraryBooksIcon sx={{ fontSize: 48, color: "#ED553B", mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#173F5F", mb: 2 }}>
                      Vast Collection
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666", lineHeight: 1.8 }}>
                      Our library houses over 50,000 physical books and 100,000+ digital resources
                      spanning across multiple genres including fiction, non-fiction, academic texts,
                      research journals, children literature, and rare manuscripts. We continuously
                      expand our collection based on community needs and academic requirements.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 4, height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                  <CardContent sx={{ p: 4 }}>
                    <ComputerIcon sx={{ fontSize: 48, color: "#393280", mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#173F5F", mb: 2 }}>
                      Digital Innovation
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666", lineHeight: 1.8 }}>
                      Our state-of-the-art Library Management System enables seamless book searching,
                      online reservation, digital borrowing, and personalized reading recommendations.
                      Members can access e-books, audiobooks, and online databases from anywhere,
                      making learning convenient and flexible.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mb: 8 }}>
              <Typography variant="h3" className="sectionTitle" textAlign="center">
                Our Story
              </Typography>
              <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.9, maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
                Founded in 2015 by a group of passionate educators and technologists, LibriVista
                started as a small community library in Kathmandu, Nepal. Recognizing the challenges
                faced by students and readers in accessing quality educational resources, we set out
                to create a solution that combines traditional library values with modern technology.
                Over the years, we have grown into a comprehensive library management platform
                serving thousands of members across educational institutions, corporations, and
                individual readers. Our platform has been inspired by successful library systems
                like Koha ILS, Evergreen, and LibraryThing, incorporating best practices from
                each to create a uniquely tailored solution for our community.
              </Typography>
            </Box>

            <Box sx={{ mb: 8 }}>
              <Typography variant="h3" className="sectionTitle" textAlign="center">
                By The Numbers
              </Typography>
              <Grid container spacing={4} sx={{ mt: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="statCard">
                    <Typography variant="h2" sx={{ fontWeight: 800, color: "#ED553B" }}>
                      50K+
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666" }}>
                      Physical Books
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="statCard">
                    <Typography variant="h2" sx={{ fontWeight: 800, color: "#393280" }}>
                      100K+
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666" }}>
                      Digital Resources
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="statCard">
                    <Typography variant="h2" sx={{ fontWeight: 800, color: "#ED553B" }}>
                      25K+
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666" }}>
                      Active Members
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box className="statCard">
                    <Typography variant="h2" sx={{ fontWeight: 800, color: "#393280" }}>
                      10+
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666" }}>
                      Years of Service
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 8 }}>
              <Typography variant="h3" className="sectionTitle" textAlign="center">
                Our Services
              </Typography>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {[
                  { icon: <SchoolIcon sx={{ fontSize: 40, color: "#ED553B" }} />, title: "Academic Support", desc: "Curated collections for students and researchers with subject-specific databases and study materials." },
                  { icon: <PeopleIcon sx={{ fontSize: 40, color: "#393280" }} />, title: "Community Programs", desc: "Book clubs, reading challenges, author talks, and literacy programs for all age groups." },
                  { icon: <LibraryBooksIcon sx={{ fontSize: 40, color: "#ED553B" }} />, title: "Inter-Library Loans", desc: "Access books from partner libraries across the country through our inter-library network." },
                  { icon: <ComputerIcon sx={{ fontSize: 40, color: "#393280" }} />, title: "Digital Access", desc: "24/7 access to e-books, audiobooks, online journals, and research databases from anywhere." },
                ].map((service, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box sx={{ textAlign: "center", p: 3 }}>
                      {service.icon}
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#173F5F", mt: 2, mb: 1 }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.7 }}>
                        {service.desc}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
        </Box>
      </AboutUsBox>
    </HomeLayout>
  );
}
