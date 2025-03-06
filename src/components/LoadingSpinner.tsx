import React from 'react';
import '../styles/LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const spinnerClass = `spinner spinner-${size}`;
  const containerClass = `spinner-container ${fullScreen ? 'fullscreen' : ''}`;
  
  return (
    <div className={containerClass}>
      <div className={spinnerClass}>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner; 