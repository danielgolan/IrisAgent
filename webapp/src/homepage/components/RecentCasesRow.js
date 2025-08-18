import React from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Avatar,
  Box,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  calculateSteps,
  mapCaseStatusToDisplay,
  STATUS_OPTIONS,
  getStatusColors,
} from "../utils/homepageUtils";
import StatusChip from "../../components/StatusChip";

const RecentCasesRow = ({ caseItem, onCaseClick }) => {
  const { completedSteps, totalSteps } = calculateSteps(caseItem);
  const progressPercentage = (completedSteps / totalSteps) * 100;
  const displayStatus = mapCaseStatusToDisplay(caseItem.status);
  const statusOption = STATUS_OPTIONS.find(
    (opt) => opt.value === displayStatus
  );
  const statusColors = getStatusColors(statusOption?.color);

  return (
    <TableRow
      onClick={() => onCaseClick(caseItem.id)}
      sx={{
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(25, 118, 210, 0.04)",
        },
        height: 40 /* further reduced row height */,
      }}
    >
      <TableCell>
        <Avatar sx={{ width: 24, height: 24, fontSize: "0.6rem" }}>
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
            fontSize: "0.7rem" /* smaller font */,
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
          sx={{ fontSize: "0.7rem", fontWeight: 500 }}
        >
          {caseItem.vehicle?.vehicleLicenseNumber}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography
          variant="body2"
          sx={{ fontSize: "0.7rem", fontWeight: 500 }}
        >
          {caseItem.caseWorker?.organizationName}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography
          variant="body2"
          sx={{ fontSize: "0.7rem", fontWeight: 500 }}
        >
          {caseItem.insuranceInformation?.insuranceProvider?.name}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography
          variant="body2"
          sx={{ fontSize: "0.7rem", fontWeight: 500 }}
        >
          {caseItem.jobType}
        </Typography>
      </TableCell>

      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ minWidth: 40 }}>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 3,
                borderRadius: 2,
                backgroundColor: "grey.200",
              }}
              color={progressPercentage === 100 ? "success" : "primary"}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{ fontSize: "0.6rem", minWidth: 25 }}
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
                backgroundColor: statusColors.bg,
                color: statusColors.text,
                fontWeight: 600,
              },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiSelect-icon": { color: statusColors.text },
              "&.Mui-focused .MuiSelect-icon": { transform: "rotate(180deg)" },
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
              <MenuItem key={option.value} value={option.value}>
                <StatusChip
                  label={option.label}
                  status={option.label}
                  size="small"
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>
    </TableRow>
  );
};

export default RecentCasesRow;
