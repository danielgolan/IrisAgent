import React from "react";
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

const DRAWER_WIDTH = 180; /* reduced from 240px to 180px */

const LogoContainer = styled(Box)`
  padding: 12px; /* reduced from 16px */
  display: flex;
  align-items: center;
  gap: 6px; /* reduced from 8px */
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [{ text: "Dashboard", icon: <CasesIcon />, path: "/" }];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "@media (max-width: 1024px)": {
          width: 160,
        },
        "@media (max-width: 768px)": {
          width: 140,
        },
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "#1a347e",
          color: "white",
          borderRight: "1px solid #233876",
          "@media (max-width: 1024px)": {
            width: 160 /* even smaller on tablets/small laptops */,
          },
          "@media (max-width: 768px)": {
            width: 140 /* minimal on mobile */,
          },
        },
      }}
    >
      <LogoContainer>
        <SecurityIcon sx={{ color: "white" }} />
        <Box sx={{ color: "white", fontSize: "1.0rem", fontWeight: "bold" }}>
          NotIrisProvider
        </Box>
      </LogoContainer>

      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: "8px",
                margin: "2px 6px" /* reduced margins */,
                padding: "8px 12px" /* reduced padding */,
                backgroundColor:
                  location.pathname === item.path ? "#233876" : "transparent",
                color: "white",
                "& .MuiListItemIcon-root": {
                  color: "white",
                  minWidth: "32px" /* reduced icon spacing */,
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
