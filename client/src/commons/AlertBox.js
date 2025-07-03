import React from "react";
import { Snackbar, Alert } from "@mui/material";

function AlertBox({ open, severity = "info", message = "", onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2500}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertBox;
