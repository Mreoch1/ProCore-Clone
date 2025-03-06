import { useState } from 'react';
import '../styles/Navigation.css';
import { User } from '../types/project';

interface NavigationProps {
  activeView: 'dashboard' | 'project' | 'tasks' | 'documents' | 'team' | 'reports' | 'schedule' | 'budget' | 'settings' | 'help' | 'terms' | 'privacy';
  onNavChange: (view: 'dashboard' | 'project' | 'tasks' | 'documents' | 'team' | 'reports' | 'schedule' | 'budget' | 'settings' | 'help' | 'terms' | 'privacy') => void;
  onLogout: () => void;
  currentUser: User | null;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeView = 'dashboard', 
  onNavChange = () => {},
  onLogout = () => {},
  currentUser
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleNavClick = (view: 'dashboard' | 'project' | 'tasks' | 'documents' | 'team' | 'reports' | 'schedule' | 'budget' | 'settings' | 'help' | 'terms' | 'privacy') => {
    onNavChange(view);
  };

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser || !currentUser.name) return 'U';
    
    const nameParts = currentUser.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return nameParts[0][0];
  };

  return (
    <nav className={`navigation ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="nav-header">
        <div className="logo">
          <span className="logo-text">ProCore</span>
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {expanded ? '◀' : '▶'}
        </button>
      </div>

      <div className="nav-user" onClick={toggleUserMenu}>
        <div className="avatar">
          {currentUser?.avatar_url ? (
            <img src={currentUser.avatar_url} alt={currentUser.name} />
          ) : (
            getUserInitials()
          )}
        </div>
        <div className="user-info">
          <span className="user-name">{currentUser?.name || 'User'}</span>
          <span className="user-role">{currentUser?.role?.replace('_', ' ') || 'Guest'}</span>
        </div>
        {expanded && <span className="dropdown-icon">▼</span>}
        
        {showUserMenu && (
          <div className="user-menu">
            <ul>
              <li onClick={() => handleNavClick('settings')}>
                <i className="menu-icon">⚙️</i>
                <span>Settings</span>
              </li>
              <li onClick={handleLogout}>
                <i className="menu-icon">🚪</i>
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <ul className="nav-menu">
        <li 
          className={activeView === 'dashboard' ? 'active' : ''} 
          onClick={() => handleNavClick('dashboard')}
        >
          <i className="icon">📊</i>
          <span className="nav-text">Dashboard</span>
        </li>
        <li 
          className={activeView === 'project' ? 'active' : ''} 
          onClick={() => handleNavClick('project')}
        >
          <i className="icon">🏗️</i>
          <span className="nav-text">Projects</span>
        </li>
        <li 
          className={activeView === 'tasks' ? 'active' : ''} 
          onClick={() => handleNavClick('tasks')}
        >
          <i className="icon">✓</i>
          <span className="nav-text">Tasks</span>
        </li>
        <li 
          className={activeView === 'documents' ? 'active' : ''} 
          onClick={() => handleNavClick('documents')}
        >
          <i className="icon">📄</i>
          <span className="nav-text">Documents</span>
        </li>
        <li 
          className={activeView === 'team' ? 'active' : ''} 
          onClick={() => handleNavClick('team')}
        >
          <i className="icon">👥</i>
          <span className="nav-text">Team</span>
        </li>
        <li 
          className={activeView === 'reports' ? 'active' : ''} 
          onClick={() => handleNavClick('reports')}
        >
          <i className="icon">📈</i>
          <span className="nav-text">Reports</span>
        </li>
        <li 
          className={activeView === 'schedule' ? 'active' : ''} 
          onClick={() => handleNavClick('schedule')}
        >
          <i className="icon">📅</i>
          <span className="nav-text">Schedule</span>
        </li>
        <li 
          className={activeView === 'budget' ? 'active' : ''} 
          onClick={() => handleNavClick('budget')}
        >
          <i className="icon">💰</i>
          <span className="nav-text">Budget</span>
        </li>
      </ul>

      <div className="nav-footer">
        <li 
          className={activeView === 'settings' ? 'active' : ''} 
          onClick={() => handleNavClick('settings')}
        >
          <i className="icon">⚙️</i>
          <span className="nav-text">Settings</span>
        </li>
        <li 
          className={activeView === 'help' ? 'active' : ''} 
          onClick={() => handleNavClick('help')}
        >
          <i className="icon">❓</i>
          <span className="nav-text">Help</span>
        </li>
        <div className="legal-links">
          <li 
            className={activeView === 'terms' ? 'active' : ''} 
            onClick={() => handleNavClick('terms')}
          >
            <i className="icon">📜</i>
            <span className="nav-text">Terms</span>
          </li>
          <li 
            className={activeView === 'privacy' ? 'active' : ''} 
            onClick={() => handleNavClick('privacy')}
          >
            <i className="icon">🔒</i>
            <span className="nav-text">Privacy</span>
          </li>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 