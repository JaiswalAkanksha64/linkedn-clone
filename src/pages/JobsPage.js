import React from 'react';
import Header from '../components/Header/Header';
import Jobs from '../components/Jobs/Jobs';

function JobsPage() {
  return (
    <div style={{ backgroundColor: '#f3f2ef', minHeight: '100vh' }}>
      <Header />
      <Jobs />
    </div>
  );
}

export default JobsPage;