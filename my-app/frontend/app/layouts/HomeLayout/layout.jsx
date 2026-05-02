"use client";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Footer from "./Footer";
import TopBar from "./Topbar";

// STYLED ROOT BOX
const RootComponent = styled(Box, {
  name: "MuiHomeLayout",
  slot: "root",
})(({ theme }) => ({
  "& .root": {
    backgroundColor: "#FFFFFF",
    backgroundRepeat: "repeat",
    backgroundSize: "100%",
    backgroundPosition: "top",
    position: "relative",
    "& .mainLayout": {
      zIndex: 1,
      position: "relative",
      minHeight: "calc(100vh - 415px)",
    marginTop:"50px",
    },
  },
}));

export default function HomeLayout({ children }) {
  const router = useRouter();

  return (
   
    <RootComponent>
      <div className="root">
        <TopBar />
        <div
          style={
            router.pathname !== "/" ? { display: "block" } : { display: "none" }
          }
        ></div> 
        <div className="mainLayout">{children}</div>
        <Footer />
      </div>
    </RootComponent>
  
    
  );
}
