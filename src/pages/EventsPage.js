import React from 'react';
import Header from '../components/Header/Header';
import Events from '../components/Events/Events';

function EventsPage() {
  return (
    <div style={{ backgroundColor: '#f3f2ef', minHeight: '100vh' }}>
      <Header />
      <Events />
    </div>
  );
}

export default EventsPage;