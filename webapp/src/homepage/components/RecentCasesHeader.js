import React from "react";
import { TableHead, TableRow, TableCell } from "@mui/material";

const tableHeaderStyle = {
  fontWeight: 600,
  fontSize: "0.65rem" /* even smaller header font */,
  color: "text.secondary",
  textTransform: "uppercase",
};

const RecentCasesHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell sx={tableHeaderStyle}>Agent</TableCell>
      <TableCell sx={tableHeaderStyle}>Case Number</TableCell>
      <TableCell sx={tableHeaderStyle}>VRN</TableCell>
      <TableCell sx={tableHeaderStyle}>Workshop</TableCell>
      <TableCell sx={tableHeaderStyle}>Insurance</TableCell>
      <TableCell sx={tableHeaderStyle}>Job Type</TableCell>
      <TableCell sx={tableHeaderStyle}>Steps</TableCell>
      <TableCell sx={tableHeaderStyle}>Status</TableCell>
    </TableRow>
  </TableHead>
);

export default RecentCasesHeader;
