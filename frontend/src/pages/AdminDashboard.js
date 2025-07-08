import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import api from '../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/dashboard/stats');
        setStats(statsRes.data);
        const usersRes = await api.get('/users');
        setUsers(usersRes.data);
        const storesRes = await api.get('/stores');
        setStores(storesRes.data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Stats</Typography>
        <Box display="flex" gap={4} mt={2}>
          <Typography>Total Users: {stats.totalUsers}</Typography>
          <Typography>Total Stores: {stats.totalStores}</Typography>
          <Typography>Total Ratings: {stats.totalRatings}</Typography>
        </Box>
      </Paper>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Users</Typography>
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid
            rows={users.map(u => ({ id: u.id, name: u.name, email: u.email, address: u.address, role: u.role }))}
            columns={[
              { field: 'name', headerName: 'Name', flex: 1 },
              { field: 'email', headerName: 'Email', flex: 1 },
              { field: 'address', headerName: 'Address', flex: 1 },
              { field: 'role', headerName: 'Role', flex: 1 },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            loading={loading}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Stores</Typography>
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid
            rows={stores.map(s => ({ id: s.id, name: s.name, address: s.address, owner_id: s.owner_id }))}
            columns={[
              { field: 'name', headerName: 'Name', flex: 1 },
              { field: 'address', headerName: 'Address', flex: 1 },
              { field: 'owner_id', headerName: 'Owner ID', flex: 1 },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            loading={loading}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </Paper>
    </Box>
  );
}