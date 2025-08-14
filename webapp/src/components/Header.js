import React from "react";
import { Box, Container } from "@mui/material";
import SearchDropdown from "./SearchDropdown";
import "./Header.css";

const Header = ({ onSearchExecute }) => {
  return (
    <Box className="app-header">
      <Container maxWidth="xl">
        <Box className="header-search-container">
          <SearchDropdown
            placeholder="Search case number, license plate, make, model, or workshop... (press Enter)"
            onSearchExecute={onSearchExecute}
            autoFocus
            sx={{
              maxWidth: 720,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
