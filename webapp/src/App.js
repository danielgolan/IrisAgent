import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CasesPage from "./pages/CasesPage";
import { ThemeProvider, createTheme, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "./components/Sidebar";
import HomePage from "./homepage/HomePage";
import CaseDetails from "./case-details/CaseDetails";
import ArchivePage from "./archive/ArchivePage";
import SearchComponent from "./search/SearchComponent";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    status: {
      success: "#4caf50",
      warning: "#ff9800",
      error: "#f44336",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: "40px" }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchComponent />} />
              <Route path="/case/:id" element={<CaseDetails />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/cases" element={<CasesPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
