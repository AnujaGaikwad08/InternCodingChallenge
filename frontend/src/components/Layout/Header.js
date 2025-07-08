import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, removeToken, removeUser } from '../../utils/auth';

const Header = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    removeUser();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Store Rating App
        </Typography>
        {user && user.role === 'admin' && (
          <>
            <Button color="inherit" component={Link} to="/admin">Dashboard</Button>
            <Button color="inherit" component={Link} to="/stores">Stores</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
        {user && user.role === 'user' && (
          <>
            <Button color="inherit" component={Link} to="/user">Dashboard</Button>
            <Button color="inherit" component={Link} to="/stores">Stores</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
        {user && user.role === 'owner' && (
          <>
            <Button color="inherit" component={Link} to="/owner">Dashboard</Button>
            <Button color="inherit" component={Link} to="/stores">Stores</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
        {!user && (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 