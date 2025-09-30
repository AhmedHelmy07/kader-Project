import React from 'react';

export const KaderLogo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return <img src={require('../../images/logo.png')} alt="Kader Logo" {...props} />;
};