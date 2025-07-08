import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h3" gutterBottom>Welcome to the Store Rating App</Typography>
      <Button variant="contained" color="primary" component={Link} to="/login" sx={{ m: 1 }}>
        Login
      </Button>
      <Button variant="outlined" color="primary" component={Link} to="/signup" sx={{ m: 1 }}>
        Sign Up
      </Button>
    </Box>
  );
} 