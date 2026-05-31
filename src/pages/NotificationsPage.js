import React from 'react';
import Header from '../components/Header/Header';
import Notifications from '../components/Notifications/Notifications';

function NotificationsPage() {
  return (
    <div style={{ backgroundColor: '#f3f2ef', minHeight: '100vh' }}>
      <Header />
      <Notifications />
    </div>
  );
}

export default NotificationsPage;