import React, { useMemo } from "react";
import "./HomePage.css";
import { Container } from "@mui/material";
import { getStatusCounts, sampleCases } from "../sample-data/sampleCases";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import StatusCardsGrid from "./components/StatusCardsGrid";
import RecentCasesTable from "./components/RecentCasesTable";

const HomePage = () => {
  const navigate = useNavigate();

  const counts = useMemo(() => getStatusCounts(), []);

  const recentCases = useMemo(() => {
    return [...sampleCases]
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
      .slice(0, 10);
  }, []);

  const handleStatusClick = (status) => {
    navigate(`/cases?status=${encodeURIComponent(status)}`);
  };

  const handleCaseClick = (caseId) => {
    navigate(`/case/${caseId}`);
  };

  const handleSearchExecute = (searchResult) => {
    navigate(`/cases?q=${encodeURIComponent(searchResult.query)}`);
  };

  return (
    <>
      <Header onSearchExecute={handleSearchExecute} />
      <Container maxWidth="xl" className="homepage-root">
        <StatusCardsGrid counts={counts} onStatusClick={handleStatusClick} />
        <RecentCasesTable recentCases={recentCases} onCaseClick={handleCaseClick} />
      </Container>
    </>
  );
};

export default HomePage;

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
                                  backgroundColor: "transparent",
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
