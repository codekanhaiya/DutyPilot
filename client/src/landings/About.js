import React from "react";
import { Box, Typography, Card, CardContent, Avatar, Link, Grid } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';

const About = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* App Info Block */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <InfoIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">About This App</Typography>
              </Box>
              <Typography variant="body1">
                This Duty Assignment Software allows you to generate member duty schedules across rooms and time slots while respecting various constraints such as non-overlapping shifts and member availability.
                It helps in automatic allocation, printable duty sheets, and duty-based payment calculation.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Developer Info Block */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h5">About the Developer</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ width: 48, height: 48, mr: 2 }}>K</Avatar>
                <Box>
                  <Typography variant="body1">Kanhaiya Gupta</Typography>
                  <Link href="http://officialkanha.epizy.com/" target="_blank" rel="noopener noreferrer">
                    Visit Portfolio
                  </Link>
                </Box>
              </Box>
              <Typography variant="body2">
                Passionate full stack developer focused on building efficient software solutions using MERN stack and modern UI/UX practices.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
