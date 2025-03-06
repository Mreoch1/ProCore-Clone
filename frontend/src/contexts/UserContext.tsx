import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, UserPreferences } from '../types/User';
import { 
  signIn, 
  signUp, 
  signOut, 
  resetPassword as resetPasswordRequest, 
  updatePassword, 
  getCurrentUser,
  updateUserProfile
} from '../utils/supabaseClient';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userPreferences: UserPreferences | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  notifications: {
    email: true,
    push: true,
    inApp: true,
  },
  language: 'en',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          
          // Load preferences from localStorage or set defaults
          const storedPreferences = localStorage.getItem(`preferences_${currentUser.id}`);
          setUserPreferences(
            storedPreferences ? JSON.parse(storedPreferences) : defaultPreferences
          );
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signIn(email, password);
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        
        // Load preferences from localStorage or set defaults
        const storedPreferences = localStorage.getItem(`preferences_${currentUser.id}`);
        setUserPreferences(
          storedPreferences ? JSON.parse(storedPreferences) : defaultPreferences
        );
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await signUp(email, password, {
        name,
        role: 'team_member',
      });
      
      // After registration, log the user in
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
      setUserPreferences(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      if (user) {
        const updatedUser = await updateUserProfile(user.id, userData);
        if (updatedUser) {
          setUser(updatedUser);
        }
      }
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    setIsLoading(true);
    try {
      if (user && userPreferences) {
        const updatedPreferences = {
          ...userPreferences,
          ...preferences,
          notifications: {
            ...userPreferences.notifications,
            ...(preferences.notifications || {}),
          },
        };
        
        setUserPreferences(updatedPreferences);
        localStorage.setItem(`preferences_${user.id}`, JSON.stringify(updatedPreferences));
      }
    } catch (error) {
      console.error('Update preferences failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await resetPasswordRequest(email);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (newPassword: string) => {
    setIsLoading(true);
    try {
      await updatePassword(newPassword);
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        userPreferences,
        login,
        register,
        logout,
        updateUser,
        updatePreferences,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 