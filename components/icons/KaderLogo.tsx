import React from 'react';

export const KaderLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <image href={require('../../images/logo.png')} x="0" y="0" width="100" height="100" />
  </svg>
);