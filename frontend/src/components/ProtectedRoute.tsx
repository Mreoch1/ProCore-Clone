import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  requiredRoles?: Array<'admin' | 'project_manager' | 'team_member' | 'client'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const { user, isAuthenticated, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role (if specified)
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If authenticated and has required role, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 