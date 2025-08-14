import React from "react";
import { useLocation } from "react-router-dom";
import CasesList from "../case-list/CasesList";
import { Box, Typography } from "@mui/material";

const CasesPage = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const statusFilter = urlParams.get("status");

  return (
    <Box
      sx={{
        padding: "24px",
        width: "95%",
        maxWidth: "1600px",
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={600}>
          Cases
        </Typography>
      </Box>
      <CasesList statusFilter={statusFilter} />
    </Box>
  );
};

export default CasesPage;
