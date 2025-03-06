import React from 'react';
import '../styles/LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'var(--primary-color)',
  fullScreen = false,
  message = 'Loading...'
}) => {
  const spinnerClass = `spinner spinner-${size}`;
  const containerClass = fullScreen ? 'spinner-container fullscreen' : 'spinner-container';
  
  return (
    <div className={containerClass}>
      <div className={spinnerClass} style={{ borderTopColor: color }}></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner; 