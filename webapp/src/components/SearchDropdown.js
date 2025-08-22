import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getSearchSuggestions } from "../utils/searchUtils";

const SearchDropdown = ({
  placeholder = "Search cases... (try: 'status:failed', 'insurance:if', 'BMW', case numbers, etc.)",
  onSearchExecute,
  autoFocus = false,
  sx = {},
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update suggestions when query changes
  useEffect(() => {
    if (query.length > 1) {
      const searchSuggestions = getSearchSuggestions(query);
      setSuggestions(searchSuggestions);
      setShowSuggestions(searchSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

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
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    // Auto-execute search when clicking a suggestion
    if (onSearchExecute) {
      onSearchExecute({ query: suggestion.text });
    } else {
      navigate(`/?q=${encodeURIComponent(suggestion.text)}`);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
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
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
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

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            mt: 1,
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            border: "1px solid #e2e8f0",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <List sx={{ py: 0 }}>
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  py: 1.5,
                  px: 2,
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                  borderBottom:
                    index < suggestions.length - 1
                      ? "1px solid #f1f5f9"
                      : "none",
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {suggestion.display}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      {suggestion.text}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchDropdown;
