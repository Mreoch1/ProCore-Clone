import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { signOut } from '../utils/supabaseClient';
import '../styles/Navigation.css';

const Navigation: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className={`navigation ${collapsed ? 'collapsed' : ''}`}>
      <div className="nav-header">
        <div className="logo">
          {collapsed ? 'PC' : 'ProCore'}
        </div>
        <button 
          className="collapse-toggle" 
          onClick={handleToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <div className="nav-content">
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink 
              to="/" 
              className={`nav-link ${isActive('/') && !isActive('/projects') && !isActive('/tasks') ? 'active' : ''}`}
              title="Dashboard"
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/projects" 
              className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
              title="Projects"
            >
              <span className="nav-icon">📁</span>
              <span className="nav-text">Projects</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink 
              to="/tasks" 
              className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
              title="Tasks"
            >
              <span className="nav-icon">✓</span>
              <span className="nav-text">Tasks</span>
            </NavLink>
          </li>
        </ul>

        <div className="nav-divider"></div>

        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink 
              to="/settings" 
              className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
              title="Settings"
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Settings</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <button 
              className="nav-link sign-out-btn" 
              onClick={handleSignOut}
              title="Sign Out"
            >
              <span className="nav-icon">🚪</span>
              <span className="nav-text">Sign Out</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="nav-footer">
        <div className="app-version">
          <span className="nav-text">v1.0.0</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 