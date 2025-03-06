import React, { useState } from 'react';
import { User } from '../types/project';
import '../styles/SettingsPage.css';

interface SettingsPageProps {
  currentUser: User;
  onUpdateUser?: (updates: Partial<User>) => void;
  onUpdatePassword?: (currentPassword: string, newPassword: string) => void;
  onUpdateNotificationSettings?: (settings: NotificationSettings) => void;
}

interface NotificationSettings {
  emailNotifications: boolean;
  taskAssignments: boolean;
  taskUpdates: boolean;
  documentUploads: boolean;
  projectUpdates: boolean;
  dailyDigest: boolean;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  currentUser,
  onUpdateUser = () => {},
  onUpdatePassword = () => {},
  onUpdateNotificationSettings = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'appearance'>('profile');
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    company: currentUser.company || '',
    position: currentUser.position || '',
    avatar_url: currentUser.avatar_url || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    taskAssignments: true,
    taskUpdates: true,
    documentUploads: true,
    projectUpdates: true,
    dailyDigest: false
  });
  
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [colorBlindMode, setColorBlindMode] = useState(false);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(profileForm);
    // In a real app, this would send the data to the server
    alert('Profile updated successfully!');
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    onUpdatePassword(passwordForm.currentPassword, passwordForm.newPassword);
    // In a real app, this would send the data to the server
    alert('Password updated successfully!');
    
    // Reset form
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };
  
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateNotificationSettings(notificationSettings);
    // In a real app, this would send the data to the server
    alert('Notification settings updated successfully!');
  };
  
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value as 'light' | 'dark' | 'system');
  };
  
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(e.target.value as 'small' | 'medium' | 'large');
  };
  
  const handleColorBlindModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorBlindMode(e.target.checked);
  };
  
  const handleAppearanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to the server
    alert('Appearance settings updated successfully!');
  };
  
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>
      
      <div className="settings-container">
        <div className="settings-sidebar">
          <ul className="settings-tabs">
            <li 
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              <i className="tab-icon">👤</i>
              <span>Profile</span>
            </li>
            <li 
              className={activeTab === 'account' ? 'active' : ''}
              onClick={() => setActiveTab('account')}
            >
              <i className="tab-icon">🔒</i>
              <span>Account & Security</span>
            </li>
            <li 
              className={activeTab === 'notifications' ? 'active' : ''}
              onClick={() => setActiveTab('notifications')}
            >
              <i className="tab-icon">🔔</i>
              <span>Notifications</span>
            </li>
            <li 
              className={activeTab === 'appearance' ? 'active' : ''}
              onClick={() => setActiveTab('appearance')}
            >
              <i className="tab-icon">🎨</i>
              <span>Appearance</span>
            </li>
          </ul>
        </div>
        
        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Information</h2>
              <p>Update your personal information and profile details</p>
              
              <form className="settings-form" onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={profileForm.name} 
                    onChange={handleProfileChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={profileForm.email} 
                    onChange={handleProfileChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={profileForm.phone} 
                    onChange={handleProfileChange} 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    value={profileForm.company} 
                    onChange={handleProfileChange} 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="position">Position</label>
                  <input 
                    type="text" 
                    id="position" 
                    name="position" 
                    value={profileForm.position} 
                    onChange={handleProfileChange} 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="avatar_url">Profile Picture URL</label>
                  <input 
                    type="url" 
                    id="avatar_url" 
                    name="avatar_url" 
                    value={profileForm.avatar_url} 
                    onChange={handleProfileChange} 
                  />
                  {profileForm.avatar_url && (
                    <div className="avatar-preview">
                      <img src={profileForm.avatar_url} alt="Profile preview" />
                    </div>
                  )}
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save Changes</button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'account' && (
            <div className="settings-section">
              <h2>Account & Security</h2>
              <p>Manage your account security and password</p>
              
              <div className="account-info">
                <h3>Account Information</h3>
                <div className="info-item">
                  <span className="info-label">Account Type:</span>
                  <span className="info-value">{currentUser.role.replace('_', ' ').charAt(0).toUpperCase() + currentUser.role.replace('_', ' ').slice(1)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account ID:</span>
                  <span className="info-value">{currentUser.id}</span>
                </div>
              </div>
              
              <h3>Change Password</h3>
              <form className="settings-form" onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input 
                    type="password" 
                    id="currentPassword" 
                    name="currentPassword" 
                    value={passwordForm.currentPassword} 
                    onChange={handlePasswordChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    name="newPassword" 
                    value={passwordForm.newPassword} 
                    onChange={handlePasswordChange} 
                    required 
                    minLength={8}
                  />
                  <div className="password-requirements">
                    Password must be at least 8 characters long and include a mix of letters, numbers, and special characters.
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={passwordForm.confirmPassword} 
                    onChange={handlePasswordChange} 
                    required 
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-btn">Update Password</button>
                </div>
              </form>
              
              <div className="security-options">
                <h3>Security Options</h3>
                <div className="security-option">
                  <div className="option-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className="action-btn">Enable</button>
                </div>
                
                <div className="security-option">
                  <div className="option-info">
                    <h4>Login Sessions</h4>
                    <p>Manage your active login sessions</p>
                  </div>
                  <button className="action-btn">Manage</button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <p>Control how and when you receive notifications</p>
              
              <form className="settings-form" onSubmit={handleNotificationSubmit}>
                <div className="notification-group">
                  <div className="notification-option">
                    <div className="option-info">
                      <h4>Email Notifications</h4>
                      <p>Receive notifications via email</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="emailNotifications" 
                        checked={notificationSettings.emailNotifications} 
                        onChange={handleNotificationChange} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-option">
                    <div className="option-info">
                      <h4>Task Assignments</h4>
                      <p>Notify when you are assigned to a task</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="taskAssignments" 
                        checked={notificationSettings.taskAssignments} 
                        onChange={handleNotificationChange} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-option">
                    <div className="option-info">
                      <h4>Task Updates</h4>
                      <p>Notify when tasks you're involved with are updated</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="taskUpdates" 
                        checked={notificationSettings.taskUpdates} 
                        onChange={handleNotificationChange} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-option">
                    <div className="option-info">
                      <h4>Document Uploads</h4>
                      <p>Notify when new documents are uploaded to your projects</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="documentUploads" 
                        checked={notificationSettings.documentUploads} 
                        onChange={handleNotificationChange} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-option">
                    <div className="option-info">
                      <h4>Project Updates</h4>
                      <p>Notify when project details are changed</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="projectUpdates" 
                        checked={notificationSettings.projectUpdates} 
                        onChange={handleNotificationChange} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="notification-option">
                    <div className="option-info">
                      <h4>Daily Digest</h4>
                      <p>Receive a daily summary of all activities</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        name="dailyDigest" 
                        checked={notificationSettings.dailyDigest} 
                        onChange={handleNotificationChange} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save Preferences</button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance Settings</h2>
              <p>Customize the look and feel of the application</p>
              
              <form className="settings-form" onSubmit={handleAppearanceSubmit}>
                <div className="appearance-group">
                  <h3>Theme</h3>
                  <div className="theme-options">
                    <label className={`theme-option ${theme === 'light' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="theme" 
                        value="light" 
                        checked={theme === 'light'} 
                        onChange={handleThemeChange} 
                      />
                      <div className="theme-preview light-theme">
                        <div className="preview-header"></div>
                        <div className="preview-sidebar"></div>
                        <div className="preview-content"></div>
                      </div>
                      <span>Light</span>
                    </label>
                    
                    <label className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="theme" 
                        value="dark" 
                        checked={theme === 'dark'} 
                        onChange={handleThemeChange} 
                      />
                      <div className="theme-preview dark-theme">
                        <div className="preview-header"></div>
                        <div className="preview-sidebar"></div>
                        <div className="preview-content"></div>
                      </div>
                      <span>Dark</span>
                    </label>
                    
                    <label className={`theme-option ${theme === 'system' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="theme" 
                        value="system" 
                        checked={theme === 'system'} 
                        onChange={handleThemeChange} 
                      />
                      <div className="theme-preview system-theme">
                        <div className="preview-header"></div>
                        <div className="preview-sidebar"></div>
                        <div className="preview-content"></div>
                      </div>
                      <span>System</span>
                    </label>
                  </div>
                </div>
                
                <div className="appearance-group">
                  <h3>Font Size</h3>
                  <div className="font-size-options">
                    <label className={`font-option ${fontSize === 'small' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="fontSize" 
                        value="small" 
                        checked={fontSize === 'small'} 
                        onChange={handleFontSizeChange} 
                      />
                      <span className="font-small">Small</span>
                    </label>
                    
                    <label className={`font-option ${fontSize === 'medium' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="fontSize" 
                        value="medium" 
                        checked={fontSize === 'medium'} 
                        onChange={handleFontSizeChange} 
                      />
                      <span className="font-medium">Medium</span>
                    </label>
                    
                    <label className={`font-option ${fontSize === 'large' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="fontSize" 
                        value="large" 
                        checked={fontSize === 'large'} 
                        onChange={handleFontSizeChange} 
                      />
                      <span className="font-large">Large</span>
                    </label>
                  </div>
                </div>
                
                <div className="appearance-group">
                  <h3>Accessibility</h3>
                  <div className="accessibility-options">
                    <div className="accessibility-option">
                      <div className="option-info">
                        <h4>Color Blind Mode</h4>
                        <p>Use color schemes that are easier to distinguish for people with color blindness</p>
                      </div>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          name="colorBlindMode" 
                          checked={colorBlindMode} 
                          onChange={handleColorBlindModeChange} 
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-btn">Save Appearance</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 