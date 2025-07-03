// Home.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";

import { darkThemeOptions, lightThemeOptions } from "../commons/Theme";

// Import landing pages
import Dashboard from "../landings/Dashboard";
import Member from "../landings/Member";
import Room from "../landings/Room";
import Timing from "../landings/Timing";
import Setting from "../landings/Setting";
import About from "../landings/About";

function Home() {
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const [themeMode, setThemeMode] = useState("dark");

  const customTheme = createTheme(
    themeMode === "dark" ? darkThemeOptions : lightThemeOptions
  );

  const menuItemsTop = [
    { key: "Home", label: "Home", icon: <HomeIcon /> },
    { key: "Members", label: "Members", icon: <GroupIcon /> },
    { key: "Rooms", label: "Rooms", icon: <MeetingRoomIcon /> },
    { key: "Timing", label: "Timing", icon: <AccessTimeIcon /> },
  ];

  const menuItemsBottom = [
    { key: "Settings", label: "Settings", icon: <SettingsIcon /> },
    { key: "About", label: "About", icon: <InfoIcon /> },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case "Home":
        return <Dashboard />;
      case "Members":
        return <Member />;
      case "Rooms":
        return <Room />;
      case "Timing":
        return <Timing />;
      case "Settings":
        return <Setting themeMode={themeMode} setThemeMode={setThemeMode} />;
      case "About":
        return <About />;
      default:
        return <Typography variant="h5">Select a menu item</Typography>;
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        display="flex"
        height="100vh"
        bgcolor={customTheme.palette.background.default}
        color={customTheme.palette.text.primary}
        sx={{ userSelect: "none" }}
      >
        {/* Sidebar */}
        <Box
          width="200px"
          minWidth="200px"
          maxWidth="200px"
          bgcolor={customTheme.palette.background.paper}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          sx={{ borderRight: `1px solid ${customTheme.palette.border.color}` }}
        >
          {/* Top Menu */}
          <List>
            {menuItemsTop.map((item) => (
              <ListItem
                button={true.toString()}
                key={item.key}
                onClick={() => setSelectedMenu(item.key)}
                sx={{
                  cursor: "pointer",
                  bgcolor:
                    selectedMenu === item.key
                      ? customTheme.palette.menu.selected
                      : "transparent",
                  "&:hover": {
                    bgcolor: customTheme.palette.menu.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ color: customTheme.palette.text.primary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>

          {/* Bottom Menu */}
          <List>
            <Divider sx={{ borderColor: "border.color" }} />
            {menuItemsBottom.map((item) => (
              <ListItem
                button={true.toString()}
                key={item.key}
                onClick={() => setSelectedMenu(item.key)}
                sx={{
                  cursor: "pointer",
                  bgcolor:
                    selectedMenu === item.key
                      ? customTheme.palette.menu.selected
                      : "transparent",
                  "&:hover": {
                    bgcolor: customTheme.palette.menu.hover,
                  },
                }}
              >
                <ListItemIcon sx={{ color: customTheme.palette.text.primary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Content Area */}
        <Box
          flexGrow={1}
          p={4}
          sx={{
            overflow: "auto", // Keep scrolling functionality
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // Internet Explorer/Edge
            "&::-webkit-scrollbar": {
              display: "none", // Chrome, Safari, Opera
            },
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
