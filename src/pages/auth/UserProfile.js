// src/pages/UserProfile.js (Refactored and Cleaned)
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom'; // <<< FIX: Added Navigate import

// A wrapper for the entire page to set the background and layout
const ProfilePageWrapper = styled.div`
  min-height: 100vh;
  background: var(--gradient-products); // Using a consistent dark gradient from your app
  color: var(--color-text-light);
  display: flex;
  align-items: center; // Center the content vertically
  justify-content: center;
  padding: 2rem;
`;

// A container for the profile card itself
const ProfileCard = styled.div`
  background: rgba(25, 25, 25, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem 3rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  text-align: center;
`;

const ProfileHeader = styled.h1`
  font-family: 'Inria Serif', serif;
  font-size: 2.5rem;
  color: var(--color-secondary-peach);
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-primary-purple);
  padding-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: bold;
  color: #ccc;
  font-family: 'Instrument Sans', sans-serif;
`;

const InfoValue = styled.span`
  font-family: 'Instrument Sans', sans-serif;
  color: var(--color-text-light);
  background-color: rgba(0,0,0,0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
`;

const LoadingText = styled.div`
  font-size: 1.5rem;
  color: white;
`;

// --- The Refactored Component ---
const UserProfilePage = () => {
  const { currentUser, loading } = useAuth();

  // This logic is correct and should be kept
  if (loading) {
    return <ProfilePageWrapper><LoadingText>Loading profile...</LoadingText></ProfilePageWrapper>;
  }
  if (!currentUser) {
    // Navigate component is the correct way to redirect
    return <Navigate to="/login" replace />; 
  }

  return (
    <ProfilePageWrapper>
      <ProfileCard>
        <ProfileHeader>My Profile</ProfileHeader>
        <InfoRow>
          <InfoLabel>Name:</InfoLabel>
          <InfoValue>{currentUser.name}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Email:</InfoLabel>
          <InfoValue>{currentUser.email}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Role:</InfoLabel>
          <InfoValue>{currentUser.role}</InfoValue>
        </InfoRow>
        {/* You could add more here, like a logout button or a link to order history */}
      </ProfileCard>
    </ProfilePageWrapper>
  );
};

export default UserProfilePage;