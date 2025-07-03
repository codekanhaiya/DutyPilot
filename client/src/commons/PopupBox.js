// common/PopupBox.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const PopupBox = ({
  open,
  title = "Confirm",
  content = "Are you sure?",
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "error", // can be "primary", "warning", etc.
  icon = "warning", // "info" | "error" | "warning" | "none"
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "info":
        return <InfoIcon sx={{ mr: 1 }} color="info" />;
      case "error":
        return <ErrorOutlineIcon sx={{ mr: 1 }} color="error" />;
      case "warning":
        return <WarningAmberIcon sx={{ mr: 1 }} color="warning" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle display="flex" alignItems="center">
        {renderIcon()}
        <Typography variant="h6" component="span">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupBox;
