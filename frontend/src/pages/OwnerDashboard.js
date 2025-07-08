import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Button,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';

function OwnerDashboard() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dashboard data
  const [users, setUsers] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  // Update password
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Login
  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/store-owner/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setEmail('');
      setPassword('');
    } catch (err) {
      alert('Login failed');
    }
  };

  // Fetch dashboard
  const fetchDashboard = useCallback(async () => {
    try {
      const res = await axios.get('/api/store-owner/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
      setAvgRating(res.data.averageRating);
    } catch (err) {
      alert('Failed to load dashboard');
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchDashboard();
  }, [token, fetchDashboard]);

  // Update password
  const handleUpdatePassword = async () => {
    try {
      await axios.put('/api/store-owner/update-password', {
        currentPassword: currentPass,
        newPassword: newPass
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Password updated');
      setCurrentPass('');
      setNewPass('');
    } catch (err) {
      alert('Password update failed: ' + (err.response?.data?.error || ''));
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Store Owner Portal
        </Typography>

        {!token ? (
          <>
            <Typography variant="h6" gutterBottom>Login</Typography>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>Dashboard</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Average Rating:</strong> {avgRating.toFixed(2)}
            </Typography>

            <Typography variant="subtitle1">Users Who Rated Your Store:</Typography>
            {users.length === 0 ? (
              <Typography variant="body2" sx={{ mb: 2 }}>No ratings yet.</Typography>
            ) : (
              <List>
                {users.map((u, i) => (
                  <ListItem key={i} disablePadding>
                    <ListItemText primary={`${u.user_name} - ${u.rating} stars`} />
                  </ListItem>
                ))}
              </List>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Update Password</Typography>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              margin="normal"
              value={currentPass}
              onChange={e => setCurrentPass(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
            />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleUpdatePassword}
            >
              Update Password
            </Button>

            <Divider sx={{ my: 3 }} />

            
          </>
        )}
      </Paper>
    </Container>
  );
}

export default OwnerDashboard;
