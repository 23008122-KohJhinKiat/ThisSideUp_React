// src/pages/UserProfile.js (Example)
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import '../../index.css';

const UserProfilePage = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading profile...</div>;
  if (!currentUser) return <Navigate to="/login" />; // Redirect if not logged in

  return (
     <div className="user-profile-page" style={{ padding: '20px', color: 'white' }}>
      <h1 className='font2'>My Profile</h1>
      <p><strong>Name:</strong> {currentUser.name}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>Role:</strong> {currentUser.role}</p>
    </div>
  );
};
export default UserProfilePage;