"use client";

import { Box, styled } from "@mui/material";

// ---------- STYLED COMPONENT ----------
const MainComponent = styled(Box)(({ theme }) => ({
  "& .loginLayoutBox": {
    background: `url("/images/loginLayout/loginBackground.jpg")`,
    width: "100%",
    backgroundSize: "cover !important",
    backgroundRepeat: "no-repeat !important",
    objectFit: "cover !important",
    
    "& .contentContainer1": {
      height: "100vh",
      position: "relative",
    },

    "& .MainLayout": {
      height: "100vh",
      position: "relative",
    },
  },
}));

// ---------- FUNCTION COMPONENT ----------
export default function LoginLayout({ children }) {
  return (
    <MainComponent>
      <Box className="loginLayoutBox">
        <Box className="contentContainer1">
          <Box className="MainLayout">{children}</Box>
        </Box>
      </Box>
    </MainComponent>
  );
}
