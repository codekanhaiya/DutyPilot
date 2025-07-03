import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";

import PopupBox from "../commons/PopupBox";
import AlertBox from "../commons/AlertBox";

import { fetchRooms, saveRooms } from "../utils/LocalStorage";

const Room = () => {
  const [rooms, setRooms] = useState([]);
  const [block, setBlock] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    fetchRooms().then(setRooms);
  }, []);

  const isAlphaNumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);

  const handleAddRoom = async () => {
    const blockName = block.trim().toUpperCase();
    const roomNumber = roomNo.trim().toUpperCase();

    // Check for empty fields
    if (!blockName || !roomNumber) {
      setAlert({
        open: true,
        severity: "warning",
        message: "Both Block and Room No. are required.",
      });
      return;
    }

    // Length check
    if (blockName.length > 5 || roomNumber.length > 5) {
      setAlert({
        open: true,
        severity: "warning",
        message: "Block and Room No. should be max 5 characters long.",
      });
      return;
    }

    // Alphanumeric check
    if (!isAlphaNumeric(blockName) || !isAlphaNumeric(roomNumber)) {
      setAlert({
        open: true,
        severity: "warning",
        message: "Only alphanumeric characters are allowed.",
      });
      return;
    }

    // Check for duplication: same block AND roomNo
    const exists = rooms.some(
      (r) => r.block === blockName && r.roomNo === roomNumber
    );
    if (exists) {
      setAlert({
        open: true,
        severity: "error",
        message: "This room already exists in the same block.",
      });
      return;
    }

    // Add the new room
    const newRoom = { block: blockName, roomNo: roomNumber };
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    await saveRooms(updatedRooms);
    setBlock("");
    setRoomNo("");
    setAlert({
      open: true,
      severity: "success",
      message: "Room added successfully!",
    });
  };

  const handleDeleteRoom = async () => {
    const updated = [...rooms];
    updated.splice(deleteIndex, 1);
    setRooms(updated);
    await saveRooms(updated);
    setDeleteIndex(null);
    setAlert({ open: true, severity: "info", message: "Room deleted." });
  };

  return (
    <Box p={3}>
      <Paper elevation={4} sx={{ p: 4, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <RoomPreferencesIcon color="primary" />
          <Typography variant="h5" fontWeight="bold">
            Room Allocation
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          mb={3}
        >
          <TextField
            label="Block Name"
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            fullWidth
          />
          <TextField
            label="Room No."
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleAddRoom}
            sx={{ whiteSpace: "nowrap", minWidth: "120px" }}
          >
            Add Room
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" sx={{ mb: 2, color: "secondary.main" }}>
          Allocated Rooms
        </Typography>

        {rooms.length === 0 ? (
          <Typography color="text.secondary">No rooms added yet.</Typography>
        ) : (
          <>
            {Object.entries(
              rooms.reduce((acc, room, index) => {
                const key = room.block;
                if (!acc[key]) acc[key] = [];
                acc[key].push({ ...room, index });
                return acc;
              }, {})
            )
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([blockName, blockRooms]) => (
                <Box key={blockName} sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: "primary.main",
                      mb: 1,
                    }}
                  >
                    Block {blockName} ({blockRooms.length} Room
                    {blockRooms.length > 1 ? "s" : ""})
                  </Typography>

                  <List dense disablePadding>
                    {blockRooms.map(({ roomNo, index }, i) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => setDeleteIndex(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                        sx={{ px: 1 }}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={2}>
                              <Typography variant="body2" fontWeight="medium">
                                {i + 1}.
                              </Typography>
                              <Typography variant="body2">
                                Room No: {roomNo}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="subtitle1"
              color="text.primary"
              fontWeight="bold"
            >
              Grand Total Rooms: {rooms.length}
            </Typography>
          </>
        )}
      </Paper>

      {/* Delete Confirmation */}
      <PopupBox
        open={deleteIndex !== null}
        title="Delete Room"
        content="Are you sure you want to delete this room?"
        onClose={() => setDeleteIndex(null)}
        onConfirm={handleDeleteRoom}
        confirmText="Delete"
        confirmColor="error"
        icon="warning"
      />

      {/* Alert Box */}
      <AlertBox
        open={alert.open}
        severity={alert.severity}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
};

export default Room;
