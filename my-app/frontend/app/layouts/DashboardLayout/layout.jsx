"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import NavBar from "./NavBar";
import TopBar from "./TopBar";

// ROOT CONTAINER
const RootContainer = styled(Box, {
  name: "MuiDashboardLayout",
  slot: "root",
})(({ theme }) => ({
  position: "relative",
  height: "100vh",
  display: "flex",
  flexDirection: "column",

  "& .wrapper1": {
    display: "flex",
    flex: 1,
    overflow: "hidden",
    backgroundSize: "cover",
    paddingTop: 70,
    minHeight: "100vh",
    position: "relative",
    backgroundColor:"#F5F5F5",

    // Desktop Sidebar Space
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 256,
    },

    // Mobile adjustments
    [theme.breakpoints.down("sm")]: {
      paddingTop: "70px !important",
    },
  },
}));

// MIDDLE WRAPPER
const WrapperContainer = styled(Box)({
  display: "flex",
  flex: 1,
  overflow: "hidden",
});

// MAIN CONTENT
const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  height: "100%",
  overflowY: "auto",
  position: "relative",
  padding: "28px 24px 25px",

  [theme.breakpoints.down("md")]: {
    padding: "33px 30px 30px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "12px",
  },
}));

export default function DashboardLayout({ children }) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <RootContainer>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />

      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />

      <div className="wrapper1">
        <WrapperContainer>
          <ContentContainer id="main-scroll">
            {children}

            {/* SHADE BOX (UNCHANGED) */}
            <Box className="DashboardShadeBox loginShadeDashBox" />
          </ContentContainer>
        </WrapperContainer>
      </div>
    </RootContainer>
  );
}
