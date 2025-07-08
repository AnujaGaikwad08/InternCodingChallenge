import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';

function StarRating({ value, onChange, disabled }) {
  return (
    <span style={{ display: 'inline-block', minWidth: 110 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: disabled ? 'default' : 'pointer',
            color: star <= value ? '#FFD700' : '#e4e5e9',
            fontSize: 28,
            transition: 'color 0.2s',
            marginRight: 2,
            textShadow: star <= value ? '0 1px 4px #FFD70088' : 'none',
          }}
          onClick={() => !disabled && onChange(star)}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [myRatings, setMyRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState('');

  const fetchStores = useCallback(async () => {
    setLoading(true);
    const params = { search, sortBy, order };
    const res = await api.get('/stores', { params });
    setStores(res.data);
    setLoading(false);
  }, [search, sortBy, order]);

  const fetchMyRatings = useCallback(async () => {
    try {
      const res = await api.get('/ratings/my');
      const ratingsMap = {};
      res.data.forEach(r => { ratingsMap[r.store_id] = r.rating; });
      setMyRatings(ratingsMap);
    } catch {}
  }, []);

  useEffect(() => {
    fetchStores();
    fetchMyRatings();
  }, [fetchStores, fetchMyRatings]);

  async function handleRating(storeId, rating) {
    await api.post(`/ratings/${storeId}`, { rating });
    fetchMyRatings();
    fetchStores();
  }

  async function handlePwChange(e) {
    e.preventDefault();
    setPwMsg('');
    try {
      await api.put('/users/password', pwForm);
      setPwMsg('Password updated successfully.');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg(err.response?.data?.message || 'Error updating password');
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 32, fontFamily: 'Segoe UI, Arial, sans-serif', background: '#f7f8fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: '#2d3748', letterSpacing: 1 }}>User Dashboard</h2>
        <button onClick={handleLogout} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #e53e3e22' }}>Logout</button>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 24, marginBottom: 32 }}>
        <h3 style={{ color: '#2b6cb0', marginTop: 0 }}>Stores</h3>
        <div style={{ marginBottom: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
          <input placeholder="Search by name or address" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', width: 220 }} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}>
            <option value="name">Name</option>
            <option value="address">Address</option>
          </select>
          <select value={order} onChange={e => setOrder(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}>
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
        {loading ? <div>Loading...</div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {stores.map(store => {
              const overall = store.Ratings && store.Ratings.length
                ? (store.Ratings.reduce((sum, r) => sum + r.rating, 0) / store.Ratings.length).toFixed(2)
                : 'N/A';
              return (
                <div key={store.id} style={{ background: '#f9fafb', borderRadius: 10, boxShadow: '0 1px 6px #0001', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: 180 }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#2d3748', marginBottom: 4 }}>{store.name}</div>
                  <div style={{ color: '#4a5568', fontSize: 15, marginBottom: 8 }}>{store.address}</div>
                  <div style={{ color: '#2b6cb0', fontWeight: 500, marginBottom: 8 }}>Overall Rating: <span style={{ fontWeight: 700 }}>{overall}</span></div>
                  <div style={{ marginTop: 'auto' }}>
                    <span style={{ color: '#718096', fontSize: 15, marginRight: 8 }}>Your Rating:</span>
                    <StarRating
                      value={myRatings[store.id] || 0}
                      onChange={rating => handleRating(store.id, rating)}
                      disabled={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 24, maxWidth: 420, margin: '0 auto' }}>
        <h3 style={{ color: '#2b6cb0', marginTop: 0 }}>Update Password</h3>
        <form onSubmit={handlePwChange}>
          <input
            type="password"
            placeholder="Old Password"
            value={pwForm.oldPassword}
            onChange={e => setPwForm(f => ({ ...f, oldPassword: e.target.value }))}
            required
            style={{ display: 'block', marginBottom: 12, width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }}
          />
          <input
            type="password"
            placeholder="New Password"
            value={pwForm.newPassword}
            onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
            required
            style={{ display: 'block', marginBottom: 12, width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={pwForm.confirmPassword}
            onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
            required
            style={{ display: 'block', marginBottom: 12, width: '100%', padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }}
          />
          <button type="submit" style={{ background: '#2b6cb0', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #2b6cb022' }}>Update Password</button>
          {pwMsg && <div style={{ marginTop: 12, color: pwMsg.includes('success') ? 'green' : 'red', fontWeight: 500 }}>{pwMsg}</div>}
        </form>
      </div>
    </div>
  );
}