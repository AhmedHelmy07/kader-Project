
import React from 'react';

export const WheelchairIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="10" cy="4" r="1" />
    <path d="M10.2 2.8 9 12.7a2 2 0 0 0 2 2.3h1.4a2 2 0 0 0 2-2.3L13.8 6" />
    <path d="M12 15h2.5" />
    <path d="M19 12h-2.5" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="17" cy="18" r="3" />
  </svg>
);
