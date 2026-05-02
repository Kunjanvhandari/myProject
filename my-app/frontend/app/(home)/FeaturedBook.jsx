"use client";
import React from "react";
import { Box, Typography, Button, Container, Rating } from "@mui/material";
import styled from "@emotion/styled";
import { HiOutlineArrowRight } from "react-icons/hi";

const HeroWrapper = styled(Box)(({ theme }) => ({
  padding: "60px 0",
  background: "#FFFFFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "500px",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "40px",
  alignItems: "center",
  "@media (max-width: 900px)": {
    gridTemplateColumns: "1fr",
    textAlign: "center",
  },
}));

const BookImageWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  "& img": {
    maxWidth: "100%",
    height: "auto",
    boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
  },
});

const StyledButton = styled(Button)({
  marginTop: "30px",
  padding: "12px 30px",
  borderRadius: "8px",
  border: "1px solid #393280",
  color: "#393280",
  textTransform: "uppercase",
  fontWeight: "600",
  fontSize: "14px",
  "&:hover": {
    backgroundColor: "#393280",
    color: "#fff",
  },
});

const FeaturedBook = () => {
  return (
    <HeroWrapper>
      <Container maxWidth="lg">
        <ContentBox>
          {/* Left Side: Book Cover */}
          <BookImageWrapper>
            <img 
              src="/images/footer/book4.svg" // Replace with your actual image path
              alt="Birds gonna be happy" 
            />
          </BookImageWrapper>

          {/* Right Side: Details */}
          <Box>
            <Typography 
              variant="overline" 
              sx={{ color: "#888", fontWeight: "500", letterSpacing: "1px" }}
            >
              Featured Book of the Week
            </Typography>
            
            <Typography 
              variant="h3" 
              sx={{ 
                color: "#173F5F", 
                fontWeight: "700", 
                margin: "10px 0",
                fontSize: { xs: "2rem", md: "3rem" }
              }}
            >
              Atomic Habits
            </Typography>

            <Box display="flex" alignItems="center" sx={{ mb: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
              <Rating name="read-only" value={4} readOnly size="small" />
            </Box>

            <Typography 
              variant="body1" 
              sx={{ color: "#666", lineHeight: "1.8", maxWidth: "500px" }}
            >
              An easy and proven way to build good habits and break bad ones. James Clear reveals 
              practical strategies that will teach you exactly how to form good habits, break bad ones, 
              and master the tiny behaviors that lead to remarkable results. Available now at LibriVista.
            </Typography>

            <StyledButton 
              endIcon={<HiOutlineArrowRight />}
              onClick={() => console.log("Navigate to details")}
            >
              View More
            </StyledButton>
          </Box>
        </ContentBox>
      </Container>
    </HeroWrapper>
  );
};

export default FeaturedBook;