import React from 'react';
import { useTheme } from './ThemeProvider';

const Logo = ({ size = 'default' }) => {
  
  // Size variants
  const sizeClasses = {
    small: 'text-lg',
    default: 'text-[22px]',
    large: 'text-2xl'
  };

  return (
    <div className={`logo ${sizeClasses[size] || sizeClasses.default}`}>
      Hyperknow
    </div>
  );
};

export default Logo;