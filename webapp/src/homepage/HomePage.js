import React, { useMemo } from "react";
import "./HomePage.css";
import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PaidIcon from "@mui/icons-material/Paid";
import { getStatusCounts, sampleCases } from "../sample-data/sampleCases";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

// Constants for status options (copied from CaseDetails)
const STATUS_OPTIONS = [
  { value: "Open", label: "Open", color: "info" },
  { value: "Pending Approval", label: "Pending Approval", color: "warning" },
  { value: "Invoice Flow", label: "Waiting Invoice", color: "info" },
  { value: "Waiting Payment", label: "Waiting Payment", color: "primary" },
  { value: "Failed", label: "Failed", color: "error" },
  { value: "Completed", label: "Completed", color: "success" },
];

// Utility functions

// Calculate completion steps based on status fields
const calculateSteps = (caseItem) => {
  const statusFields = [
    caseItem.coverageStatus,
    caseItem.imagesStatus,
    caseItem.orderStatus,
    caseItem.invoiceStatus,
    caseItem.orderLinesStatus,
    caseItem.damageFormSignatureStatus,
    caseItem.adasStatus,
  ];

  const totalSteps = statusFields.length;
  const completedSteps = statusFields.filter(
    (status) =>
      status === "Approved" ||
      status === "SignedByCustomer" ||
      status === "NotRequired" ||
      status === "Completed"
  ).length;

  return { completedSteps, totalSteps };
};

// Map case status to display status
const mapCaseStatusToDisplay = (caseStatus) => {
  switch (caseStatus) {
    case "InvoiceApproved":
      return "Completed";
    case "ReadyForApproval":
      return "Pending Approval";
    case "Failed":
      return "Failed";
    default:
      return "Open";
  }
};

const StatusCard = ({ label, value, icon, selected, onClick }) => (
  <Paper
    onClick={onClick}
    className={`status-card ${selected ? "selected" : ""}`}
    elevation={0}
    sx={{
      "&:hover": {
        boxShadow: "0 12px 40px -12px rgba(0,0,0,0.18)",
      },
      "&:focus": {
        outline: "2px solid #1976d2",
        outlineOffset: "2px",
      },
    }}
    tabIndex={0}
    role="button"
    aria-pressed={selected}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <Box
      className="status-card-icon"
      sx={{ color: selected ? "#1976d2" : "text.secondary" }}
    >
      {icon}
    </Box>
    <Box className="status-card-content">
      <Typography variant="h5" className="status-card-value">
        {value}
      </Typography>
      <Typography variant="body2" className="status-card-label">
        {label}
      </Typography>
    </Box>
  </Paper>
);

