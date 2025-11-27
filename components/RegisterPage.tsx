import React, { useState, useRef, useEffect } from 'react';
import { KaderLogo } from './icons/KaderLogo';
import { auth } from '../firebase';
import { createUserRecord } from '../services/firestore';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface RegisterPageProps {
  navigate: (path: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [wheelChairId, setWheelChairId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and Last name are required");
      setIsLoading(false);
      return;
    }
    if (!/^[^@\s]+@(gmail\.com|outlook\.com)$/.test(email)) {
      setError("Email must be @gmail.com or @outlook.com");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      console.log('Creating Firebase user with email:', email);
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;
      
      if (uid) {
        console.log('Firebase user created with UID:', uid);
        console.log('Creating user record in Firestore...');
        
        await createUserRecord(uid, {
          email,
          firstName,
          lastName,
          emergencyContact: emergencyContact || undefined,
          wheelChairId: wheelChairId || undefined,
          authProviders: ['email'],
        });
        
        console.log('User record created successfully');
        showWelcome();
      } else {
        throw new Error('Failed to create user: No UID returned');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };
 


  
  const [welcome, setWelcome] = useState(false);
  const showWelcome = () => {
    setWelcome(true);
    setTimeout(() => {
      setWelcome(false);
      navigate('#/dashboard');
    }, 1400);
  };

  // QR Scanner handlers
  useEffect(() => {
    if (showQRScanner) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: false,
        },
        false
      );

      const onScanSuccess = (decodedText: string) => {
        setWheelChairId(decodedText);
        setShowQRScanner(false);
        scanner.clear();
      };

      const onScanError = (error: any) => {
        // Silently ignore scan errors
      };

      scanner.render(onScanSuccess, onScanError);
      qrScannerRef.current = scanner;
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch(() => {});
      }
    };
  }, [showQRScanner]);

  const handleCloseQRScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear().catch(() => {});
    }
    setShowQRScanner(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
        <KaderLogo className="h-24 mx-auto mb-4 drop-shadow-lg" />
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
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-blue-300 text-sm font-bold mb-2" htmlFor="firstName">
                First Name
              </label>
              <input 
                  className="bg-gray-900 border border-blue-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  id="firstName" type="text" placeholder="First Name"
                  value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  required
              />
            </div>
            <div>
              <label className="block text-blue-300 text-sm font-bold mb-2" htmlFor="lastName">
                Last Name
              </label>
              <input 
                  className="bg-gray-900 border border-blue-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  id="lastName" type="text" placeholder="Last Name"
                  value={lastName} onChange={(e) => setLastName(e.target.value)}
                  required
              />
            </div>
          </div>
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
            <label className="block text-blue-300 text-sm font-bold mb-2" htmlFor="emergencyContact">
              Emergency Contact (optional)
            </label>
            <input 
                className="bg-gray-900 border border-blue-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
                id="emergencyContact" type="tel" placeholder="+201#########"
                value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-blue-300 text-sm font-bold mb-2" htmlFor="wheelChairId">
              Wheelchair ID (optional)
            </label>
            <div className="flex gap-2">
              <input 
                  className="bg-gray-900 border border-blue-700 rounded flex-1 py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  id="wheelChairId" type="text" placeholder="Get ID from wheelchair QR code"
                  value={wheelChairId} onChange={(e) => setWheelChairId(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowQRScanner(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                title="Scan QR Code"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">Scan</span>
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-blue-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
      <input 
        className="bg-gray-900 border border-blue-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
        id="password" type="password" placeholder="********"
        value={password} onChange={(e) => setPassword(e.target.value)} required
        minLength={8}
        autoComplete="new-password"
        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$"
        title="Password must be at least 8 characters and contain letters and numbers."
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
        minLength={8}
        autoComplete="new-password"
        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$"
        title="Password must be at least 8 characters and contain letters and numbers."
      />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
          <button type="button" onClick={() => navigate('#/')} className="w-full mt-2 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors text-lg disabled:opacity-50" disabled={isLoading}>
            Cancel
          </button>
        </form>
         <p className="text-center text-blue-300 text-sm mt-6">
          Already have an account?{' '}
          <a href="#/login" onClick={(e) => { e.preventDefault(); navigate('#/login'); }} className="font-bold text-blue-400 hover:text-blue-500">
            Login here
          </a>
        </p>
      </div>
      {welcome && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black/60 absolute inset-0" />
          <div className="relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl flex flex-col items-center text-center border border-blue-700">
            <KaderLogo className="h-20 mb-3" />
            <div className="text-xl font-bold text-white">Welcome to Kader</div>
            <div className="text-sm text-gray-300 mt-2">Your account has been created</div>
          </div>
        </div>
      )}

      {showQRScanner && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl border border-blue-700 p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Scan Wheelchair QR Code</h3>
              <button
                onClick={handleCloseQRScanner}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div id="qr-reader" className="mb-4"></div>
            <p className="text-gray-400 text-sm text-center">
              Position the QR code within the frame to scan
            </p>
            <button
              onClick={handleCloseQRScanner}
              type="button"
              className="w-full mt-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;