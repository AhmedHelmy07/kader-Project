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
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
  <KaderLogo className="w-24 h-24 mx-auto" />
        <h1 className="text-4xl font-bold text-white mt-4">Create Your Account</h1>
        <p className="text-gray-400">Join the future of patient mobility.</p>
      </div>
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
        <form onSubmit={handleRegister}>
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
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input 
                className="bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="password" type="password" placeholder="********"
                value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
           <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input 
                className="bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="confirm-password" type="password" placeholder="********"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors" type="submit">
            Register
          </button>
        </form>
         <p className="text-center text-gray-400 text-sm mt-6">
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