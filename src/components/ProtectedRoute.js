// File: src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // 1. While the authentication state is loading, show a loading message.
  // This prevents a brief flash of the login page for already-logged-in users.
  if (loading) {
    return <div style={{textAlign: 'center', marginTop: '50px', color: 'black'}}>Checking authentication...</div>;
  }

  // 2. If loading is finished and there is no user, redirect to the login page.
  // We pass the user's intended destination (`location`) in the state
  // so they can be redirected back after successfully logging in.
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If the route is marked as `adminOnly` but the user's role is not 'Admin',
  // redirect them to the home page because they are not authorized.
  if (adminOnly && currentUser.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }
  
  // 4. If all checks pass, the user is authenticated and authorized.
  // Render the child component (the page they were trying to access).
  return children;
};

export default ProtectedRoute;