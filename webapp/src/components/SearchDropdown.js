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
            borderRadius: "40px",
            boxShadow: "0 8px 32px -8px rgba(0,0,0,0.2)",
            transition: "box-shadow .2s ease",
            "&:hover": {
              boxShadow: "0 12px 40px -8px rgba(0,0,0,0.25)",
            },
            "&:focus-within": {
              boxShadow: "0 12px 40px -8px rgba(25, 118, 210, 0.3)",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "40px",
              height: 64,
              fontSize: 18,
              px: 3,
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
                      width: 24,
                      height: 24,
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
                    borderRadius: "8px",
                    px: 1,
                    py: 0.5,
                    fontSize: "0.75rem",
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
