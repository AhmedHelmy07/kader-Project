import React from 'react';

interface FooterProps {
  theme?: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({ theme = 'dark' }) => {
  const themeClasses = theme === 'dark'
    ? 'bg-black text-gray-400'
    : 'bg-gray-100 text-gray-600 border-t border-gray-200';

  return (
    <footer className={`text-center p-4 text-sm ${themeClasses}`}>
      <p>made by Kaderoon Team all Rights received 2025</p>
    </footer>
  );
};
