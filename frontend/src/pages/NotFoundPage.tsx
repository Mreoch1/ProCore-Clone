import React from 'react';
import '../styles/NotFoundPage.css';

interface NotFoundPageProps {
  onNavigateHome: () => void;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <button className="primary-button" onClick={onNavigateHome}>
          Return to Dashboard
        </button>
      </div>
      <div className="not-found-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
    </div>
  );
};

export default NotFoundPage; 