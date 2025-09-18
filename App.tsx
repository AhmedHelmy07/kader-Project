import React, { useState } from 'react';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';

const App: React.FC = () => {
  const [page, setPage] = useState<'home' | 'dashboard'>('home');

  const handleLoginSuccess = () => {
    setPage('dashboard');
  };

  if (page === 'home') {
    return <HomePage onAdminLogin={handleLoginSuccess} />;
  }

  return <DashboardPage />;
};

export default App;
