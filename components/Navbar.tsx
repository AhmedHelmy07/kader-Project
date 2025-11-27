import React, { useState, useEffect } from 'react';
import { KaderLogo } from './icons/KaderLogo';
import { useAuth } from '../auth/AuthContext';
import { auth } from '../firebase';

interface NavbarProps {
  navigate: (path: string) => void;
}

const NavLink: React.FC<{
  path: string;
  children: React.ReactNode;
  onClick: (path: string) => void;
  icon?: React.ReactNode;
}> = ({ path, children, onClick, icon }) => {
  const isActive = window.location.hash === path;

  return (
    <button
      onClick={(e) => { e.preventDefault(); onClick(path); }}
      className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
        isActive
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
          : 'text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/20'
      }`}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
};


export const Navbar: React.FC<NavbarProps> = ({ navigate }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await auth.signOut();
        navigate('#/');
        setIsOpen(false);
    };
    
    const handleNav = (path: string) => {
      navigate(path);
      setIsOpen(false);
      setDropdownOpen(false);
    }

    const navItems = user ? [
      ...(user.email === 'kaderwheelchair@gmail.com' ? [{ path: '#/admin', label: 'Admin', icon: <AdminIcon /> }] : []),
      { path: '#/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { path: '#/store', label: 'Store', icon: <StoreIcon /> },
      { path: '#/hub', label: 'Hub', icon: <HubIcon /> },
      { path: '#/medical-records', label: 'Medical', icon: <MedicalIcon /> },
      { path: '#/sos', label: 'SOS', icon: <SOSIcon /> },
      { path: '#/community', label: 'Community', icon: <CommunityIcon /> },
      { path: '#/tickets', label: 'Support', icon: <SupportIcon /> },
      { path: '#/contact', label: 'Contact', icon: <ContactIcon /> },
    ] : [];

    return (
        <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ${
            scrolled
                ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-white/10'
                : 'bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-white/5'
        }`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <button
                        onClick={() => navigate('#/')}
                        className="flex-shrink-0 flex items-center gap-2 text-white transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <span className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-full p-2 flex items-center justify-center shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 transition-all duration-300">
                            <KaderLogo className="h-8" />
                        </span>
                        <span className="hidden sm:inline font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Kader</span>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navItems.map(item => (
                            <NavLink key={item.path} path={item.path} onClick={handleNav} icon={item.icon}>
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden lg:flex items-center gap-3">
                        {user ? (
                            <>
                                <div className="text-sm text-gray-300 px-3 py-2 rounded-lg bg-white/5">
                                    {user.email}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 active:scale-95"
                                >
                                    <LogoutIcon />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('#/login')}
                                    className="text-gray-300 hover:text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-300 hover:bg-white/10"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('#/register')}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 active:scale-95"
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden border-t border-white/10 bg-gradient-to-b from-gray-900/50 to-gray-950/50 backdrop-blur-md">
                        <div className="px-2 py-4 space-y-2 max-h-[calc(100vh-64px)] overflow-y-auto">
                            {/* Mobile Auth Section */}
                            {user && (
                                <div className="px-3 py-3 bg-white/5 rounded-lg border border-white/10 mb-3">
                                    <p className="text-xs text-gray-400 mb-1">Signed in as</p>
                                    <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                                </div>
                            )}

                            {/* Mobile Nav Items */}
                            <div className="space-y-1">
                                {navItems.map(item => (
                                    <button
                                        key={item.path}
                                        onClick={() => handleNav(item.path)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-300 ${
                                            window.location.hash === item.path
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Mobile Auth Buttons */}
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <LogoutIcon />
                                    <span>Logout</span>
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleNav('#/login')}
                                        className="w-full mt-3 text-gray-300 hover:text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 hover:bg-white/10 border border-white/20"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => handleNav('#/register')}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// Icon components (same as before)
const DashboardIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const StoreIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const CommunityIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const SupportIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const ContactIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const AdminIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const HubIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const MedicalIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SOSIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v.01M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
);