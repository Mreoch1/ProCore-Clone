import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { UserProvider, useUser } from './contexts/UserContext';

// Components
import Navigation from './components/Navigation';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import ProjectPage from './pages/ProjectPage';
import NewProjectPage from './pages/NewProjectPage';
import TasksPage from './pages/TasksPage';
import SettingsPage from './pages/SettingsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Styles
import './App.css';

const AppRoutes = () => {
  const { user, isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading application..." />;
  }

  return (
    <div className="app">
      {isAuthenticated ? (
        <>
          <Navigation />
          <div className="main-content">
            <Header user={user!} />
            <div className="content-container">
              <Routes>
                {/* Public routes */}
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Protected routes for all authenticated users */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Protected routes for project managers and admins */}
                <Route element={<ProtectedRoute requiredRoles={['admin', 'project_manager']} />}>
                  <Route path="/projects/new" element={<NewProjectPage />} />
                </Route>

                {/* Protected routes for all except clients */}
                <Route element={<ProtectedRoute requiredRoles={['admin', 'project_manager', 'team_member']} />}>
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:projectId" element={<ProjectPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </>
      ) : (
        <>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Footer />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </Router>
  );
}

export default App; 