const HomePage = () => {
  const navigate = useNavigate();

  const counts = useMemo(() => getStatusCounts(), []);

  const recentCases = useMemo(() => {
    return [...sampleCases]
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
      .slice(0, 10);
  }, []);

  const toggleStatus = (status) => {
    // Navigate to cases page with status filter
    navigate(`/cases?status=${encodeURIComponent(status)}`);
  };

  const handleSearchExecute = (searchResult) => {
    // Navigate to cases page with search results
    navigate(`/cases?q=${encodeURIComponent(searchResult.query)}`);
  };

  return (
    <>
      <Header onSearchExecute={handleSearchExecute} />
      <Container maxWidth="xl" className="homepage-root">
        {/* Status Cards */}
        <div className="modern-status-cards">
          <StatusCard
            label="Pending Approval"
            value={counts["Pending Approval"]}
            icon={<DescriptionIcon />}
            selected={false}
            onClick={() => toggleStatus("Pending Approval")}
          />
          <StatusCard
            label="Open Cases"
            value={counts["Open"]}
            icon={<WarningAmberIcon />}
            selected={false}
            onClick={() => toggleStatus("Open")}
          />
          <StatusCard
            label="Failed Cases"
            value={counts["Failed"]}
            icon={<AssignmentTurnedInIcon />}
            selected={false}
            onClick={() => toggleStatus("Failed")}
          />
          <StatusCard
            label="Completed"
            value={counts["Completed"]}
            icon={<PaidIcon />}
            selected={false}
            onClick={() => toggleStatus("Completed")}
          />
        </div>

        {/* Recent Cases */}
        <Box className="modern-recent-cases">
          <Paper className="recent-cases-card" elevation={0}>
            <Box className="recent-cases-header">
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Recent Cases
              </Typography>
            </Box>

            {/* Enhanced Cases Table */}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      Agent
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      Case Number
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      VRN
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      Workshop
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      Insurance
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      Job Type
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      Steps
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        textTransform: "uppercase",
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentCases.map((caseItem) => {
                    const { completedSteps, totalSteps } =
                      calculateSteps(caseItem);
                    const progressPercentage =
                      (completedSteps / totalSteps) * 100;
                    const displayStatus = mapCaseStatusToDisplay(
                      caseItem.status
                    );

                    return (
                      <TableRow
                        key={caseItem.id}
                        onClick={() => navigate(`/case/${caseItem.id}`)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.04)",
                          },
                          height: 56,
                        }}
                      >
                        <TableCell>
                          <Avatar
                            sx={{ width: 32, height: 32, fontSize: "0.8rem" }}
                          >
                            {caseItem.caseWorker?.name
                              ? caseItem.caseWorker.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "?"}
                          </Avatar>
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: "primary.main",
                            }}
                          >
                            {caseItem.caseNumber}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                          >
                            {caseItem.vehicle?.vehicleLicenseNumber}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                          >
                            {caseItem.caseWorker?.organizationName}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                          >
                            {
                              caseItem.insuranceInformation?.insuranceProvider
                                ?.name
                            }
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem", fontWeight: 500 }}
                          >
                            {caseItem.jobType}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box sx={{ minWidth: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={progressPercentage}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: "grey.200",
                                }}
                                color={
                                  progressPercentage === 100
                                    ? "success"
                                    : "primary"
                                }
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{ fontSize: "0.7rem", minWidth: 35 }}
                            >
                              {completedSteps}/{totalSteps}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select
                              value={displayStatus}
                              size="small"
                              onClick={(e) => e.stopPropagation()}
                              displayEmpty
                              sx={{
                                fontSize: "0.75rem",
                                height: 32,
                                borderRadius: "16px",
                                backgroundColor: "transparent",
                                "& .MuiSelect-select": {
                                  padding: "6px 12px",
                                  borderRadius: "16px",
                                  backgroundColor: (() => {
                                    const option = STATUS_OPTIONS.find(
                                      (opt) => opt.value === displayStatus
                                    );
                                    switch (option?.color) {
                                      case "success":
                                        return "rgba(76, 175, 80, 0.08)";
                                      case "warning":
                                        return "rgba(255, 152, 0, 0.08)";
                                      case "error":
                                        return "rgba(244, 67, 54, 0.08)";
                                      case "info":
                                        return "rgba(33, 150, 243, 0.08)";
                                      case "primary":
                                        return "rgba(25, 118, 210, 0.08)";
                                      default:
                                        return "rgba(158, 158, 158, 0.08)";
                                    }
                                  })(),
                                  color: (() => {
                                    const option = STATUS_OPTIONS.find(
                                      (opt) => opt.value === displayStatus
                                    );
                                    switch (option?.color) {
                                      case "success":
                                        return "#2e7d32";
                                      case "warning":
                                        return "#ed6c02";
                                      case "error":
                                        return "#d32f2f";
                                      case "info":
                                        return "#0288d1";
                                      case "primary":
                                        return "#1976d2";
                                      default:
                                        return "#616161";
                                    }
                                  })(),
                                  fontWeight: 600,
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  border: "none",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    border: "none",
                                  },
                                "& .MuiSelect-icon": {
                                  color: (() => {
                                    const option = STATUS_OPTIONS.find(
                                      (opt) => opt.value === displayStatus
                                    );
                                    switch (option?.color) {
                                      case "success":
                                        return "#2e7d32";
                                      case "warning":
                                        return "#ed6c02";
                                      case "error":
                                        return "#d32f2f";
                                      case "info":
                                        return "#0288d1";
                                      case "primary":
                                        return "#1976d2";
                                      default:
                                        return "#616161";
                                    }
                                  })(),
                                },
                                "&.Mui-focused .MuiSelect-icon": {
                                  transform: "rotate(180deg)",
                                },
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    borderRadius: "12px",
                                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                                    border: "1px solid rgba(0,0,0,0.08)",
                                    mt: 1,
                                    "& .MuiMenuItem-root": {
                                      borderRadius: "8px",
                                      margin: "4px 8px",
                                    },
                                  },
                                },
                              }}
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  <Chip
                                    label={option.label}
                                    color={option.color}
                                    size="small"
                                    variant="filled"
                                    sx={{
                                      fontSize: "0.7rem",
                                      height: 24,
                                      fontWeight: 600,
                                      borderRadius: "12px",
                                      boxShadow: "none",
                                    }}
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* <CasesList externalQuery={query} statusFilter={statusFilter} hideSearch /> */}
      </Container>
    </>
  );
};

export default HomePage;
