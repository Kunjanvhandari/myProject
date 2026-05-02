"use client";
import {
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// STYLED ROOT BOX
const DescriptionBox = styled(Box, {
  name: "MuiActivityTable",
  slot: "root",
})(({ theme }) => ({
  "& .activitytableBox": {
    position: "relative",
    "& .MuiTableCell-root": {
      padding: theme.spacing(2),
      textAlign: "center",
    },
    "& .lastRow": {
      borderBottom: "none",
    },
  },
  "& .MuiTableHead-root .MuiTableCell-root": {
    fontWeight: 600,
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));

const tabledata = [
  {
    Size: "Listed",
    Price: "0.01 USDT",
    Size1: "0x769A9A21610AC5",
    Price1: "--",
    date: "05-July-2023",
  },
  {
    Size: "Buy",
    Price: "0.01 USDT",
    Size1: "--",
    Price1: "0x769A9A21610",
    date: "09-July-2023",
  },
];

const ActivityTable = () => {
  return (
    <DescriptionBox>
      <Box className="activitytableBox">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "start" }}>Event</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tabledata.map((row, index) => (
                <TableRow
                  key={index}
                  className={index === tabledata.length - 1 ? "lastRow" : ""}
                >
                  <TableCell sx={{ textAlign: "start" }}>{row.Size}</TableCell>
                  <TableCell>{row.Price}</TableCell>
                  <TableCell>{row.Size1}</TableCell>
                  <TableCell>{row.Price1}</TableCell>
                  <TableCell>{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DescriptionBox>
  );
};

export default ActivityTable;
