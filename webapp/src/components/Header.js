import React from "react";
import { Box } from "@mui/material";
import SearchDropdown from "./SearchDropdown";
import "./Header.css";

const Header = ({ onSearchExecute }) => {
  return (
    <Box className="app-header">
      <Box className="header-search-container">
        <SearchDropdown
          placeholder="Search case number, license plate, make, model, or workshop... (press Enter)"
          onSearchExecute={onSearchExecute}
          autoFocus
          sx={{
            width: "100%",
          }}
        />
      </Box>
    </Box>
  );
};

export default Header;
