import React, { useState, useEffect } from "react";
import CasesList from "../case-list/CasesList";
import { Box, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";

const SearchComponent = () => {
  const [vrn, setVrn] = useState("");
  const location = useLocation();

  // Extract VRN from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vrnParam = params.get("vrn");
    if (vrnParam) {
      setVrn(vrnParam);
    }
  }, [location.search]);

  return (
    <Box sx={{ padding: 3 }}>
      <TextField
        label="Search Exact VRN..."
        variant="outlined"
        value={vrn}
        onChange={(e) => setVrn(e.target.value)}
        sx={{
          width: "100%",
          maxWidth: 500,
          marginBottom: 3,
          background: "white",
        }}
      />
      <CasesList externalQuery={vrn} hideSearch={true} />
    </Box>
  );
};

export default SearchComponent;
