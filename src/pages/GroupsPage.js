import React from 'react';
import Header from '../components/Header/Header';
import Groups from '../components/Groups/Groups';

function GroupsPage() {
  return (
    <div style={{ backgroundColor: '#f3f2ef', minHeight: '100vh' }}>
      <Header />
      <Groups />
    </div>
  );
}

export default GroupsPage;