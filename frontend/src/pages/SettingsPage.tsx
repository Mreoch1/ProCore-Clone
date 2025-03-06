import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SettingsPage.css';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  department: string;
  avatar: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskReminders: boolean;
  projectUpdates: boolean;
  teamMessages: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // User profile state
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    department: '',
    avatar: '',
  });
  
  // Notification settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    projectUpdates: true,
    teamMessages: true,
  });
  
  // Security settings state
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
  });
  
  // Fetch user data
  useEffect(() => {
    // Simulating API call to fetch user data
    setIsLoading(true);
    setTimeout(() => {
      setProfile({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        jobTitle: 'Project Manager',
        department: 'Engineering',
        avatar: 'https://via.placeholder.com/150',
      });
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setSecurity(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulating API call to save settings
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      
      // Reset saved message after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }, 1500);
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Simulating account deletion
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/login');
      }, 1500);
    }
  };
  
  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-sidebar">
          <h2>Settings</h2>
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
              className={activeTab === 'security' ? 'active' : ''} 
              onClick={() => setActiveTab('security')}
            >
              Security
            </li>
          </ul>
        </div>
        
        <div className="settings-content">
          {isLoading && (
            <div className="settings-loading">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          )}
          
          {!isLoading && (
            <>
              {isSaved && (
                <div className="settings-saved">
                  Settings saved successfully!
                </div>
              )}
              
              {error && (
                <div className="settings-error">
                  {error}
                </div>
              )}
              
              {activeTab === 'profile' && (
                <div className="settings-section">
                  <h3>Profile Settings</h3>
                  <div className="profile-avatar">
                    <img src={profile.avatar || 'https://via.placeholder.com/150'} alt="Profile" />
                    <button className="change-avatar-btn">Change Photo</button>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      value={profile.firstName} 
                      onChange={handleProfileChange} 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      value={profile.lastName} 
                      onChange={handleProfileChange} 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={profile.email} 
                      onChange={handleProfileChange} 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="jobTitle">Job Title</label>
                    <input 
                      type="text" 
                      id="jobTitle" 
                      name="jobTitle" 
                      value={profile.jobTitle} 
                      onChange={handleProfileChange} 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <input 
                      type="text" 
                      id="department" 
                      name="department" 
                      value={profile.department} 
                      onChange={handleProfileChange} 
                    />
                  </div>
                  
                  <div className="settings-actions">
                    <button className="save-btn" onClick={handleSaveSettings}>
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'account' && (
                <div className="settings-section">
                  <h3>Account Settings</h3>
                  
                  <div className="form-group">
                    <label htmlFor="language">Language</label>
                    <select id="language" name="language">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="timezone">Timezone</label>
                    <select id="timezone" name="timezone">
                      <option value="utc">UTC</option>
                      <option value="est">Eastern Time (ET)</option>
                      <option value="cst">Central Time (CT)</option>
                      <option value="mst">Mountain Time (MT)</option>
                      <option value="pst">Pacific Time (PT)</option>
                    </select>
                  </div>
                  
                  <div className="settings-actions">
                    <button className="save-btn" onClick={handleSaveSettings}>
                      Save Changes
                    </button>
                  </div>
                  
                  <div className="danger-zone">
                    <h4>Danger Zone</h4>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="delete-btn" onClick={handleDeleteAccount}>
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="settings-section">
                  <h3>Notification Settings</h3>
                  
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="emailNotifications" 
                      name="emailNotifications" 
                      checked={notifications.emailNotifications} 
                      onChange={handleNotificationChange} 
                    />
                    <label htmlFor="emailNotifications">Email Notifications</label>
                  </div>
                  
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="pushNotifications" 
                      name="pushNotifications" 
                      checked={notifications.pushNotifications} 
                      onChange={handleNotificationChange} 
                    />
                    <label htmlFor="pushNotifications">Push Notifications</label>
                  </div>
                  
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="taskReminders" 
                      name="taskReminders" 
                      checked={notifications.taskReminders} 
                      onChange={handleNotificationChange} 
                    />
                    <label htmlFor="taskReminders">Task Reminders</label>
                  </div>
                  
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="projectUpdates" 
                      name="projectUpdates" 
                      checked={notifications.projectUpdates} 
                      onChange={handleNotificationChange} 
                    />
                    <label htmlFor="projectUpdates">Project Updates</label>
                  </div>
                  
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="teamMessages" 
                      name="teamMessages" 
                      checked={notifications.teamMessages} 
                      onChange={handleNotificationChange} 
                    />
                    <label htmlFor="teamMessages">Team Messages</label>
                  </div>
                  
                  <div className="settings-actions">
                    <button className="save-btn" onClick={handleSaveSettings}>
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div className="settings-section">
                  <h3>Security Settings</h3>
                  
                  <div className="checkbox-group">
                    <input 
                      type="checkbox" 
                      id="twoFactorAuth" 
                      name="twoFactorAuth" 
                      checked={security.twoFactorAuth} 
                      onChange={handleSecurityChange} 
                    />
                    <label htmlFor="twoFactorAuth">Two-Factor Authentication</label>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
                    <select 
                      id="sessionTimeout" 
                      name="sessionTimeout" 
                      value={security.sessionTimeout} 
                      onChange={handleSecurityChange}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input type="password" id="currentPassword" name="currentPassword" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input type="password" id="newPassword" name="newPassword" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" />
                  </div>
                  
                  <div className="settings-actions">
                    <button className="save-btn" onClick={handleSaveSettings}>
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 