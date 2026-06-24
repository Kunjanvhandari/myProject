"use client";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Footer from "./Footer";
import TopBar from "./Topbar";

const RootComponent = styled(Box)(({ theme }) => ({
  "& .root": {
    backgroundColor: "#F7F5F0",
    position: "relative",
    minHeight: "100vh",
    "& .mainLayout": {
      zIndex: 1,
      position: "relative",
      minHeight: "calc(100vh - 415px)",
    },
  },
}));

export default function HomeLayout({ children }) {
  return (
    <RootComponent>
      <div className="root">
        <TopBar />
        <div className="mainLayout">{children}</div>
        <Footer />
      </div>
    </RootComponent>
  );
}
