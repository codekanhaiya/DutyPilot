import React from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Color from "../components/Color";

const Setting = ({ themeMode, setThemeMode }) => {
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <SettingsIcon sx={{ color: "primary.main", fontSize: 28 }} />
          <Typography variant="h5" sx={{ color: "primary.main" }}>
            Application Settings
          </Typography>
        </Stack>

        <Color themeMode={themeMode} setThemeMode={setThemeMode} />
      </Paper>
    </Box>
  );
};

export default Setting;
