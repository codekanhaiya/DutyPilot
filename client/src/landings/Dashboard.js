import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  useTheme,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { fetchMembers, fetchRooms, fetchTimings } from "../utils/LocalStorage";
import CardSlider from "../components/CardSlider";
import AssignmentTable from "../components/AssignmentTable";
import AlertBox from "../commons/AlertBox";

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [timings, setTimings] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [personPerRoom, setPersonPerRoom] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "warning",
  });

  const theme = useTheme();

  useEffect(() => {
    const fetchAll = async () => {
      const [m, r, t] = await Promise.all([
        fetchMembers(),
        fetchRooms(),
        fetchTimings(),
      ]);
      setMembers(m);
      setRooms(r);
      setTimings(
        t.map(({ from, to }) => ({
          from: dayjs(from),
          to: dayjs(to),
        }))
      );
    };
    fetchAll();
  }, []);

  // ---------------------- Helper: Validate Inputs ------------------------
  const validateInputs = () => {
    if (!title.trim() || !/^[a-zA-Z0-9 ]+$/.test(title)) {
      setAlert({
        open: true,
        message: "Please enter a valid title (alphabets and numbers only).",
        severity: "error",
      });
      return false;
    }

    const perRoomNum = parseInt(personPerRoom);

    if (!perRoomNum || isNaN(perRoomNum) || perRoomNum <= 0) {
      setAlert({
        open: true,
        message: "Enter a valid number of persons per room (numeric > 0).",
        severity: "error",
      });
      return false;
    }

    if (members.length < rooms.length) {
      setAlert({
        open: true,
        message:
          "Insufficient members: Members should be greater than or equal to number of rooms.",
        severity: "error",
      });
      return false;
    }

    if (members.length < rooms.length * perRoomNum) {
      setAlert({
        open: true,
        message: `Insufficient members for ${perRoomNum} per room.`,
        severity: "error",
      });
      return false;
    }

    if (members.length === 0 || rooms.length === 0 || timings.length === 0) {
      setAlert({
        open: true,
        message: "Please ensure members, rooms, and timings are available.",
        severity: "warning",
      });
      return false;
    }

    return true;
  };

  // ---------------------- Main Assignment Logic ------------------------
  const handleAssignDuty = () => {
    if (!validateInputs()) return;

    const perRoom = parseInt(personPerRoom);
    const shuffledMembers = [...members].sort(() => Math.random() - 0.5);
    const specialMembers = shuffledMembers.filter((m) => m.special === true);
    const generalMembers = shuffledMembers.filter((m) => m.special !== true);

    const assigned = [];

    let genIndex = 0;

    timings.forEach((timing, timingIndex) => {
      rooms.forEach((room, roomIndex) => {
        const roomAssignments = [];

        // Add special member once per room per timing
        if (specialMembers.length > 0) {
          const sIndex = (timingIndex + roomIndex) % specialMembers.length;
          roomAssignments.push({
            member: specialMembers[sIndex],
            room,
            timing,
          });
        }

        while (
          roomAssignments.length < perRoom &&
          genIndex < generalMembers.length
        ) {
          roomAssignments.push({
            member: generalMembers[genIndex],
            room,
            timing,
          });
          genIndex++;
        }

        assigned.push(...roomAssignments);
      });
    });

    setAssignments(assigned);
  };

  // ---------------------- Grouping for Table ------------------------
  const groupByTiming = (assignments) => {
    const grouped = {};

    assignments.forEach((a) => {
      const date = a.timing.from.format("YYYY-MM-DD");
      const time = `${a.timing.from.format("hh:mm A")} - ${a.timing.to.format(
        "hh:mm A"
      )}`;
      const block = a.room.block;

      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][time]) grouped[date][time] = {};
      if (!grouped[date][time][block]) grouped[date][time][block] = [];

      grouped[date][time][block].push(a);
    });

    return grouped;
  };

  const groupedAssignments = groupByTiming(assignments);

  return (
    <Box>
      <Typography variant="h5" color="primary" mb={2} className="no-print">
        Duty Assignment Dashboard
      </Typography>

      <Divider
        sx={{ my: 4, borderColor: theme.palette.divider }}
        className="no-print"
      />

      {/* Summary Cards */}
      <Box display="flex" gap={3} className="no-print">
        {[members, rooms, timings].map((data, idx) => {
          const labels = ["Members", "Rooms", "Slots"];
          const colors = ["primary.main", "secondary.main", "info.main"];
          const contrast = [
            theme.palette.getContrastText(theme.palette.primary.main),
            theme.palette.getContrastText(theme.palette.secondary.main),
            theme.palette.getContrastText(theme.palette.info.main),
          ];

          const sortedData = [...data].sort((a, b) => {
            if (idx === 0) return a.name.localeCompare(b.name);
            if (idx === 1) return a.roomNo - b.roomNo;
            if (idx === 2) return a.from.diff(b);
            return 0;
          });

          const content =
            idx === 0
              ? sortedData.map((m) => m.name)
              : idx === 1
              ? sortedData.map((r) => r.roomNo)
              : sortedData.map(
                  (t) =>
                    `${t.from.format("hh:mm A")} - ${t.to.format("hh:mm A")}`
                );

          return (
            <Paper
              key={idx}
              elevation={3}
              sx={{
                flex: 1,
                p: 3,
                bgcolor: colors[idx],
                color: contrast[idx],
                minWidth: 0,
              }}
            >
              <Typography fontWeight="bolder">
                Total {labels[idx]}: {data.length}
              </Typography>
              <CardSlider items={content} label={labels[idx]} />
            </Paper>
          );
        })}
      </Box>

      {/* Inputs and Assign Button */}
      <Divider
        sx={{ my: 4, borderColor: theme.palette.divider }}
        className="no-print"
      />

      <Box
        display="flex"
        gap={2}
        mb={3}
        alignItems="center"
        className="no-print"
      >
        <TextField
          label="Exam Name"
          variant="outlined"
          color="primary"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. SSC Exam"
        />
        <TextField
          label="Persons per Room"
          variant="outlined"
          color="primary"
          value={personPerRoom}
          onChange={(e) => setPersonPerRoom(e.target.value)}
          placeholder="e.g. 2"
          type="number"
        />
        <Button variant="contained" color="primary" onClick={handleAssignDuty}>
          Assign Duties
        </Button>
      </Box>

      <Divider
        sx={{ my: 4, borderColor: theme.palette.divider }}
        className="no-print"
      />

      {/* Assignment Table */}
      {assignments.length > 0 && (
        <AssignmentTable
          groupedAssignments={groupedAssignments}
          title={title}
        />
      )}

      {/* Reusable Alert */}
      <AlertBox
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
};

export default Dashboard;
