import React from "react";
import {
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import AlertBox from "../commons/AlertBox"; // Adjust path if needed

function Color({ themeMode, setThemeMode }) {
  const [alert, setAlert] = React.useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleChange = (e) => {
    const selected = e.target.value;
    setThemeMode(selected);

    setAlert({
      open: true,
      message: `Switched to ${selected} mode`,
      severity: "info",
    });
  };

  const handleClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Card sx={{ maxWidth: 400, mt: 2, boxShadow: 3, borderRadius: 1 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select Theme
          </Typography>
          <RadioGroup row value={themeMode} onChange={handleChange}>
            <FormControlLabel value="light" control={<Radio />} label="Light" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
          </RadioGroup>
        </CardContent>
      </Card>

      <AlertBox
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={handleClose}
      />
    </>
  );
}

export default Color;
