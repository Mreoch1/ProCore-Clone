import { useState } from 'react';
import '../styles/Header.css';
import { User } from '../types/project';

interface HeaderProps {
  title: string;
  activeProject?: string;
  currentUser?: User;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, activeProject, currentUser, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      setShowUserMenu(false);
    }
  };

  // Generate user initials from name
  const getUserInitials = () => {
    if (!currentUser || !currentUser.name) return 'U';
    
    const nameParts = currentUser.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0];
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>{title}</h1>
        {activeProject && <span className="active-project">Project: {activeProject}</span>}
      </div>
      
      <div className="header-center">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">🔍</button>
        </form>
      </div>
      
      <div className="header-right">
        <div className="header-actions">
          <button className="action-button">+ New</button>
          
          <div className="notification-container">
            <button 
              className="icon-button notification-button" 
              onClick={toggleNotifications}
            >
              🔔
              <span className="notification-badge">3</span>
            </button>
            
            {showNotifications && (
              <div className="dropdown notification-dropdown">
                <h3>Notifications</h3>
                <ul className="notification-list">
                  <li className="notification-item unread">
                    <div className="notification-icon">📄</div>
                    <div className="notification-content">
                      <p>New document uploaded: <strong>Site Plan v2</strong></p>
                      <span className="notification-time">2 hours ago</span>
                    </div>
                  </li>
                  <li className="notification-item unread">
                    <div className="notification-icon">✓</div>
                    <div className="notification-content">
                      <p>Task assigned to you: <strong>Review budget proposal</strong></p>
                      <span className="notification-time">Yesterday</span>
                    </div>
                  </li>
                  <li className="notification-item unread">
                    <div className="notification-icon">💬</div>
                    <div className="notification-content">
                      <p>New comment on <strong>Foundation Plans</strong></p>
                      <span className="notification-time">2 days ago</span>
                    </div>
                  </li>
                </ul>
                <div className="notification-footer">
                  <a href="#" className="view-all">View all notifications</a>
                </div>
              </div>
            )}
          </div>
          
          <div className="user-container">
            <button 
              className="user-button" 
              onClick={toggleUserMenu}
            >
              <div className="user-avatar">{currentUser ? getUserInitials() : 'U'}</div>
            </button>
            
            {showUserMenu && (
              <div className="dropdown user-dropdown">
                <div className="user-info">
                  <div className="user-avatar large">{currentUser ? getUserInitials() : 'U'}</div>
                  <div className="user-details">
                    <h3>{currentUser?.name || 'User'}</h3>
                    <p>{currentUser?.email || 'user@example.com'}</p>
                    <span className="user-role">{currentUser?.role || 'User'}</span>
                  </div>
                </div>
                <ul className="user-menu">
                  <li><a href="#" onClick={() => console.log('Navigate to profile')}>My Profile</a></li>
                  <li><a href="#" onClick={() => console.log('Navigate to settings')}>Account Settings</a></li>
                  <li><a href="#" onClick={() => console.log('Navigate to help')}>Help & Support</a></li>
                  <li className="divider"></li>
                  <li><a href="#" className="logout" onClick={handleLogout}>Log Out</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 