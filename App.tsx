import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { Navbar } from './components/Navbar';
import { PlaceholderPage } from './components/PlaceholderPage';
import StorePage from './components/StorePage';
import CartPage from './components/CartPage';
import CommunityPage from './components/CommunityPage';
import SupportPage from './components/SupportPage';
import ContactPage from './components/ContactPage';
import AdminPage from './components/AdminPage';

const AppRouter: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };
  
  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <p>Loading...</p>
        </div>
    );
  }

  if (!user) {
    if (route === '#/login') return <LoginPage navigate={navigate} />;
    if (route === '#/register') return <RegisterPage navigate={navigate} />;
    return <HomePage navigate={navigate} />;
  }
  
  const renderPage = () => {
  switch (route) {
    case '#/dashboard': return <DashboardPage />;
    case '#/store': return <StorePage navigate={navigate} />;
    case '#/cart': return <CartPage navigate={navigate} />;
    case '#/community': return <CommunityPage />;
    case '#/tickets': return <SupportPage />;
    case '#/contact': return <ContactPage />;
    case '#/admin': return <AdminPage />;
    default: return <HomePage navigate={navigate} />;
  }
  }

  return (
    <>
      <Navbar navigate={navigate} />
      <div className="pt-16"> {/* Add padding to offset the fixed navbar */}
        {renderPage()}
      </div>
    </>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;