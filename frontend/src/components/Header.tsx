import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types/User';
import '../styles/Header.css';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/projects')) {
      if (path === '/projects/new') return 'New Project';
      if (path.includes('/projects/')) return 'Project Details';
      return 'Projects';
    }
    if (path.startsWith('/tasks')) return 'Tasks';
    if (path === '/settings') return 'Settings';
    if (path === '/about') return 'About';
    if (path === '/contact') return 'Contact';
    if (path === '/terms') return 'Terms of Service';
    if (path === '/privacy') return 'Privacy Policy';
    
    return 'ProCore';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleUserMenuClick = (path: string) => {
    setShowUserMenu(false);
    navigate(path);
  };

  return (
    <header className="header">
      <h1 className="page-title">{getPageTitle()}</h1>
      
      <div className="header-actions">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>
        
        <button className="notification-btn">
          🔔
          <span className="notification-badge">3</span>
        </button>
        
        <div className="user-menu-container">
          <button className="user-menu-btn" onClick={toggleUserMenu}>
            <div className="user-avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="user-name">{user.name}</span>
          </button>
          
          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-header">
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                  <p className="user-email">{user.email}</p>
                </div>
              </div>
              <div className="user-menu-items">
                <button onClick={() => handleUserMenuClick('/settings')}>
                  Settings
                </button>
                <button onClick={() => handleUserMenuClick('/settings?tab=profile')}>
                  Profile
                </button>
                <button onClick={() => handleUserMenuClick('/settings?tab=notifications')}>
                  Notifications
                </button>
                <button onClick={() => handleUserMenuClick('/settings?tab=security')}>
                  Security
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 