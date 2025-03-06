import React, { useState, useEffect } from 'react';
import '../styles/LoginPage.css';
import { User } from '../types/project';
import LoadingSpinner from '../components/LoadingSpinner';
import { signIn, signUp, resetPassword } from '../utils/supabaseClient';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onRegister: (userData: Partial<User>) => void;
}

interface PasswordRequirement {
  regex: RegExp;
  label: string;
}

const passwordRequirements: PasswordRequirement[] = [
  { regex: /.{8,}/, label: 'At least 8 characters long' },
  { regex: /[A-Z]/, label: 'Contains uppercase letter' },
  { regex: /[a-z]/, label: 'Contains lowercase letter' },
  { regex: /[0-9]/, label: 'Contains number' },
  { regex: /[^A-Za-z0-9]/, label: 'Contains special character' }
];

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [passwordRequirementsMet, setPasswordRequirementsMet] = useState<boolean[]>(
    new Array(passwordRequirements.length).fill(false)
  );

  useEffect(() => {
    if (isRegistering) {
      const newRequirementsMet = passwordRequirements.map(req => 
        req.regex.test(password)
      );
      setPasswordRequirementsMet(newRequirementsMet);
    }
  }, [password, isRegistering]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    try {
      await resetPassword(email);
      alert('Password reset instructions have been sent to your email');
      setShowForgotPassword(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        const allRequirementsMet = passwordRequirementsMet.every(met => met);
        if (!allRequirementsMet) {
          throw new Error('Password does not meet all requirements');
        }
        
        if (!name || !email || !password || !role) {
          throw new Error('All fields are required');
        }

        // Register with Supabase
        const userData = {
          name,
          role,
          company,
          position
        };

        const data = await signUp(email, password, userData);
        
        if (onRegister) {
          onRegister(userData);
        }
        
        // Switch to login view after successful registration
        setIsRegistering(false);
        setEmail('');
        setPassword('');
        setName('');
        setRole('');
        setCompany('');
        setPosition('');
        setConfirmPassword('');
        
        // Show success message
        alert('Registration successful! Please check your email to verify your account.');
      } else {
        // Login with Supabase
        const data = await signIn(email, password);
        
        if (data.user) {
          const userData = data.user.user_metadata;
          const user: User = {
            id: data.user.id,
            name: userData.name || 'User',
            email: data.user.email || '',
            role: userData.role || 'team_member',
            company: userData.company,
            position: userData.position
          };
          
          if (rememberMe) {
            localStorage.setItem('remember_email', email);
          } else {
            localStorage.removeItem('remember_email');
          }
          
          if (onLogin) {
            onLogin(user);
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('remember_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  if (showForgotPassword) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <div className="login-logo">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4a6cf7" />
                    <stop offset="100%" stopColor="#2541b2" />
                  </linearGradient>
                </defs>
                <rect width="32" height="32" rx="6" fill="url(#gradient)" />
                <path d="M8 16 L16 8 L24 16 L16 24 Z" fill="white" />
                <circle cx="16" cy="16" r="4" fill="white" />
              </svg>
            </div>
            <h1>Recon Project Management Systems</h1>
            <p>Reset Your Password</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleForgotPassword} className="login-form">
            <div className="form-group">
              <label htmlFor="reset-email">Email</label>
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              Send Reset Instructions
            </button>

            <button 
              type="button" 
              className="link-btn"
              onClick={() => setShowForgotPassword(false)}
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4a6cf7" />
                  <stop offset="100%" stopColor="#2541b2" />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="6" fill="url(#gradient)" />
              <path d="M8 16 L16 8 L24 16 L16 24 Z" fill="white" />
              <circle cx="16" cy="16" r="4" fill="white" />
            </svg>
          </div>
          <h1>Recon Project Management Systems</h1>
          <p>Professional Construction Project Management</p>
        </div>

        {isLoading ? (
          <LoadingSpinner size="medium" message={isRegistering ? "Creating your account..." : "Logging you in..."} />
        ) : (
          <>
            <div className="login-tabs">
              <button 
                className={`tab-btn ${!isRegistering ? 'active' : ''}`} 
                onClick={() => setIsRegistering(false)}
              >
                Login
              </button>
              <button 
                className={`tab-btn ${isRegistering ? 'active' : ''}`} 
                onClick={() => setIsRegistering(true)}
              >
                Register
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              {isRegistering && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegistering}
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                {isRegistering && (
                  <div className="password-requirements">
                    {passwordRequirements.map((req, index) => (
                      <div 
                        key={req.label} 
                        className={`requirement ${passwordRequirementsMet[index] ? 'met' : ''}`}
                      >
                        {passwordRequirementsMet[index] ? '✓' : '○'} {req.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isRegistering && (
                <>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={isRegistering}
                      placeholder="Confirm your password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required={isRegistering}
                    >
                      <option value="">Select a role</option>
                      <option value="project_manager">Project Manager</option>
                      <option value="team_member">Team Member</option>
                      <option value="client">Client</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="position">Position</label>
                    <input
                      type="text"
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Enter your job position"
                    />
                  </div>
                </>
              )}

              {!isRegistering && (
                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <button 
                    type="button"
                    className="forgot-password-btn"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isRegistering ? 'Create Account' : 'Login'}
              </button>

              {isRegistering && (
                <p className="terms-text">
                  By creating an account, you agree to our{' '}
                  <a href="/terms" target="_blank">Terms of Service</a> and{' '}
                  <a href="/privacy" target="_blank">Privacy Policy</a>
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage; 