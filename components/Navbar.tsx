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
    <a
      href={path}
      onClick={(e) => { e.preventDefault(); onClick(path); }}
      className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
      }`}
    >
      {icon && <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>}
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></span>
      )}
      {!isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-400 rounded-full transition-all duration-300 group-hover:w-8"></span>
      )}
    </a>
  );
};


export const Navbar: React.FC<NavbarProps> = ({ navigate }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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
    };
    
    const handleNav = (path: string) => {
      navigate(path);
      setIsOpen(false);
    }

    return (
        <nav className={`fixed w-full z-20 top-0 left-0 transition-all duration-300 ${
            scrolled
                ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-700'
                : 'bg-gray-900/80 backdrop-blur-md shadow-md border-b border-gray-700/50'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                            <a
                                href="#/"
                                onClick={(e) => { e.preventDefault(); navigate('#/');}}
                                className="group flex-shrink-0 flex items-center gap-3 text-white transition-all duration-300 hover:scale-105"
                            >
                                <span className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-full p-2 flex items-center justify-center shadow-lg shadow-blue-500/50 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/70 group-hover:rotate-12">
                                    <KaderLogo className="h-8 w-8" />
                                </span>
                                <span className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Kader Project</span>
                            </a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-2">
                           {user ? (
                                <>
                                    {user.email === 'kaderwheelchair@gmail.com' && (
                                        <NavLink path="#/admin" onClick={handleNav} icon={<AdminIcon />}>Admin</NavLink>
                                    )}
                                    <NavLink path="#/dashboard" onClick={handleNav} icon={<DashboardIcon />}>Dashboard</NavLink>
                                    <NavLink path="#/store" onClick={handleNav} icon={<StoreIcon />}>Store</NavLink>
                                    <NavLink path="#/hub" onClick={handleNav} icon={<HubIcon />}>Kader Hub</NavLink>
                                    <NavLink path="#/community" onClick={handleNav} icon={<CommunityIcon />}>Community</NavLink>
                                    <NavLink path="#/tickets" onClick={handleNav} icon={<SupportIcon />}>Support</NavLink>
                                    <NavLink path="#/contact" onClick={handleNav} icon={<ContactIcon />}>Contact</NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="group relative ml-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-6 rounded-lg text-sm transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 hover:scale-105 overflow-hidden"
                                    >
                                        <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
                                        <span className="relative flex items-center gap-2">
                                            <LogoutIcon />
                                            Logout
                                        </span>
                                    </button>
                                </>
                           ) : (
                                <div className="flex items-center gap-3">
                                     <button
                                        onClick={() => navigate('#/login')}
                                        className="text-gray-300 hover:bg-gray-700/50 hover:text-white font-semibold py-2 px-5 rounded-lg text-sm transition-all duration-300 hover:shadow-md"
                                     >
                                        Login
                                     </button>
                                     <button
                                        onClick={() => navigate('#/register')}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-5 rounded-lg text-sm transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105"
                                     >
                                        Register
                                     </button>
                                </div>
                           )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="bg-gray-800 inline-flex items-center justify-center p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:scale-110"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <div className="relative w-6 h-6">
                                <span className={`absolute top-1 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`absolute top-3 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                                <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
                id="mobile-menu"
            >
                <div className="px-4 pt-2 pb-4 space-y-2 bg-gray-800/50 backdrop-blur-md border-t border-gray-700">
                    {user ? (
                        <>
                            {user.email === 'kaderwheelchair@gmail.com' && (
                                <NavLink path="#/admin" onClick={handleNav} icon={<AdminIcon />}>Admin</NavLink>
                            )}
                            <NavLink path="#/dashboard" onClick={handleNav} icon={<DashboardIcon />}>Dashboard</NavLink>
                            <NavLink path="#/store" onClick={handleNav} icon={<StoreIcon />}>Store</NavLink>
                            <NavLink path="#/hub" onClick={handleNav} icon={<HubIcon />}>Kader Hub</NavLink>
                            <NavLink path="#/community" onClick={handleNav} icon={<CommunityIcon />}>Community</NavLink>
                            <NavLink path="#/tickets" onClick={handleNav} icon={<SupportIcon />}>Support</NavLink>
                            <NavLink path="#/contact" onClick={handleNav} icon={<ContactIcon />}>Contact</NavLink>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-4 py-3 rounded-lg text-base transition-all duration-300 shadow-lg hover:shadow-xl mt-3"
                            >
                                <LogoutIcon />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => handleNav('#/login')}
                                className="w-full text-left text-gray-300 hover:bg-gray-700/50 hover:text-white font-semibold block px-4 py-3 rounded-lg text-base transition-all duration-300"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => handleNav('#/register')}
                                className="w-full text-left bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold block px-4 py-3 rounded-lg text-base transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

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