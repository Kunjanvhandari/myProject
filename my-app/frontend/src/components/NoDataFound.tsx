"use client";

import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

const NoDataRoot = styled(Box, {
  name: "MuiNoDataFound",
  slot: "root",
})(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const NoDataContent = styled(Box, {
  name: "MuiNoDataFound",
  slot: "content",
})(({ theme }) => ({
  textAlign: "center",
}));

const NoDataText = styled(Typography, {
  name: "MuiNoDataFound",
  slot: "text",
})(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.text.primary,
  fontFamily: "Gilroy-Medium",
}));

export default function NoDataFound({ text = "No Data Found" }) {
  return (
    <NoDataRoot>
      <NoDataContent>
        <Image
          src="/images/404.png"
          alt="No Data Found"
          width={100}
          height={20}
        />
        <NoDataText variant="body2">{text}</NoDataText>
      </NoDataContent>
    </NoDataRoot>
  );
}
