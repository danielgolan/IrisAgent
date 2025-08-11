import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Description as CasesIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import styled from "styled-components";

const DRAWER_WIDTH = 240;

const LogoContainer = styled(Box)`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

  const menuItems = [
    { text: "Dashboard", icon: <SecurityIcon />, path: "/" },
    { text: "Cases", icon: <CasesIcon />, path: "/cases" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "#1a347e",
          color: "white",
          borderRight: "1px solid #233876",
        },
      }}
    >
      <LogoContainer>
        <SecurityIcon sx={{ color: "white" }} />
        <Box sx={{ color: "white", fontSize: "1.2rem", fontWeight: "bold" }}>
          NotIrisProvider
        </Box>
      </LogoContainer>

      {/* Search input at the top */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/search?vrn=${searchValue}`);
          }}
        >
          <input
            type="text"
            placeholder="Search Exact VRN..."
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
              fontSize: "1rem",
              background: "white",
              marginBottom: "8px",
            }}
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #233876")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/search?vrn=${searchValue}`);
              }
            }}
          />
        </Box>
      </Box>

      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: "8px",
                margin: "4px 8px",
                padding: "10px 16px",
                backgroundColor:
                  location.pathname === item.path ? "#233876" : "transparent",
                color: "white",
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
                "&:hover": {
                  backgroundColor: "#233876",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
