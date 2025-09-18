import React from 'react';

export const KaderLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* The two interlocking rings are approximated by two overlapping circles */}
    <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="5" />
    <circle cx="40" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="5" />
    {/* The small circle on top right, as seen in the proposal */}
    <circle cx="40" cy="6" r="6" fill="currentColor" />
  </svg>
);
