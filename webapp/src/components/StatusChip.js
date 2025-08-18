import React from "react";
import { Chip, Box } from "@mui/material";
import { KeyboardArrowDown as ArrowDownIcon } from "@mui/icons-material";

// Status chip styles matching the cases list design
const getStatusChipStyle = (status) => {
  const statusMappings = {
    // Success/Approved statuses
    InvoiceApproved: {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
    },
    "Invoice Approved": {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
    },
    Completed: {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
    },
    "Auto-approved": {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
    },
    Approved: {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
    },

    // Error/Failed statuses
    Failed: {
      backgroundColor: "#ffebee",
      color: "#d32f2f",
    },
    Declined: {
      backgroundColor: "#ffebee",
      color: "#d32f2f",
    },

    // Warning/Pending statuses (default orange)
    "Pending Approval": {
      backgroundColor: "#fff3e0",
      color: "#f57c00",
    },
    ReadyForApproval: {
      backgroundColor: "#fff3e0",
      color: "#f57c00",
    },
    "Ready for Approval": {
      backgroundColor: "#fff3e0",
      color: "#f57c00",
    },
    "Auto-warning": {
      backgroundColor: "#fff3e0",
      color: "#f57c00",
    },
    Pending: {
      backgroundColor: "#fff3e0",
      color: "#f57c00",
    },
    "Waiting Invoice": {
      backgroundColor: "#fff3e0",
      color: "#f57c00",
    },
    "Waiting Payment": {
      backgroundColor: "#fff3e0",
      color: "#f57c00",
    },
    Open: {
      backgroundColor: "#e3f2fd",
      color: "#1565c0",
    },
  };

  // Return specific mapping or default to orange warning style
  return (
    statusMappings[status] || {
      backgroundColor: "#fff3e0",
      color: "#f57c00",
    }
  );
};

const StatusChip = ({
  label,
  status,
  isEditable = false,
  onClick,
  size = "small",
  ...props
}) => {
  const chipStyle = getStatusChipStyle(status || label);

  const chipContent = (
    <Chip
      label={label}
      size={size}
      onClick={isEditable ? onClick : undefined}
      sx={{
        ...chipStyle,
        fontWeight: 500,
        fontSize:
          size === "small"
            ? "0.75rem"
            : size === "medium"
            ? "0.875rem"
            : "1rem",
        borderRadius: "6px",
        cursor: isEditable ? "pointer" : "default",
        border: "none",
        "&:hover": isEditable
          ? {
              backgroundColor: chipStyle.backgroundColor,
              filter: "brightness(0.95)",
            }
          : {},
        ...props.sx,
      }}
      {...props}
    />
  );

  // If editable, wrap with dropdown arrow
  if (isEditable) {
    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        {chipContent}
        <ArrowDownIcon
          sx={{
            fontSize: "16px",
            color: chipStyle.color,
            opacity: 0.7,
          }}
        />
      </Box>
    );
  }

  return chipContent;
};

export default StatusChip;
