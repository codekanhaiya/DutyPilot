import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Checkbox,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import AlertBox from "../commons/AlertBox";
import PopupBox from "../commons/PopupBox";
import { fetchMembers, saveMembers } from "../utils/LocalStorage";

const Member = () => {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [specialId, setSpecialId] = useState(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchMembers().then(setMembers);
  }, []);

  // Utils
  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const isValidName = (name) => /^[A-Za-z ]{1,50}$/.test(name.trim());
  const isValidID = (id) => /^[A-Z0-9]{1,20}$/.test(id.trim());

  const handleAddMember = async () => {
    const trimmedName = name.trim();
    const formattedId = id.trim().toUpperCase();

    if (!trimmedName || !formattedId) {
      return setAlert({
        open: true,
        message: "Both Name and ID are required.",
        severity: "warning",
      });
    }

    if (!isValidName(trimmedName)) {
      return setAlert({
        open: true,
        message: "Name must be alphabetic and max 50 characters.",
        severity: "error",
      });
    }

    if (!isValidID(formattedId)) {
      return setAlert({
        open: true,
        message:
          "ID must be uppercase alphanumeric (A-Z, 0-9) and max 20 characters.",
        severity: "error",
      });
    }

    if (members.some((m) => m.id === formattedId)) {
      return setAlert({
        open: true,
        message: "A member with this ID already exists.",
        severity: "error",
      });
    }

    const newMember = {
      name: toTitleCase(trimmedName),
      id: formattedId,
      special: false,
    };

    const updated = [...members, newMember];
    setMembers(updated);
    await saveMembers(updated);
    setName("");
    setId("");
    setAlert({
      open: true,
      message: "Member added successfully",
      severity: "success",
    });
  };

  const handleDelete = async () => {
    const updated = members.filter((m) => m.id !== deleteId);
    setMembers(updated);
    await saveMembers(updated);
    setDeleteId(null);
    setAlert({ open: true, message: "Member deleted", severity: "error" });
  };

  const handleSpecialToggle = async () => {
    const updated = members.map((m) =>
      m.id === specialId ? { ...m, special: !m.special } : m
    );
    setMembers(updated);
    await saveMembers(updated);
    const changed = updated.find((m) => m.id === specialId);
    setSpecialId(null);
    setAlert({
      open: true,
      message: `Member marked as ${changed.special ? "Special" : "Normal"}`,
      severity: "info",
    });
  };

  return (
    <Box p={3}>
      {/* Add Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
          Add Member
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              label="ID"
              fullWidth
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddMember}
              sx={{ height: "100%" }}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Member Table */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: "secondary.main" }}>
          Registered Members
        </Typography>

        {members.length === 0 ? (
          <Typography>No members registered.</Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      Sr. No.
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      Special
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...members]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((member, index) => (
                      <TableRow key={member.id}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.id}</TableCell>
                        <TableCell>
                          <Checkbox
                            icon={<StarBorderIcon />}
                            checkedIcon={<StarIcon />}
                            checked={member.special}
                            onChange={() => setSpecialId(member.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => setDeleteId(member.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={members.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[rowsPerPage]}
            />
          </>
        )}
      </Paper>

      {/* Delete Popup */}
      <PopupBox
        open={deleteId !== null}
        title="Delete Member"
        content="Are you sure you want to delete this member?"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
      />

      {/* Special Toggle Popup */}
      <PopupBox
        open={specialId !== null}
        title="Mark Special Member"
        content="Are you sure you want to toggle special status for this member?"
        onClose={() => setSpecialId(null)}
        onConfirm={handleSpecialToggle}
        confirmText="Yes"
      />

      <AlertBox
        open={alert.open}
        severity={alert.severity}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
};

export default Member;
