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
        <RecentCasesTable
          recentCases={recentCases}
          onCaseClick={handleCaseClick}
        />
      </Container>
    </>
  );
};

export default HomePage;
