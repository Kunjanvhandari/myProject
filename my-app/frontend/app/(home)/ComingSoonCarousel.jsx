"use client";
import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import styled from "@emotion/styled";
import { HiOutlineArrowRight } from "react-icons/hi";

// Main section wrapper to provide vertical padding
const SectionWrapper = styled(Box)({
  padding: "100px 0",
  backgroundColor: "#fff",
});

// The gray banner box with fixed height
const BannerBox = styled(Box)({
  backgroundColor: "#D1D5DB", // Exact gray from your image
  height: "300px",
  width: "100%",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
});

// The Student Image - Positioned absolute to "pop out" of the box
const StudentImage = styled("img")({
  position: "absolute",
  left: "30px",
  bottom: "0",
  height: "280px", // Taller than BannerBox to create overlap
  zIndex: 2,
  "@media (max-width: 960px)": {
    display: "none",
  },
});

// The Books Image - Positioned absolute on the right
const BooksImage = styled("img")({
  position: "absolute",
  right: "0",
  top: "50%",
  transform: "translateY(-50%)",
  height: "180px",
  zIndex: 1,
  "@media (max-width: 560px)": {
    height: "180px",
    opacity: 0.5,
  },
});

const ContentWrapper = styled(Box)({
  textAlign: "center",
  maxWidth: "500px",
  zIndex: 3,
  padding: "0 20px",
});

const StyledButton = styled(Button)({
  marginTop: "20px",
  padding: "10px 25px",
  borderRadius: "8px",
  border: "1px solid #173F5F",
  color: "#173F5F",
  fontSize: "13px",
  fontWeight: "600",
  textTransform: "uppercase",
  "&:hover": {
    backgroundColor: "rgba(23, 63, 95, 0.05)",
    border: "1px solid #173F5F",
  },
});

const PaginationWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  marginTop: "40px",
});

const ActiveDot = styled(Box)({
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  border: "1px solid #F43755",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&::after": {
    content: '""',
    width: "10px",
    height: "10px",
    backgroundColor: "#F43755",
    borderRadius: "50%",
  },
});

const InactiveDot = styled(Box)({
  width: "10px",
  height: "10px",
  backgroundColor: "#C4C4C4",
  borderRadius: "50%",
  cursor: "pointer",
});

export default function ComingSoonCarousel() {
  return (
    <SectionWrapper>
      <Container maxWidth="lg">
        {/* Banner Container */}
        <BannerBox>
          {/* Left Side Image (Overlap) */}
          <StudentImage 
            src="/images/footer/book6.svg" // Ensure this image has a transparent background
            alt="Student" 
          />

          {/* Center Content */}
          <ContentWrapper>
            <Typography 
              variant="h3" 
              sx={{ color: "#173F5F", fontWeight: 700, mb: 2 }}
            >
              New Collection Coming Soon
            </Typography>
            <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.6 }}>
              We are adding 500+ new titles to our collection next month. From bestselling fiction 
              to academic textbooks, there will be something for every reader. Stay tuned!
            </Typography>
            <StyledButton endIcon={<HiOutlineArrowRight />}>
              View Preview
            </StyledButton>
          </ContentWrapper>

          {/* Right Side Image (Overlap) */}
          <BooksImage 
            src="/images/footer/book5.svg" 
            alt="New Books" 
          />
        </BannerBox>

        {/* Custom Pagination */}
        <PaginationWrapper>
          <ActiveDot />
          <InactiveDot />
          <InactiveDot />
          <InactiveDot />
        </PaginationWrapper>
      </Container>
    </SectionWrapper>
  );
}