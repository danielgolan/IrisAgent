import React, { useState } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SearchDropdown = ({
  placeholder = "Search cases... (case number, license plate, make, model, workshop - press Enter)",
  onSearchExecute,
  autoFocus = false,
  sx = {},
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (query.trim()) {
      // If onSearchExecute callback is provided, use it
      if (onSearchExecute) {
        onSearchExecute({ query: query.trim() });
      } else {
        // Otherwise, navigate directly to cases page with search query
        navigate(`/cases?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleClearSearch = () => {
    setQuery("");
  };

  return (
    <Box sx={{ position: "relative", width: "100%", ...sx }}>
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{ width: "100%" }}
      >
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          fullWidth
          sx={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "32px" /* reduced from 40px */,
            boxShadow: "0 4px 16px -4px rgba(0,0,0,0.2)" /* reduced shadow */,
            transition: "box-shadow .2s ease",
            "&:hover": {
              boxShadow:
                "0 6px 20px -4px rgba(0,0,0,0.25)" /* reduced shadow */,
            },
            "&:focus-within": {
              boxShadow:
                "0 6px 20px -4px rgba(25, 118, 210, 0.3)" /* reduced shadow */,
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "32px" /* reduced from 40px */,
              height: 48 /* reduced from 64px */,
              fontSize: 16 /* reduced from 18px */,
              px: 2.5 /* reduced padding */,
              fontWeight: 500,
              "& fieldset": {
                border: "none",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {query && (
                  <Box
                    component="button"
                    type="button"
                    onClick={handleClearSearch}
                    sx={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      width: 20 /* reduced from 24 */,
                      height: 20 /* reduced from 24 */,
                      mr: 1,
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    <ClearIcon fontSize="small" color="action" />
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.05)",
                    borderRadius: "6px" /* reduced from 8px */,
                    px: 0.8 /* reduced padding */,
                    py: 0.3 /* reduced padding */,
                    fontSize: "0.7rem" /* reduced from 0.75rem */,
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  ⏎
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default SearchDropdown;
