import React from 'react';
import Header from '../components/Header/Header';
import Network from '../components/Network/Network';

function NetworkPage() {
  return (
    <div style={{ backgroundColor: '#f3f2ef', minHeight: '100vh' }}>
      <Header />
      <Network />
    </div>
  );
}

export default NetworkPage;