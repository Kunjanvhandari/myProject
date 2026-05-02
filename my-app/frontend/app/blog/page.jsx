"use client";
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Button, Avatar, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeLayout from "../layouts/HomeLayout/layout";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import ShareIcon from "@mui/icons-material/Share";

const BlogBox = styled(Box)(({ theme }) => ({
  "& .blogBox": {
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
  "& .articleCard": {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  "& .featuredCard": {
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  "& .sectionTitle": {
    color: "#173F5F",
    fontWeight: 800,
    marginBottom: "30px",
    position: "relative",
    "&::after": {
      content: '""',
      display: "block",
      width: "60px",
      height: "4px",
      background: "#ED553B",
      margin: "10px 0",
      borderRadius: "2px",
    },
  },
}));

const articles = [
  {
    id: 1,
    title: "The Benefits of Reading Physical Books in a Digital Age",
    excerpt: "Despite the rise of e-books and digital reading platforms, physical books continue to offer unique benefits for cognitive development and deep reading comprehension.",
    date: "15 March 2026",
    author: "Dr. Sarah Mitchell",
    category: "Reading Tips",
    image: "/images/footer/book9.svg",
  },
  {
    id: 2,
    title: "How Library Management Systems Are Transforming Education",
    excerpt: "Modern library management systems like LibriVista are revolutionizing how students access educational resources, making learning more accessible and personalized.",
    date: "28 February 2026",
    author: "Prof. Rajesh Sharma",
    category: "Technology",
    image: "/images/footer/book10.svg",
  },
  {
    id: 3,
    title: "Top 10 Must-Read Books for College Students in 2026",
    excerpt: "From critical thinking guides to career development manuals, here are the essential books every college student should add to their reading list this year.",
    date: "10 February 2026",
    author: "Anita Gurung",
    category: "Book Lists",
    image: "/images/footer/book11.svg",
  },
];

export default function Blog() {
  return (
    <HomeLayout>
      <BlogBox>
        <Box className="heroSection">
          <Container maxWidth="lg">
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
              Library Blog
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, maxWidth: "700px", margin: "0 auto", opacity: 0.9 }}>
              Stay updated with the latest reading trends, book reviews, and library news.
            </Typography>
          </Container>
        </Box>

        <Box className="blogBox">
          <Container maxWidth="lg">
            <Typography variant="h4" className="sectionTitle">
              Latest Articles
            </Typography>

            <Grid container spacing={4}>
              {articles.map((article) => (
                <Grid item xs={12} md={4} key={article.id}>
                  <Card className="articleCard">
                    <CardMedia
                      component="img"
                      height="220"
                      image={article.image}
                      alt={article.title}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="caption" sx={{ color: "#ED553B", fontWeight: 600, mb: 1, display: "block" }}>
                        {article.category}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#173F5F", mb: 2, lineHeight: 1.4 }}>
                        {article.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666", mb: 2, lineHeight: 1.7 }}>
                        {article.excerpt}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#393280" }}>
                          {article.author.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" sx={{ color: "#999" }}>
                          {article.author} &middot; {article.date}
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Button size="small" sx={{ color: "#ED553B", textTransform: "none" }}>
                          Read More
                        </Button>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <FacebookIcon sx={{ fontSize: 18, color: "#666", cursor: "pointer" }} />
                          <TwitterIcon sx={{ fontSize: 18, color: "#666", cursor: "pointer" }} />
                          <ShareIcon sx={{ fontSize: 18, color: "#666", cursor: "pointer" }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: "8px",
                  px: 5,
                  py: 1.5,
                  borderColor: "#173F5F",
                  color: "#173F5F",
                  "&:hover": { bgcolor: "#173F5F", color: "#fff" },
                }}
              >
                Load More Articles
              </Button>
            </Box>
          </Container>
        </Box>
      </BlogBox>
    </HomeLayout>
  );
}
