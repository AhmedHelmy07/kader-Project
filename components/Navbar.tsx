import React, { useState } from 'react';
import { KaderLogo } from './icons/KaderLogo';
import { useAuth } from '../auth/AuthContext';
import { auth } from '../firebase';

interface NavbarProps {
  navigate: (path: string) => void;
}

const NavLink: React.FC<{ path: string; children: React.ReactNode; onClick: (path: string) => void }> = ({ path, children, onClick }) => (
    <a href={path} onClick={(e) => { e.preventDefault(); onClick(path); }} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
        {children}
    </a>
);


export const Navbar: React.FC<NavbarProps> = ({ navigate }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await auth.signOut();
        navigate('#/');
    };
    
    const handleNav = (path: string) => {
      navigate(path);
      setIsOpen(false);
    }

    return (
        <nav className="bg-gray-900/80 backdrop-blur-md shadow-md fixed w-full z-20 top-0 left-0 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                            <a href="#/" onClick={(e) => { e.preventDefault(); navigate('#/');}} className="flex-shrink-0 flex items-center gap-2 text-white">
                                <span className="bg-gray-900 rounded-full p-1 flex items-center justify-center">
                                    <KaderLogo className="h-8 w-8" />
                                </span>
                                <span className="font-bold text-xl">Kader Project</span>
                            </a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                           {user ? (
                                <>
                                    <NavLink path="#/dashboard" onClick={handleNav}>Dashboard</NavLink>
                                    <NavLink path="#/store" onClick={handleNav}>Store</NavLink>
                                    <NavLink path="#/community" onClick={handleNav}>Community</NavLink>
                                    <NavLink path="#/tickets" onClick={handleNav}>Support</NavLink>
                                    <NavLink path="#/contact" onClick={handleNav}>Contact</NavLink>
                                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors">Logout</button>
                                </>
                           ) : (
                                <div className="flex items-center gap-2">
                                     <button onClick={() => navigate('#/login')} className="text-gray-300 hover:bg-gray-700 hover:text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors">Login</button>
                                     <button onClick={() => navigate('#/register')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors">Register</button>
                                </div>
                           )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         {user ? (
                                <>
                                    <NavLink path="#/dashboard" onClick={handleNav}>Dashboard</NavLink>
                                    <NavLink path="#/store" onClick={handleNav}>Store</NavLink>
                                    <NavLink path="#/community" onClick={handleNav}>Community</NavLink>
                                    <NavLink path="#/tickets" onClick={handleNav}>Support</NavLink>
                                    <NavLink path="#/contact" onClick={handleNav}>Contact</NavLink>
                                    <button onClick={handleLogout} className="w-full text-left bg-red-600 hover:bg-red-700 text-white font-semibold block px-3 py-2 rounded-md text-base">Logout</button>
                                </>
                           ) : (
                                <>
                                     <button onClick={() => handleNav('#/login')} className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white font-semibold block px-3 py-2 rounded-md text-base">Login</button>
                                     <button onClick={() => handleNav('#/register')} className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white font-semibold block px-3 py-2 rounded-md text-base">Register</button>
                                </>
                           )}
                    </div>
                </div>
            )}
        </nav>
    );
};