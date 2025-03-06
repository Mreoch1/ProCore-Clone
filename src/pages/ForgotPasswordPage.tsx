import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../utils/supabaseClient';
import '../styles/LoginPage.css'; // Reusing login page styles

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
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Recon</h1>
          <p>Reset Your Password</p>
        </div>
        
        {success ? (
          <div className="success-message">
            <p>Password reset link has been sent to your email.</p>
            <p>Please check your inbox and follow the instructions to reset your password.</p>
            <div className="login-footer" style={{ marginTop: '2rem' }}>
              <Link to="/login" className="login-button" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
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
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <div className="login-footer" style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link to="/login">Back to Login</Link>
            </div>
          </form>
        )}
        
        <div className="login-footer">
          <div className="legal-links">
            <Link to="/terms">Terms of Service</Link> | <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 