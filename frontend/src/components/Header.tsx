import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types/User';
import '../styles/Header.css';

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/projects') return 'Projects';
    if (path.startsWith('/projects/new')) return 'Create New Project';
    if (path.startsWith('/projects/')) return 'Project Details';
    if (path === '/tasks') return 'Tasks';
    if (path === '/documents') return 'Documents';
    if (path === '/team') return 'Team';
    if (path === '/reports') return 'Reports';
    if (path === '/schedule') return 'Schedule';
    if (path === '/budget') return 'Budget';
    if (path === '/settings') return 'Settings';
    if (path === '/help') return 'Help Center';
    if (path === '/terms') return 'Terms of Service';
    if (path === '/privacy') return 'Privacy Policy';
    
    return 'Not Found';
  };
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };
  
  const handleLogout = () => {
    navigate('/login');
  };
  
  const handleProfileClick = () => {
    navigate('/settings');
    setShowUserMenu(false);
  };

  return (
    <header className="header">
      <h1 className="page-title">{getPageTitle()}</h1>
      
      <div className="header-actions">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
        
        <button className="notification-btn">
          <i className="fas fa-bell"></i>
          <span className="notification-badge">3</span>
        </button>
        
        <div className="user-menu-container">
          <button className="user-menu-btn" onClick={toggleUserMenu}>
            <img 
              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`} 
              alt={user?.name || 'User'} 
              className="user-avatar"
            />
            <span className="user-name">{user?.name || 'User'}</span>
            <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <img 
                  src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`} 
                  alt={user?.name || 'User'} 
                  className="user-avatar-large"
                />
                <div className="user-info">
                  <span className="user-name">{user?.name || 'User'}</span>
                  <span className="user-email">{user?.email || 'user@example.com'}</span>
                  <span className="user-role">{user?.role?.replace('_', ' ') || 'User'}</span>
                </div>
              </div>
              
              <div className="user-dropdown-menu">
                <button onClick={handleProfileClick}>
                  <i className="fas fa-user"></i>
                  Profile
                </button>
                <button onClick={() => navigate('/settings')}>
                  <i className="fas fa-cog"></i>
                  Settings
                </button>
                <button onClick={() => navigate('/help')}>
                  <i className="fas fa-question-circle"></i>
                  Help
                </button>
                <button onClick={handleLogout} className="logout-btn">
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
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