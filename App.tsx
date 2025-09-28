import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import HomePage from './components/HomePage';
import DashboardPage from './components/DashboardPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { Navbar } from './components/Navbar';
import { PlaceholderPage } from './components/PlaceholderPage';

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
        case '#/store': return <PlaceholderPage title="Kader Store" message="Our online store is coming soon! Browse smart wheelchairs and upgrade kits."/>;
        case '#/community': return <PlaceholderPage title="Community Hub" message="A place for users to share feedback and experiences. Coming soon!"/>;
        case '#/tickets': return <PlaceholderPage title="Support Tickets" message="Create and manage your maintenance and support requests here."/>;
        case '#/contact': return <PlaceholderPage title="Contact Us" message="Get in touch with the Kaderoon Team through our contact page."/>;
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