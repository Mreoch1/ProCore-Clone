import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/supabaseClient';
import { User } from '../types/User';
import '../styles/SettingsPage.css';

const SettingsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="settings-loading">Loading settings...</div>;
  }

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      
      <div className="settings-container">
        <div className="settings-sidebar">
          <ul>
            <li 
              className={activeTab === 'profile' ? 'active' : ''} 
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </li>
            <li 
              className={activeTab === 'account' ? 'active' : ''} 
              onClick={() => setActiveTab('account')}
            >
              Account
            </li>
            <li 
              className={activeTab === 'notifications' ? 'active' : ''} 
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </li>
            <li 
              className={activeTab === 'appearance' ? 'active' : ''} 
              onClick={() => setActiveTab('appearance')}
            >
              Appearance
            </li>
          </ul>
        </div>
        
        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Settings</h2>
              <p>Update your profile information.</p>
              
              <form className="settings-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    defaultValue={user?.name || ''} 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    defaultValue={user?.email || ''} 
                    disabled 
                  />
                  <small>Email cannot be changed</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input 
                    type="text" 
                    id="company" 
                    defaultValue={user?.company || ''} 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="position">Position</label>
                  <input 
                    type="text" 
                    id="position" 
                    defaultValue={user?.position || ''} 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    defaultValue={user?.phone || ''} 
                  />
                </div>
                
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'account' && (
            <div className="settings-section">
              <h2>Account Settings</h2>
              <p>Manage your account security and preferences.</p>
              
              <div className="settings-card">
                <h3>Change Password</h3>
                <form className="settings-form">
                  <div className="form-group">
                    <label htmlFor="current-password">Current Password</label>
                    <input type="password" id="current-password" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="new-password">New Password</label>
                    <input type="password" id="new-password" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <input type="password" id="confirm-password" />
                  </div>
                  
                  <button type="submit" className="save-button">
                    Update Password
                  </button>
                </form>
              </div>
              
              <div className="settings-card">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account.</p>
                <button className="secondary-button">
                  Enable Two-Factor Authentication
                </button>
              </div>
              
              <div className="settings-card danger-zone">
                <h3>Danger Zone</h3>
                <p>Permanently delete your account and all associated data.</p>
                <button className="danger-button">
                  Delete Account
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Settings</h2>
              <p>Control how and when you receive notifications.</p>
              
              <div className="settings-card">
                <h3>Email Notifications</h3>
                
                <div className="notification-option">
                  <div>
                    <h4>Project Updates</h4>
                    <p>Receive emails about project changes and updates</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="notification-option">
                  <div>
                    <h4>Task Assignments</h4>
                    <p>Receive emails when tasks are assigned to you</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="notification-option">
                  <div>
                    <h4>Document Updates</h4>
                    <p>Receive emails when documents are added or updated</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div className="settings-card">
                <h3>In-App Notifications</h3>
                
                <div className="notification-option">
                  <div>
                    <h4>Project Updates</h4>
                    <p>Receive in-app notifications about project changes</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="notification-option">
                  <div>
                    <h4>Task Assignments</h4>
                    <p>Receive in-app notifications for task assignments</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="notification-option">
                  <div>
                    <h4>Document Updates</h4>
                    <p>Receive in-app notifications for document changes</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance Settings</h2>
              <p>Customize the look and feel of the application.</p>
              
              <div className="settings-card">
                <h3>Theme</h3>
                <div className="theme-options">
                  <div className="theme-option active">
                    <div className="theme-preview light-theme"></div>
                    <span>Light</span>
                  </div>
                  <div className="theme-option">
                    <div className="theme-preview dark-theme"></div>
                    <span>Dark</span>
                  </div>
                  <div className="theme-option">
                    <div className="theme-preview system-theme"></div>
                    <span>System</span>
                  </div>
                </div>
              </div>
              
              <div className="settings-card">
                <h3>Dashboard Layout</h3>
                <p>Choose your preferred dashboard layout.</p>
                <select className="layout-select">
                  <option value="grid">Grid Layout</option>
                  <option value="list">List Layout</option>
                  <option value="compact">Compact Layout</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 