import React from 'react';
import Header from '../components/Header/Header';
import Profile from '../components/Profile/Profile';

function ProfilePage() {
  return (
    <div style={{ backgroundColor: '#f3f2ef', minHeight: '100vh' }}>
      <Header />
      <Profile />
    </div>
  );
}

export default ProfilePage;