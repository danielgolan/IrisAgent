import React, { useMemo } from "react";
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  enhancedSearchCases,
  highlightMatch,
  parseSearchQuery,
} from "../utils/searchUtils";
import { getStatusCounts, sampleCases } from "../sample-data/sampleCases";
import Header from "../components/Header";
import StatusChip from "../components/StatusChip";
import "./HomePage.css";

// Enhanced Status Cards with Selection State
const StatusCardsGrid = ({ counts, selectedStatus, onStatusClick }) => {
  const statusCards = [
    {
      label: "For Approval",
      value: counts["For Approval"],
      status: "For Approval",
    },
    {
      label: "Invoice Control",
      value: counts["Invoice Control"],
      status: "Invoice Control",
    },
    {
      label: "Failed",
      value: counts["Failed"],
      status: "Failed",
    },
    {
      label: "On Hold",
      value: counts["On Hold"],
      status: "On Hold",
    },
  ];

  return (
    <Box className="modern-status-cards" sx={{ mb: 3 }}>
      {statusCards.map((card) => (
        <Box
          key={card.status}
          className={`status-card ${
            selectedStatus === card.status ? "selected" : ""
          }`}
          onClick={() => onStatusClick(card.status)}
          sx={{
            cursor: "pointer",
            transition: "all 0.2s ease",
            border:
              selectedStatus === card.status
                ? "2px solid #1976d2"
                : "1px solid #e2e8f0",
            backgroundColor:
              selectedStatus === card.status ? "#f3f8ff" : "white",
            "&:hover": {
              borderColor: "#1976d2",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            {card.value}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#64748b", fontWeight: 500 }}
          >
            {card.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const UnifiedHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get query parameters
  const urlParams = new URLSearchParams(location.search);
  const searchQuery = urlParams.get("q") || "";
  const statusParam = urlParams.get("status") || "";

  // State management (remove unused currentSearch)
  // const [currentSearch, setCurrentSearch] = useState(searchQuery);

  // Parse the search query to extract filters
  const { filters } = parseSearchQuery(searchQuery);
  const selectedStatus = statusParam || filters.status || "";

  // Memoized data
  const counts = useMemo(() => getStatusCounts(), []);

  // Filter and search cases
  const filteredCases = useMemo(() => {
    let cases = sampleCases;

    // Apply search if present
    if (searchQuery && searchQuery.trim().length >= 2) {
      cases = enhancedSearchCases(cases, searchQuery);
    }

    // Apply status filter from URL parameter (takes precedence)
    if (statusParam) {
      cases = cases.filter((c) => c.status === statusParam);
    }

    return cases;
  }, [searchQuery, statusParam]);

  // Handle status card clicks
  const handleStatusClick = (status) => {
    const newParams = new URLSearchParams(location.search);

    if (selectedStatus === status) {
      // If clicking the same status, remove the filter
      newParams.delete("status");
    } else {
      // Set the new status filter
      newParams.set("status", status);
    }

    const newSearch = newParams.toString();
    navigate(`/${newSearch ? `?${newSearch}` : ""}`);
  };

  // Handle case click
  const handleCaseClick = (caseId) => {
    navigate(`/case/${caseId}`);
  };

  // Handle search execution from header
  const handleSearchExecute = (searchResult) => {
    const newParams = new URLSearchParams();
    newParams.set("q", searchResult.query);
    navigate(`/?${newParams.toString()}`);
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    navigate("/");
  };

  return (
    <>
      <Box sx={{ width: "80%", mx: "auto", p: 0 }}>
        <Header onSearchExecute={handleSearchExecute} />
        {/* Status Cards Section */}
        <StatusCardsGrid
          counts={counts}
          selectedStatus={selectedStatus}
          onStatusClick={handleStatusClick}
        />

        {/* Active Filters and Results Info */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Active Filters */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {selectedStatus && (
              <Chip
                label={`Status: ${selectedStatus}`}
                onDelete={() => handleStatusClick(selectedStatus)}
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
            {filters.insurance && (
              <Chip
                label={`Insurance: ${filters.insurance}`}
                onDelete={handleClearFilters}
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
            {searchQuery && !selectedStatus && !filters.insurance && (
              <Chip
                label={`Search: ${searchQuery}`}
                onDelete={handleClearFilters}
                size="small"
                sx={{
                  backgroundColor: "#fef3c7",
                  color: "#d97706",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "12px",
                  height: "28px",
                  border: "1px solid #fde68a",
                }}
              />
            )}
          </Box>

          {/* Results Count */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "14px" }}
          >
            Showing <strong>{filteredCases.length}</strong> case
            {filteredCases.length !== 1 ? "s" : ""}
            {searchQuery && ` for "${searchQuery}"`}
          </Typography>
        </Box>

        {/* Cases Table - full width */}
        <Paper
          elevation={0}
          sx={{ border: "1px solid #e2e8f0", borderRadius: "12px" }}
        >
          <TableContainer>
            <Table sx={{ tableLayout: "fixed", width: "100%" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell
                    sx={{ width: "12%", fontWeight: 600, color: "#374151" }}
                  >
                    Case Number
                  </TableCell>
                  <TableCell
                    sx={{ width: "12%", fontWeight: 600, color: "#374151" }}
                  >
                    License Plate
                  </TableCell>
                  <TableCell
                    sx={{ width: "15%", fontWeight: 600, color: "#374151" }}
                  >
                    Vehicle
                  </TableCell>
                  <TableCell
                    sx={{ width: "20%", fontWeight: 600, color: "#374151" }}
                  >
                    Workshop
                  </TableCell>
                  <TableCell
                    sx={{ width: "18%", fontWeight: 600, color: "#374151" }}
                  >
                    Organization
                  </TableCell>
                  <TableCell
                    sx={{ width: "8%", fontWeight: 600, color: "#374151" }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{ width: "15%", fontWeight: 600, color: "#374151" }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCases.map((caseItem) => (
                  <TableRow
                    key={caseItem.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f9fafb" },
                      borderBottom: "1px solid #f1f5f9",
                    }}
                    onClick={() => handleCaseClick(caseItem.id)}
                  >
                    <TableCell sx={{ fontWeight: 500, py: 2 }}>
                      <span
                        className="search-highlight"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(
                            caseItem.caseNumber,
                            searchQuery
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <span
                        className="search-highlight"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(
                            caseItem.vehicle?.vehicleLicenseNumber,
                            searchQuery
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Box className="search-highlight">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(
                              caseItem.vehicle?.brandName,
                              searchQuery
                            ),
                          }}
                        />{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(
                              caseItem.vehicle?.model,
                              searchQuery
                            ),
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <span
                        className="search-highlight"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(
                            caseItem.workshop?.name,
                            searchQuery
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <span
                        className="search-highlight"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(
                            caseItem.caseWorker?.organizationName,
                            searchQuery
                          ),
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {caseItem.dateOfIncident
                        ? new Date(caseItem.dateOfIncident).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <StatusChip
                        label={caseItem.status}
                        status={caseItem.status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCases.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{ textAlign: "center", py: 4, color: "#64748b" }}
                    >
                      <Typography variant="body1">
                        No cases found matching your criteria
                      </Typography>
                      {(searchQuery || selectedStatus) && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <span
                            onClick={handleClearFilters}
                            style={{
                              color: "#1976d2",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Clear filters
                          </span>{" "}
                          to see all cases
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
};

export default UnifiedHomePage;
