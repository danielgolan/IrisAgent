import React from "react";
import {
  Box,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableBody,
} from "@mui/material";
import RecentCasesHeader from "./RecentCasesHeader";
import RecentCasesRow from "./RecentCasesRow";

const RecentCasesTable = ({ recentCases, onCaseClick }) => {
  return (
    <Box className="modern-recent-cases">
      <Paper className="recent-cases-card" elevation={0}>
        <Box className="recent-cases-header">
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.0rem" }}>
            Recent Cases
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small" sx={{ "& .MuiTableCell-root": { py: 0.5 } }}>
            <RecentCasesHeader />
            <TableBody>
              {recentCases.map((caseItem) => (
                <RecentCasesRow
                  key={caseItem.id}
                  caseItem={caseItem}
                  onCaseClick={onCaseClick}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default RecentCasesTable;
