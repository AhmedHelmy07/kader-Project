
import React from 'react';


export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md w-full p-4 flex items-center justify-between border-b-2 border-blue-500">
      <div className="flex items-center gap-3">
      <div className="bg-blue-500 p-2 rounded-lg">
        <img src="/images/logo.png" alt="Kader Logo" className="w-8 h-8 object-contain" />
      </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Kader Project</h1>
            <p className="text-sm text-gray-500">Smart Autonomous Wheelchair Dashboard</p>
        </div>
      </div>
      <div className="text-sm text-gray-600">Admin View</div>
    </header>
  );
};