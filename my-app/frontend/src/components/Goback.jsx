"use client";

import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

// ROOT WRAPPER
const GobackRoot = styled(Box, {
  name: "MuiGoback",
  slot: "root",
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent:"space-between",
}));

// BACK BUTTON
const GobackButton = styled(Box, {
  name: "MuiGoback",
  slot: "button",
})(({ theme }) => ({
  border: "1px solid",
  background: "#F43755",
  borderRadius: "50%",
  cursor: "pointer",
  height: 40,
  width: 40,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom:"8px",

  "& svg": {
    fontSize: 20,
    color: "#fff",
  },
}));

// TITLE TEXT
const GobackTitle = styled(Typography, {
  name: "MuiGoback",
  slot: "title",
})(({ theme }) => ({
  color: "#000",
  marginLeft: theme.spacing(2),
}));

const Goback = ({ title }) => {
  const router = useRouter();

  return (
    <GobackRoot>
      <GobackButton onClick={() => router.back()}>
        <MdOutlineArrowBackIosNew />
      </GobackButton>
      <GobackTitle variant="h3">{title}</GobackTitle>
    </GobackRoot>
  );
};

export default Goback;
