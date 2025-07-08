import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const RoleRoute = ({ children, roles }) => {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (!roles.includes(getUserRole())) return <Navigate to="/" />;
  return children;
};

export default RoleRoute; 