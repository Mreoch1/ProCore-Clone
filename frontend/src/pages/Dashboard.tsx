import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getProjects } from '../utils/supabaseClient';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Dashboard.css';

interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  status: string;
  progress: number;
  tasksCount: number;
  tasksCompleted: number;
}

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
}

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState<ProjectSummary[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    tasksCompleted: 0,
    tasksOverdue: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch projects
        const projects = await getProjects();
        
        // Process projects for dashboard display
        const projectSummaries = projects.slice(0, 5).map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          status: project.status,
          progress: project.progress,
          tasksCount: 0, // This would come from a real API
          tasksCompleted: 0 // This would come from a real API
        }));
        
        setRecentProjects(projectSummaries);
        
        // Calculate stats
        setStats({
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'in_progress').length,
          tasksCompleted: 0, // This would come from a real API
          tasksOverdue: 0 // This would come from a real API
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  const statCards: StatCard[] = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: '📊',
      color: 'var(--primary-color)',
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: '🔄',
      color: 'var(--success-color)',
    },
    {
      title: 'Tasks Completed',
      value: stats.tasksCompleted,
      icon: '✅',
      color: 'var(--info-color)',
    },
    {
      title: 'Tasks Overdue',
      value: stats.tasksOverdue,
      icon: '⚠️',
      color: 'var(--warning-color)',
    },
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <div className="dashboard-actions">
          <Link to="/projects/new" className="dashboard-action-button">
            New Project
          </Link>
          <Link to="/tasks" className="dashboard-action-button">
            View Tasks
          </Link>
        </div>
      </div>

      <div className="dashboard-grid">
        {statCards.map((card, index) => (
          <div key={index} className="dashboard-card stat-card" style={{ borderTop: `4px solid ${card.color}` }}>
            <div className="card-icon" style={{ backgroundColor: card.color }}>
              {card.icon}
            </div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <p className="card-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Projects</h2>
          <Link to="/projects" className="view-all-link">
            View All
          </Link>
        </div>
        
        <div className="dashboard-grid">
          {recentProjects.length > 0 ? (
            recentProjects.map(project => (
              <div key={project.id} className="dashboard-card project-card">
                <h3>
                  <Link to={`/projects/${project.id}`}>{project.name}</Link>
                </h3>
                <div className={`status-badge status-${project.status.replace('_', '-')}`}>
                  {project.status.replace('_', ' ')}
                </div>
                <p className="project-description">
                  {project.description?.substring(0, 100)}
                  {project.description && project.description.length > 100 ? '...' : ''}
                </p>
                <div className="project-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{project.progress}%</span>
                </div>
                <div className="project-tasks">
                  <span>{project.tasksCompleted} / {project.tasksCount} tasks completed</span>
                </div>
                <Link to={`/projects/${project.id}`} className="view-project-link">
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No projects found. Create your first project to get started.</p>
              <Link to="/projects/new" className="dashboard-action-button">
                Create Project
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Activity</h2>
        </div>
        <div className="activity-timeline">
          {/* This would be populated with real activity data */}
          <div className="empty-state">
            <p>No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 