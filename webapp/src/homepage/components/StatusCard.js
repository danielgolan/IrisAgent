import React from "react";
import { Paper, Box, Typography } from "@mui/material";

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
      <Typography
        variant="h6"
        className="status-card-value"
        sx={{ fontSize: "1.25rem" }}
      >
        {value}
      </Typography>
      <Typography variant="caption" className="status-card-label">
        {label}
      </Typography>
    </Box>
  </Paper>
);

export default StatusCard;
