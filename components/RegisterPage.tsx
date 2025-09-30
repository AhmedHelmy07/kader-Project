import React, { useState } from 'react';
import { KaderLogo } from './icons/KaderLogo';
import { auth } from '../firebase';

interface RegisterPageProps {
  navigate: (path: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      navigate('#/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
        <KaderLogo className="w-24 h-24 mx-auto mb-4 drop-shadow-lg" />
        <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">Create Your Account</h1>
        <p className="text-lg text-blue-200 mb-4">Join the future of patient mobility with Kader Project</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-300 text-base">
          <div className="bg-gray-800/70 rounded-lg px-4 py-2 shadow-md">
            <strong className="text-blue-400">AI Navigation</strong> for safe, efficient transport
          </div>
          <div className="bg-gray-800/70 rounded-lg px-4 py-2 shadow-md">
            <strong className="text-blue-400">Real-time Monitoring</strong> for staff & admins
          </div>
          <div className="bg-gray-800/70 rounded-lg px-4 py-2 shadow-md">
            <strong className="text-blue-400">Seamless Booking</strong> for patients
          </div>
        </div>
      </div>
      <div className="w-full max-w-md bg-gray-800/90 rounded-2xl shadow-2xl p-8 border border-blue-900">
        <form onSubmit={handleRegister}>
          {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-sm">{error}</p>}
          <div className="mb-4">
            <label className="block text-blue-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input 
                className="bg-gray-900 border border-blue-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div className="mb-4">
            <label className="block text-blue-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input 
                className="bg-gray-900 border border-blue-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="password" type="password" placeholder="********"
                value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
           <div className="mb-6">
            <label className="block text-blue-300 text-sm font-bold mb-2" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input 
                className="bg-gray-900 border border-blue-700 rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="confirm-password" type="password" placeholder="********"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors text-lg" type="submit">
            Register
          </button>
        </form>
         <p className="text-center text-blue-300 text-sm mt-6">
          Already have an account?{' '}
          <a href="#/login" onClick={(e) => { e.preventDefault(); navigate('#/login'); }} className="font-bold text-blue-400 hover:text-blue-500">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;