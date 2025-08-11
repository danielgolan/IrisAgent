import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ArchivePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Archive
        </Typography>
        <Typography color="text.secondary">
          Archived cases will appear here. This view will connect to the database in the future.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ArchivePage;

