import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../utils/supabaseClient';
import '../styles/LoginPage.css'; // Reusing the login page styles

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Recon</h1>
          <p>Project Management System</p>
        </div>
        
        {success ? (
          <div className="success-container">
            <h2>Password Reset Email Sent</h2>
            <p>
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your email and follow the instructions to reset your password.
            </p>
            <p>
              If you don't receive an email within a few minutes, please check your spam folder.
            </p>
            <div className="form-actions">
              <Link to="/login" className="login-button">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>
            <p className="form-description">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
        
        <div className="login-footer">
          <p>
            Remember your password? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 