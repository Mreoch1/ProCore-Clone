import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from '../utils/supabaseClient';
import '../styles/Navigation.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`navigation ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="nav-header">
        <div className="logo">
          <img src="/logo.svg" alt="Recon Logo" />
          {!isCollapsed && <span>Recon</span>}
        </div>
        <button className="collapse-btn" onClick={toggleCollapse}>
          <i className={`fas fa-${isCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
        </button>
      </div>
      
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-home"></i>
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>
        
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-project-diagram"></i>
          {!isCollapsed && <span>Projects</span>}
        </NavLink>
        
        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-tasks"></i>
          {!isCollapsed && <span>Tasks</span>}
        </NavLink>
        
        <NavLink to="/documents" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-file-alt"></i>
          {!isCollapsed && <span>Documents</span>}
        </NavLink>
        
        <NavLink to="/team" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-users"></i>
          {!isCollapsed && <span>Team</span>}
        </NavLink>
        
        <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-chart-bar"></i>
          {!isCollapsed && <span>Reports</span>}
        </NavLink>
        
        <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-calendar-alt"></i>
          {!isCollapsed && <span>Schedule</span>}
        </NavLink>
        
        <NavLink to="/budget" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-dollar-sign"></i>
          {!isCollapsed && <span>Budget</span>}
        </NavLink>
      </div>
      
      <div className="nav-footer">
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-cog"></i>
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
        
        <NavLink to="/help" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="fas fa-question-circle"></i>
          {!isCollapsed && <span>Help</span>}
        </NavLink>
        
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navigation; 