import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";

import AlertBox from "../commons/AlertBox";
import PopupBox from "../commons/PopupBox";
import { fetchTimings, saveTimings } from "../utils/LocalStorage";

const Timing = () => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchTimings().then((data) => {
      setSlots(
        data.map(({ from, to }) => ({
          from: dayjs(from),
          to: dayjs(to),
        }))
      );
    });
  }, []);

  const handleAddSlot = async () => {
    if (!selectedDate || !fromTime || !toTime) {
      setAlert({
        open: true,
        message: "All fields (Date, From, To) are required to create a slot.",
        severity: "warning",
      });
      return;
    }

    const fromDateTime = selectedDate
      .hour(fromTime.hour())
      .minute(fromTime.minute())
      .second(0);
    const toDateTime = selectedDate
      .hour(toTime.hour())
      .minute(toTime.minute())
      .second(0);

    if (fromDateTime.isBefore(dayjs())) {
      setAlert({
        open: true,
        message: "Cannot create slot before current time.",
        severity: "error",
      });
      return;
    }

    if (!fromDateTime.isBefore(toDateTime)) {
      setAlert({
        open: true,
        message: "From time must be earlier than To time.",
        severity: "error",
      });
      return;
    }

    const newSlot = {
      from: fromDateTime,
      to: toDateTime,
    };
    const updated = [...slots, newSlot];
    setSlots(updated);
    await saveTimings(
      updated.map(({ from, to }) => ({
        from: from.toISOString(),
        to: to.toISOString(),
      }))
    );
    setSelectedDate(null);
    setFromTime(null);
    setToTime(null);
    setAlert({
      open: true,
      message: "Slot added successfully!",
      severity: "success",
    });
  };

  const confirmDelete = async () => {
    const updated = [...slots];
    updated.splice(deleteIndex, 1);
    setSlots(updated);
    await saveTimings(
      updated.map(({ from, to }) => ({
        from: from.toISOString(),
        to: to.toISOString(),
      }))
    );
    setDeleteIndex(null);
    setAlert({
      open: true,
      message: "Slot deleted successfully.",
      severity: "info",
    });
  };

  return (
    <Box p={3}>
      <Paper
        elevation={3}
        sx={{ p: 3, mb: 4, textAlign: "center", bgcolor: "background.paper" }}
      >
        <Typography variant="h2" sx={{ mb: 1, fontWeight: "bold" }}>
          🕒
        </Typography>
        <Typography variant="h6">
          {currentTime.format("dddd, MMMM D, YYYY")}
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, color: "secondary.main" }}>
          {currentTime.format("hh:mm:ss A")}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
          Add a Time Slot
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                disablePast
                value={selectedDate}
                onChange={setSelectedDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="From Time"
                value={fromTime}
                onChange={setFromTime}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="To Time"
                value={toTime}
                onChange={setToTime}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddSlot}
            >
              Add Slot
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
          Scheduled Time Slots
        </Typography>
        {slots.length === 0 ? (
          <Typography>No slots created yet.</Typography>
        ) : (
          Object.entries(
            slots
              .map((slot, index) => ({ ...slot, index }))
              .reduce((acc, { from, to, index }) => {
                const dateKey = from.format("YYYY-MM-DD");
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push({ from, to, index });
                return acc;
              }, {})
          )
            .sort(([a], [b]) => dayjs(b).valueOf() - dayjs(a).valueOf())
            .map(([date, slotsOnDate]) => (
              <Box key={date} sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    borderBottom: "2px solid",
                    borderColor: "divider",
                    color: "text.primary",
                  }}
                >
                  {dayjs(date).format("dddd, MMMM D, YYYY")}
                </Typography>
                <List dense disablePadding>
                  {slotsOnDate.map(({ from, to, index }, i) => (
                    <ListItem key={index} divider sx={{ px: 1 }}>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="body2" fontWeight="medium">
                              {i + 1}.
                            </Typography>
                            <Typography variant="body2">
                              {from.format("hh:mm A")} → {to.format("hh:mm A")}
                            </Typography>
                          </Box>
                        }
                      />
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => setDeleteIndex(index)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))
        )}
      </Paper>

      <PopupBox
        open={deleteIndex !== null}
        title="Delete Slot"
        content="Are you sure you want to delete this slot?"
        onClose={() => setDeleteIndex(null)}
        onConfirm={confirmDelete}
        confirmText="Delete"
      />

      <AlertBox
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
};

export default Timing;
