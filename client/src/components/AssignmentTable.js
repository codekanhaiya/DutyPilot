import React, { useState } from "react";
import { Box, Button, Divider, Paper, useTheme } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import AlertBox from "../commons/AlertBox";

const AssignmentTable = ({ groupedAssignments = {}, title }) => {
  const theme = useTheme();

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handlePrint = () => {
    if (!groupedAssignments || Object.keys(groupedAssignments).length === 0) {
      setAlert({
        open: true,
        message: "Nothing to print. Please check the data.",
        severity: "warning",
      });
      return;
    }

    const printWindow = window.open("", "_blank");

    let html = `
    <html>
      <head>
        <style>
          @page {
            size: A4;
            margin: 15mm 10mm 10mm 10mm;
          }

          body {
            font-family: 'Times New Roman', serif;
            font-size: 13px;
            color: #000 !important;
            background-color: #fff !important;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }

          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            vertical-align: middle;
          }

          th {
            background-color: #eee;
          }

          .header-row {
            background-color: #ccc;
            font-weight: bold;
            text-align: center;
            font-size: 16px;
          }

          .sub-header {
            background-color: #f9f9f9;
            font-weight: bold;
          }

          .no-border {
            border: none !important;
          }

          @media print {
            .no-print {
              display: none;
            }

            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
  `;

    Object.entries(groupedAssignments).forEach(([dateKey, timings]) => {
      Object.entries(timings).forEach(([timeLabel, blockGroup]) => {
        html += `
        <table>
          <thead>
            <tr class="header-row">
              <th colspan="5" style="text-align: center;">${title}</th>
            </tr>
            <tr class="sub-header">
              <th colspan="2" class="no-border">📅 Date: ${dateKey}</th>
              <th colspan="3" class="no-border" style="text-align: right;">⏰ Time: ${timeLabel}</th>
            </tr>
            <tr>
              <th>Block</th>
              <th>Room No.</th>
              <th>ID</th>
              <th>Name</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
      `;

        Object.entries(blockGroup).forEach(([block, entries]) => {
          const groupedByRoom = {};
          entries.forEach((entry) => {
            const key = `${entry.room.roomNo}`;
            if (!groupedByRoom[key]) groupedByRoom[key] = [];
            groupedByRoom[key].push(entry);
          });

          Object.entries(groupedByRoom).forEach(
            ([roomNo, roomEntries], idx) => {
              roomEntries.forEach((entry, i) => {
                html += `
                <tr>
                  ${
                    i === 0 && idx === 0
                      ? `<td rowspan="${Object.values(groupedByRoom)
                          .map((arr) => arr.length)
                          .reduce(
                            (a, b) => a + b
                          )}" style="text-align:center;">${block}</td>`
                      : ""
                  }
                  ${
                    i === 0
                      ? `<td rowspan="${roomEntries.length}" style="text-align:center;">${roomNo}</td>`
                      : ""
                  }
                  <td>${entry.member.id || "-"}</td>
                  <td>${entry.member.name}</td>
                  <td></td>
                </tr>
              `;
              });
            }
          );
        });

        html += `</tbody></table>`;
      });
    });

    html += `</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <Box mt={4}>
      <Box mb={2} display="flex" justifyContent="flex-end" className="no-print">
        <Button
          variant="outlined"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Print / Save as PDF
        </Button>
      </Box>

      <div id="print-section">
        {Object.entries(groupedAssignments).map(([dateKey, timings]) =>
          Object.entries(timings).map(([timeLabel, blockGroup]) => (
            <Box
              key={`${dateKey}-${timeLabel}`}
              component={Paper}
              p={theme.spacing(3)}
              mb={theme.spacing(5)}
              sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: 2,
                borderRadius: 2,
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0",
                  fontSize: "0.95rem",
                  fontFamily: theme.typography.fontFamily,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                    }}
                  >
                    <th
                      colSpan="5"
                      style={{ padding: "12px", textAlign: "center" }}
                    >
                      {title}
                    </th>
                  </tr>
                  <tr style={{ backgroundColor: theme.palette.menu.selected }}>
                    <th
                      colSpan="2"
                      style={{ padding: "8px", textAlign: "left" }}
                    >
                      📅 Date: {dateKey}
                    </th>
                    <th
                      colSpan="3"
                      style={{ padding: "8px", textAlign: "right" }}
                    >
                      ⏰ Time: {timeLabel}
                    </th>
                  </tr>
                  <tr style={{ backgroundColor: theme.palette.menu.hover }}>
                    <th>Block</th>
                    <th>Room No.</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(blockGroup).map(([block, entries]) => {
                    const groupedByRoom = {};
                    entries.forEach((entry) => {
                      const key = `${entry.room.roomNo}`;
                      if (!groupedByRoom[key]) groupedByRoom[key] = [];
                      groupedByRoom[key].push(entry);
                    });

                    const blockRowSpan = Object.values(groupedByRoom)
                      .map((arr) => arr.length)
                      .reduce((a, b) => a + b, 0);

                    let blockRendered = false;

                    return Object.entries(groupedByRoom).map(
                      ([roomNo, roomEntries], roomIdx) =>
                        roomEntries.map((entry, i) => (
                          <tr key={`${block}-${roomNo}-${i}`}>
                            {!blockRendered && i === 0 && roomIdx === 0 && (
                              <td
                                rowSpan={blockRowSpan}
                                style={{
                                  textAlign: "center",
                                  verticalAlign: "middle",
                                  border: `1px solid ${theme.palette.divider}`,
                                  padding: "10px 12px",
                                  fontWeight: 600,
                                }}
                              >
                                {block}
                              </td>
                            )}

                            {i === 0 && (
                              <td
                                rowSpan={roomEntries.length}
                                style={{
                                  textAlign: "center",
                                  verticalAlign: "middle",
                                  border: `1px solid ${theme.palette.divider}`,
                                  padding: "10px 12px",
                                  fontWeight: 500,
                                }}
                              >
                                {roomNo}
                              </td>
                            )}

                            <td
                              style={{
                                border: `1px solid ${theme.palette.divider}`,
                                padding: "10px 12px",
                                verticalAlign: "middle",
                              }}
                            >
                              {entry.member.id}
                            </td>

                            <td
                              style={{
                                border: `1px solid ${theme.palette.divider}`,
                                padding: "10px 12px",
                                verticalAlign: "middle",
                              }}
                            >
                              {entry.member.name}
                            </td>

                            <td
                              style={{
                                border: `1px solid ${theme.palette.divider}`,
                                padding: "10px 12px",
                                verticalAlign: "middle",
                              }}
                            ></td>
                          </tr>
                        ))
                    );
                  })}
                </tbody>
              </table>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))
        )}
      </div>

      <AlertBox
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
};

export default AssignmentTable;
