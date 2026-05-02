"use client";

import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

// ROOT wrapper (slot: root)
const PageLoaderRoot = styled(Box, {
  name: "MuiPageLoader",
  slot: "root",
})(({ theme }) => ({
  position: "relative",
}));

// FULLSCREEN OVERLAY (slot: overlay)
const PageLoaderOverlay = styled(Box, {
  name: "MuiPageLoader",
  slot: "overlay",
})(({ theme }) => ({
  alignItems: "center",
  background: "#161032",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  justifyContent: "center",
  left: 0,
  position: "fixed",
  top: 0,
  width: "100%",
  zIndex: 2000,
}));

// LOADER IMAGE SLOT
const PageLoaderImage = styled("img", {
  name: "MuiPageLoader",
  slot: "loader",
})(({ theme }) => ({
  maxWidth: "100%",
  margin: "auto",
}));

export const PageLoader = () => {
  return (
    <PageLoaderRoot>
      <PageLoaderOverlay>
        <Box align="center">
          <PageLoaderImage src="/images/logo.svg" alt="Loader" />
        </Box>
      </PageLoaderOverlay>
    </PageLoaderRoot>
  );
};
