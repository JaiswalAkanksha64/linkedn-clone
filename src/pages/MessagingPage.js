import React from 'react';
import Header from '../components/Header/Header';
import Messaging from '../components/Messaging/Messaging';

function MessagingPage() {
  return (
    <div style={{ backgroundColor: '#f3f2ef', minHeight: '100vh' }}>
      <Header />
      <Messaging />
    </div>
  );
}

export default MessagingPage;