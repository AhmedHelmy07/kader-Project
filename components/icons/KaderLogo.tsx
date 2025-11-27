import React from 'react';
import logo from '../../images/logo.png';

export const KaderLogo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return (
    <img 
      src={logo} 
      alt="Kader Logo" 
      className="object-contain object-center"
      {...props} 
    />
  );
};