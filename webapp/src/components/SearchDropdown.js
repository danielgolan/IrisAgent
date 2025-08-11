import React, { useRef, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  History as HistoryIcon,
  Clear as ClearIcon,
  Description as CaseIcon,
  DirectionsCar as PlateIcon,
  Business as InsurerIcon,
  Build as VehicleIcon,
} from "@mui/icons-material";
import { useSearch } from "../hooks/useSearch";
import { useNavigate } from "react-router-dom";
import "../homepage/HomePage.css"; // Import CSS for search dropdown styles

const SearchDropdown = ({
  placeholder = "Search by case number, plate, insurer...",
  onSearchExecute,
  autoFocus = false,
  sx = {},
}) => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const {
    query,
    suggestions,
    isLoading,
    showSuggestions,
    searchHistory,
    selectedSuggestionIndex,
    updateQuery,
    executeSearch,
    clearSearch,
    handleKeyDown,
    setShowSuggestions,
  } = useSearch();

  // Debug suggestions
  useEffect(() => {
    console.log("🔍 Suggestions updated:", suggestions);
    console.log("📊 Suggestions length:", suggestions.length);
    console.log("👁️ Show suggestions:", showSuggestions);
    console.log("🔤 Current query:", query);
  }, [suggestions, showSuggestions, query]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSuggestions]);

  const handleInputFocus = () => {
    if (query.trim() || searchHistory.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    // If there are suggestions available, use the first one
    if (suggestions.length > 0) {
      console.log("✨ Enter pressed - using first suggestion:", suggestions[0]);
      handleSuggestionClick(suggestions[0]);
      return;
    }

    // Otherwise, perform regular search
    const searchResult = executeSearch();
    if (searchResult && onSearchExecute) {
      onSearchExecute(searchResult);
    } else if (searchResult) {
      // Navigate to cases page with search query
      navigate(`/cases?q=${encodeURIComponent(searchResult.query)}`);
    }
  };

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      console.log("🔥 handleSuggestionClick called with:", suggestion);
      console.log("Suggestion type:", typeof suggestion);
      console.log(
        "Full suggestion object:",
        JSON.stringify(suggestion, null, 2)
      );

      // Check if suggestion has case information and navigate directly to case details
      if (
        typeof suggestion === "object" &&
        suggestion.case &&
        suggestion.case.id
      ) {
        console.log("✅ Navigating to case:", suggestion.case.id);
        try {
          // Navigate directly to case details
          navigate(`/case/${suggestion.case.id}`);
          setShowSuggestions(false);
          return;
        } catch (error) {
          console.error("❌ Navigation error:", error);
        }
      }

      console.log("📝 Processing as search query");
      // For string suggestions (history items) or suggestions without case info
      // Use suggestion.label for object suggestions or the string directly for history items
      const searchQuery =
        typeof suggestion === "string" ? suggestion : suggestion.label;
      console.log("🔍 Search query:", searchQuery);

      if (searchQuery) {
        updateQuery(searchQuery);
        const searchResult = executeSearch(searchQuery);
        console.log("📊 Search result:", searchResult);

        if (searchResult && onSearchExecute) {
          console.log("🚀 Calling onSearchExecute");
          onSearchExecute(searchResult);
        } else if (searchResult) {
          console.log("🧭 Navigating to search results");
          navigate(`/cases?q=${encodeURIComponent(searchResult.query)}`);
        }
        setShowSuggestions(false);
      }
    },
    [navigate, setShowSuggestions, updateQuery, executeSearch, onSearchExecute]
  );

  // Memoize the icon function to avoid recreating it on every render
  const getIconForSuggestionType = useCallback((type) => {
    switch (type) {
      case "case":
        return <CaseIcon fontSize="small" color="primary" />;
      case "plate":
        return <PlateIcon fontSize="small" color="secondary" />;
      case "insurer":
        return <InsurerIcon fontSize="small" color="info" />;
      case "vehicle":
        return <VehicleIcon fontSize="small" color="warning" />;
      default:
        return <SearchIcon fontSize="small" color="action" />;
    }
  }, []);

  // Memoize filtered history to avoid recalculating on every render
  const filteredHistory = useMemo(() => {
    return searchHistory.filter(
      (historyItem) =>
        query.trim() === "" ||
        historyItem.toLowerCase().includes(query.toLowerCase())
    );
  }, [searchHistory, query]);

  return (
    <Box
      ref={searchRef}
      className="search-dropdown-container"
      sx={{ position: "relative", width: "100%", zIndex: 999998, ...sx }}
    >
      {" "}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{ width: "100%" }}
      >
        <TextField
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
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
                {isLoading ? (
                  <CircularProgress size={20} color="primary" />
                ) : (
                  <SearchIcon color="action" />
                )}
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <Box
                  component="button"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    clearSearch();
                  }}
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
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <ClearIcon fontSize="small" color="action" />
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {/* Search Dropdown - Simple relative positioning */}
      {showSuggestions &&
        (suggestions.length > 0 || filteredHistory.length > 0) && (
          <Paper
            elevation={8}
            className="search-suggestions-dropdown"
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              mt: 1,
              borderRadius: "20px",
              overflow: "hidden",
              maxHeight: "400px",
              overflowY: "auto",
              zIndex: 999999,
              backdropFilter: "blur(20px)",
              background: "rgba(255,255,255,0.98)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 20px 60px -12px rgba(25, 118, 210, 0.4)",
            }}
          >
            <List sx={{ py: 1 }}>
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <>
                  <ListItem sx={{ py: 0.5, px: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      SUGGESTIONS
                    </Typography>
                  </ListItem>
                  {suggestions.map((suggestion, index) => (
                    <ListItemButton
                      key={`suggestion-${index}`}
                      onClick={(e) => {
                        console.log("🎯 ListItemButton clicked!", e);
                        e.preventDefault();
                        e.stopPropagation();
                        handleSuggestionClick(suggestion);
                      }}
                      onMouseDown={(e) => {
                        console.log(
                          "🖱️ Mouse down on suggestion:",
                          suggestion.label
                        );
                      }}
                      selected={selectedSuggestionIndex === index}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderRadius: "12px",
                        mx: 1,
                        cursor: "pointer",
                        "&.Mui-selected": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.12)",
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{ mr: 1.5, display: "flex", alignItems: "center" }}
                      >
                        {getIconForSuggestionType(suggestion.type)}
                      </Box>
                      <ListItemText
                        primary={suggestion.label}
                        secondary={
                          suggestion.case
                            ? `${suggestion.case.status} • ${suggestion.case.vehicle?.make} ${suggestion.case.vehicle?.model}`
                            : null
                        }
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: "0.95rem",
                        }}
                        secondaryTypographyProps={{
                          fontSize: "0.8rem",
                        }}
                      />
                    </ListItemButton>
                  ))}
                </>
              )}

              {/* Search History */}
              {filteredHistory.length > 0 && suggestions.length > 0 && (
                <Divider sx={{ my: 1 }} />
              )}

              {filteredHistory.length > 0 && (
                <>
                  <ListItem sx={{ py: 0.5, px: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      RECENT SEARCHES
                    </Typography>
                  </ListItem>
                  {filteredHistory.slice(0, 5).map((historyItem, index) => (
                    <ListItemButton
                      key={`history-${index}`}
                      onClick={(e) => {
                        console.log("🎯 History item clicked!", e);
                        e.preventDefault();
                        e.stopPropagation();
                        handleSuggestionClick(historyItem);
                      }}
                      onMouseDown={(e) => {
                        console.log("🖱️ Mouse down on history:", historyItem);
                      }}
                      selected={
                        selectedSuggestionIndex === suggestions.length + index
                      }
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderRadius: "12px",
                        mx: 1,
                        cursor: "pointer",
                        "&.Mui-selected": {
                          backgroundColor: "rgba(25, 118, 210, 0.08)",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.12)",
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{ mr: 1.5, display: "flex", alignItems: "center" }}
                      >
                        <HistoryIcon fontSize="small" color="action" />
                      </Box>
                      <ListItemText
                        primary={historyItem}
                        primaryTypographyProps={{
                          fontWeight: 400,
                          fontSize: "0.95rem",
                        }}
                      />
                    </ListItemButton>
                  ))}
                </>
              )}
            </List>
          </Paper>
        )}
    </Box>
  );
};

export default SearchDropdown;
