import React, { useState } from 'react';
import { KaderLogo } from './icons/KaderLogo';
import { auth, googleProvider } from '../firebase';

interface LoginPageProps {
  navigate: (path: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigate('#/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await auth.signInWithPopup(googleProvider);
      navigate('#/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
  <img src="/images/logo.png" alt="Kader Logo" className="w-24 h-24 mx-auto object-contain" />
        <h1 className="text-4xl font-bold text-white mt-4">Welcome Back</h1>
        <p className="text-gray-400">Sign in to manage your fleet.</p>
      </div>
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
        <form onSubmit={handleLogin}>
          {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-sm">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input 
                className="bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input 
                className="bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="password" type="password" placeholder="********"
                value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors" type="submit">
            Sign In
          </button>
        </form>
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
        </div>
        <button onClick={handleGoogleSignIn} className="w-full flex justify-center items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
            <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 174 58.7l-65.2 64.2C335.5 97.4 294.8 80 248 80c-82.3 0-149.3 67-149.3 149.3s67 149.3 149.3 149.3c96.1 0 133.3-67.9 138-105.2H248v-75h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Google
        </button>
         <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{' '}
          <a href="#/register" onClick={(e) => { e.preventDefault(); navigate('#/register'); }} className="font-bold text-blue-400 hover:text-blue-500">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;