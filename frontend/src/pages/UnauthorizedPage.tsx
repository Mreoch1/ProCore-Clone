import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../styles/UnauthorizedPage.css';

const UnauthorizedPage: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-content">
        <h1>Access Denied</h1>
        <div className="unauthorized-icon">🔒</div>
        <p>
          Sorry, you don't have permission to access this page. This area requires
          higher privileges than your current role.
        </p>
        <p className="user-info">
          You are signed in as <strong>{user?.name}</strong> with role{' '}
          <strong>{user?.role.replace('_', ' ')}</strong>.
        </p>
        <div className="action-buttons">
          <Link to="/" className="primary-button">
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="secondary-button"
          >
            Go Back
          </button>
        </div>
        <p className="help-text">
          If you believe this is an error, please contact your administrator or{' '}
          <Link to="/contact">contact support</Link>.
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 