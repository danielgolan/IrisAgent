import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { enhancedSearchCases, highlightMatch } from "../utils/searchUtils";
import { sampleCases } from "../sample-data/sampleCases";
import { useNavigate, useLocation } from "react-router-dom";
import "./CasesList.css";

const CasesList = ({ externalQuery, statusFilter, hideSearch = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get query from URL parameters
  const urlParams = new URLSearchParams(location.search);
  const urlQuery = urlParams.get("q") || "";

  // State management
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [localStatusFilter, setLocalStatusFilter] = useState("");
  const [insuranceFilter, setInsuranceFilter] = useState("");

  // Determine effective filters
  const effectiveStatusFilter = statusFilter || urlParams.get("status");

  // Only fallback to external query if no URL query and no local search term
  const query =
    searchTerm || (externalQuery !== undefined ? externalQuery : "");

  // Generate filter options
  const insuranceCompanies = useMemo(() => {
    const companies = [
      ...new Set(
        sampleCases
          .map((c) => c.insuranceInformation?.insuranceProvider?.name)
          .filter(Boolean)
      ),
    ];
    return companies.sort();
  }, []);

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(sampleCases.map((c) => c.status))];
    return statuses.sort();
  }, []);

  // URL synchronization effects
  useEffect(() => {
    if (urlQuery !== searchTerm) {
      setSearchTerm(urlQuery);
    }
  }, [urlQuery]);

  const clearSearch = () => {
    setSearchTerm("");
    const newParams = new URLSearchParams(location.search);
    newParams.delete("q");
    const newSearch = newParams.toString();
    navigate(`/cases${newSearch ? `?${newSearch}` : ""}`);
  };

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
  };

  // Debounced URL update
  useEffect(() => {
    if (searchTerm === urlQuery) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const newParams = new URLSearchParams(location.search);
      if (searchTerm.trim()) {
        newParams.set("q", searchTerm.trim());
      } else {
        newParams.delete("q");
      }
      const newSearch = newParams.toString();
      const newPath = `/cases${newSearch ? `?${newSearch}` : ""}`;

      const currentPath = location.pathname + (location.search || "");
      if (currentPath !== newPath) {
        navigate(newPath, { replace: true });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, urlQuery, location.search, location.pathname, navigate]);

  // Filter cases
  const filteredCases = useMemo(() => {
    let base = enhancedSearchCases(sampleCases, query);

    if (effectiveStatusFilter) {
      base = base.filter((c) => c.status === effectiveStatusFilter);
    } else if (localStatusFilter) {
      base = base.filter((c) => c.status === localStatusFilter);
    }

    if (insuranceFilter) {
      base = base.filter(
        (c) =>
          c.insuranceInformation?.insuranceProvider?.name === insuranceFilter
      );
    }

    return base;
  }, [query, effectiveStatusFilter, localStatusFilter, insuranceFilter]);

  return (
    <Box>
      {!hideSearch ? (
        <Paper sx={{ borderRadius: "8px", overflow: "hidden" }}>
          {/* Search and Filter Section */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #e0e0e0",
              backgroundColor: "#f8fafc",
            }}
          >
            {/* Search and Filter Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
              <TextField
                placeholder="Search case number, license plate, make, model, or workshop..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  flex: 1,
                  maxWidth: "500px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    "&:hover": {
                      border: "1px solid #cbd5e1",
                    },
                    "&.Mui-focused": {
                      border: "2px solid #3b82f6",
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputBase-input": {
                    padding: "12px 14px",
                    fontSize: "14px",
                    fontWeight: 500,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#64748b", fontSize: "20px" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={clearSearch}
                        edge="end"
                        size="small"
                        sx={{
                          color: "#64748b",
                          "&:hover": {
                            color: "#475569",
                            backgroundColor: "#f1f5f9",
                          },
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#64748b",
                    "&.Mui-focused": {
                      color: "#3b82f6",
                    },
                  }}
                >
                  Insurance Company
                </InputLabel>
                <Select
                  value={insuranceFilter}
                  label="Insurance Company"
                  onChange={(e) => setInsuranceFilter(e.target.value)}
                  size="small"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #e2e8f0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #cbd5e1",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "2px solid #3b82f6",
                    },
                    "& .MuiSelect-select": {
                      padding: "12px 14px",
                      fontSize: "14px",
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem
                    value=""
                    sx={{
                      fontSize: "14px",
                      fontStyle: "italic",
                      color: "#64748b",
                    }}
                  >
                    All Companies
                  </MenuItem>
                  {insuranceCompanies.map((company) => (
                    <MenuItem
                      key={company}
                      value={company}
                      sx={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      {company}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#64748b",
                    "&.Mui-focused": {
                      color: "#3b82f6",
                    },
                  }}
                >
                  Status
                </InputLabel>
                <Select
                  value={effectiveStatusFilter || localStatusFilter}
                  label="Status"
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (effectiveStatusFilter) {
                      const newParams = new URLSearchParams(location.search);
                      if (newValue) {
                        newParams.set("status", newValue);
                      } else {
                        newParams.delete("status");
                      }
                      const newSearch = newParams.toString();
                      navigate(`/cases${newSearch ? `?${newSearch}` : ""}`);
                    } else {
                      setLocalStatusFilter(newValue);
                    }
                  }}
                  size="small"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #e2e8f0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #cbd5e1",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "2px solid #3b82f6",
                    },
                    "& .MuiSelect-select": {
                      padding: "12px 14px",
                      fontSize: "14px",
                      fontWeight: 500,
                    },
                  }}
                >
                  <MenuItem
                    value=""
                    sx={{
                      fontSize: "14px",
                      fontStyle: "italic",
                      color: "#64748b",
                    }}
                  >
                    All Statuses
                  </MenuItem>
                  {statusOptions.map((status) => (
                    <MenuItem
                      key={status}
                      value={status}
                      sx={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Active Filters and Search Results */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {/* Active Filters */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {effectiveStatusFilter && (
                  <Chip
                    label={`Status: ${effectiveStatusFilter}`}
                    onDelete={() => {
                      const newParams = new URLSearchParams(location.search);
                      newParams.delete("status");
                      const newSearch = newParams.toString();
                      navigate(`/cases${newSearch ? `?${newSearch}` : ""}`);
                    }}
                    size="small"
                    sx={{
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "12px",
                      height: "28px",
                      border: "1px solid #bfdbfe",
                    }}
                  />
                )}
                {localStatusFilter && !effectiveStatusFilter && (
                  <Chip
                    label={`Status: ${localStatusFilter}`}
                    onDelete={() => setLocalStatusFilter("")}
                    size="small"
                    sx={{
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "12px",
                      height: "28px",
                      border: "1px solid #bfdbfe",
                    }}
                  />
                )}
                {insuranceFilter && (
                  <Chip
                    label={`Insurance: ${insuranceFilter}`}
                    onDelete={() => setInsuranceFilter("")}
                    size="small"
                    sx={{
                      backgroundColor: "#f3e8ff",
                      color: "#7c3aed",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "12px",
                      height: "28px",
                      border: "1px solid #ddd6fe",
                    }}
                  />
                )}
              </Box>

              {/* Search Results Count */}
              {query && query.trim().length >= 2 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "14px" }}
                >
                  Found <strong>{filteredCases.length}</strong> result
                  {filteredCases.length !== 1 ? "s" : ""} for "{query}"
                </Typography>
              )}
            </Box>
          </Box>

          {/* Table Section */}
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "12%" }}>Case Number</TableCell>
                <TableCell sx={{ width: "12%" }}>LICENSE PLATE</TableCell>
                <TableCell sx={{ width: "15%" }}>VEHICLE</TableCell>
                <TableCell sx={{ width: "20%" }}>WORKSHOP</TableCell>
                <TableCell sx={{ width: "18%" }}>ORGANIZATION</TableCell>
                <TableCell sx={{ width: "13%" }}>INCIDENT DATE</TableCell>
                <TableCell sx={{ width: "10%" }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCases.map((caseItem) => {
                return (
                  <TableRow
                    key={caseItem.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                    onClick={() => navigate(`/case/${caseItem.id}`)}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        className="search-highlight"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(caseItem.caseNumber, query),
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        className="search-highlight"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(
                            caseItem.vehicle?.vehicleLicenseNumber,
                            query
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Box className="search-highlight">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(
                              caseItem.vehicle?.brandName,
                              query
                            ),
                          }}
                        />{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(
                              caseItem.vehicle?.model,
                              query
                            ),
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        className="search-highlight"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(
                            caseItem.workshop?.name,
                            query
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        className="search-highlight"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(
                            caseItem.caseWorker?.organizationName,
                            query
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {caseItem.dateOfIncident
                        ? new Date(caseItem.dateOfIncident).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Chip
                        label={caseItem.status}
                        size="small"
                        sx={{
                          backgroundColor:
                            caseItem.status === "InvoiceApproved"
                              ? "#e8f5e9"
                              : caseItem.status === "Failed"
                              ? "#ffebee"
                              : "#fff3e0",
                          color:
                            caseItem.status === "InvoiceApproved"
                              ? "#2e7d32"
                              : caseItem.status === "Failed"
                              ? "#d32f2f"
                              : "#f57c00",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: "8px", width: "100%" }}
        >
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "12%" }}>Case Number</TableCell>
                <TableCell sx={{ width: "12%" }}>LICENSE PLATE</TableCell>
                <TableCell sx={{ width: "15%" }}>VEHICLE</TableCell>
                <TableCell sx={{ width: "20%" }}>WORKSHOP</TableCell>
                <TableCell sx={{ width: "18%" }}>ORGANIZATION</TableCell>
                <TableCell sx={{ width: "13%" }}>INCIDENT DATE</TableCell>
                <TableCell sx={{ width: "10%" }}>STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCases.map((caseItem) => {
                return (
                  <TableRow
                    key={caseItem.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                    onClick={() => navigate(`/case/${caseItem.id}`)}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        className="search-highlight"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(caseItem.caseNumber, query),
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        className="search-highlight"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(
                            caseItem.vehicle?.vehicleLicenseNumber,
                            query
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Box className="search-highlight">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(
                              caseItem.vehicle?.brandName,
                              query
                            ),
                          }}
                        />{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(
                              caseItem.vehicle?.model,
                              query
                            ),
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        className="search-highlight"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(
                            caseItem.workshop?.name,
                            query
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        className="search-highlight"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(
                            caseItem.caseWorker?.organizationName,
                            query
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {caseItem.dateOfIncident
                        ? new Date(caseItem.dateOfIncident).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Chip
                        label={caseItem.status}
                        size="small"
                        sx={{
                          backgroundColor:
                            caseItem.status === "InvoiceApproved"
                              ? "#e8f5e9"
                              : caseItem.status === "Failed"
                              ? "#ffebee"
                              : "#fff3e0",
                          color:
                            caseItem.status === "InvoiceApproved"
                              ? "#2e7d32"
                              : caseItem.status === "Failed"
                              ? "#d32f2f"
                              : "#f57c00",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CasesList;
