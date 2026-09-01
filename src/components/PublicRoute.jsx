import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps login/signup/forgot-password — if a valid session already exists
// (restored from the httpOnly cookie via /auth/me), skip straight to the dashboard.
export default function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Still checking the cookie via GET /auth/me — render nothing (or a spinner)
    // rather than flashing the login form before the redirect decision is known.
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}