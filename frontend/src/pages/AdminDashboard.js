import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import api from '../utils/api';

const roles = [
  { value: 'admin', label: 'System Administrator' },
  { value: 'user', label: 'Normal User' },
  { value: 'owner', label: 'Store Owner' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userDialog, setUserDialog] = useState({ open: false, user: null });
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [userMsg, setUserMsg] = useState('');
  const [storeMsg, setStoreMsg] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const statsRes = await api.get('/dashboard/stats');
      setStats(statsRes.data);
      const usersRes = await api.get('/users');
      setUsers(usersRes.data);
      const storesRes = await api.get('/stores');
      setStores(storesRes.data);
    } catch (err) {}
    setLoading(false);
  }

  // Filtering logic
  const filteredUsers = users.filter(u =>
    (!userFilter || u.name.toLowerCase().includes(userFilter.toLowerCase()) || u.email.toLowerCase().includes(userFilter.toLowerCase()) || (u.address || '').toLowerCase().includes(userFilter.toLowerCase())) &&
    (!userRoleFilter || u.role === userRoleFilter)
  );
  const filteredStores = stores.filter(s =>
    !storeFilter || s.name.toLowerCase().includes(storeFilter.toLowerCase()) || (s.address || '').toLowerCase().includes(storeFilter.toLowerCase())
  );

  // Add user
  async function handleAddUser(e) {
    e.preventDefault();
    setUserMsg('');
    try {
      await api.post('/users', newUser);
      setAddUserOpen(false);
      setNewUser({ name: '', email: '', address: '', password: '', role: 'user' });
      fetchAll();
    } catch (err) {
      setUserMsg(err.response?.data?.message || 'Error adding user');
    }
  }

  // Add store
  async function handleAddStore(e) {
    e.preventDefault();
    setStoreMsg('');
    try {
      await api.post('/stores', newStore);
      setAddStoreOpen(false);
      setNewStore({ name: '', email: '', address: '', owner_id: '' });
      fetchAll();
    } catch (err) {
      setStoreMsg(err.response?.data?.message || 'Error adding store');
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return (
    <Box p={3} sx={{ background: '#f7f8fa', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>Logout</Button>
      </Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Stats</Typography>
        <Box display="flex" gap={4} mt={2}>
          <Typography>Total Users: {stats.totalUsers}</Typography>
          <Typography>Total Stores: {stats.totalStores}</Typography>
          <Typography>Total Ratings: {stats.totalRatings}</Typography>
        </Box>
      </Paper>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Users</Typography>
          <Button variant="contained" onClick={() => setAddUserOpen(true)}>Add User</Button>
        </Box>
        <Box display="flex" gap={2} mb={2}>
          <TextField label="Search" value={userFilter} onChange={e => setUserFilter(e.target.value)} size="small" />
          <TextField label="Role" select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} size="small" sx={{ minWidth: 120 }}>
            <MenuItem value="">All</MenuItem>
            {roles.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
          </TextField>
        </Box>
        <div style={{ height: 340, width: '100%' }}>
          <DataGrid
            rows={filteredUsers.map(u => ({ id: u.id, name: u.name, email: u.email, address: u.address, role: u.role }))}
            columns={[
              { field: 'name', headerName: 'Name', flex: 1 },
              { field: 'email', headerName: 'Email', flex: 1 },
              { field: 'address', headerName: 'Address', flex: 1 },
              { field: 'role', headerName: 'Role', flex: 1 },
              {
                field: 'details',
                headerName: 'Details',
                renderCell: (params) => <Button size="small" onClick={() => setUserDialog({ open: true, user: users.find(u => u.id === params.row.id) })}>View</Button>,
                sortable: false,
                flex: 0.5,
              },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            loading={loading}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </Paper>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Stores</Typography>
          <Button variant="contained" onClick={() => setAddStoreOpen(true)}>Add Store</Button>
        </Box>
        <Box display="flex" gap={2} mb={2}>
          <TextField label="Search" value={storeFilter} onChange={e => setStoreFilter(e.target.value)} size="small" />
        </Box>
        <div style={{ height: 340, width: '100%' }}>
          <DataGrid
            rows={filteredStores.map(s => ({ id: s.id, name: s.name, address: s.address, owner_id: s.owner_id }))}
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
      {/* Add User Dialog */}
      <Dialog open={addUserOpen} onClose={() => setAddUserOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <form onSubmit={handleAddUser}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
            <TextField label="Name" value={newUser.name} onChange={e => setNewUser(f => ({ ...f, name: e.target.value }))} required inputProps={{ minLength: 20, maxLength: 60 }} />
            <TextField label="Email" value={newUser.email} onChange={e => setNewUser(f => ({ ...f, email: e.target.value }))} required type="email" />
            <TextField label="Address" value={newUser.address} onChange={e => setNewUser(f => ({ ...f, address: e.target.value }))} inputProps={{ maxLength: 400 }} />
            <TextField label="Password" value={newUser.password} onChange={e => setNewUser(f => ({ ...f, password: e.target.value }))} required type="password" inputProps={{ minLength: 8, maxLength: 16 }} />
            <TextField label="Role" select value={newUser.role} onChange={e => setNewUser(f => ({ ...f, role: e.target.value }))} required>
              {roles.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
            </TextField>
            {userMsg && <Typography color="error">{userMsg}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddUserOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Add Store Dialog */}
      <Dialog open={addStoreOpen} onClose={() => setAddStoreOpen(false)}>
        <DialogTitle>Add New Store</DialogTitle>
        <form onSubmit={handleAddStore}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
            <TextField label="Name" value={newStore.name} onChange={e => setNewStore(f => ({ ...f, name: e.target.value }))} required />
            <TextField label="Email" value={newStore.email} onChange={e => setNewStore(f => ({ ...f, email: e.target.value }))} required type="email" />
            <TextField label="Address" value={newStore.address} onChange={e => setNewStore(f => ({ ...f, address: e.target.value }))} inputProps={{ maxLength: 400 }} />
            <TextField label="Owner ID" value={newStore.owner_id} onChange={e => setNewStore(f => ({ ...f, owner_id: e.target.value }))} required type="number" />
            {storeMsg && <Typography color="error">{storeMsg}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddStoreOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* User Details Dialog */}
      <Dialog open={userDialog.open} onClose={() => setUserDialog({ open: false, user: null })}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          {userDialog.user && (
            <Box>
              <Typography><b>Name:</b> {userDialog.user.name}</Typography>
              <Typography><b>Email:</b> {userDialog.user.email}</Typography>
              <Typography><b>Address:</b> {userDialog.user.address}</Typography>
              <Typography><b>Role:</b> {userDialog.user.role}</Typography>
              {/* If user is owner, show their store's average rating */}
              {userDialog.user.role === 'owner' && (
                <Typography sx={{ mt: 1 }}><b>Store Rating:</b> (fetch/store logic can be added here)</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialog({ open: false, user: null })}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}