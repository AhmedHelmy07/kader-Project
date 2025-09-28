import React from 'react';

export const KaderLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
    fill="currentColor"
  >
    <defs>
      <mask id="mask-left-ring">
        <rect width="100" height="100" fill="white" />
        <circle cx="65" cy="55" r="25" fill="black" />
      </mask>
    </defs>
    
    {/* Right Ring */}
    <circle cx="65" cy="55" r="25" stroke="currentColor" strokeWidth="12" fill="none" />
    
    {/* Left Ring (masked) */}
    <circle cx="35" cy="55" r="25" stroke="currentColor" strokeWidth="12" fill="none" mask="url(#mask-left-ring)" />
    
    {/* Head */}
    <circle cx="50" cy="18" r="10" />
  </svg>
);