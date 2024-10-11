import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';

export default function ProtectedRoute({ to = '/' }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate to={to}
        replace />
    );
  }

  return (
    <Outlet />
  );
}