import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getProjects } from '../utils/supabaseClient';
import { Project } from '../types/Project';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/ProjectsPage.css';

interface LocationState {
  message?: string;
}

const ProjectsPage: React.FC = () => {
  const location = useLocation();
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [message, setMessage] = useState<string | null>(null);
  
  // Get message from location state if available
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.message) {
      setMessage(state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);

  // Filter and sort projects whenever dependencies change
  useEffect(() => {
    let result = [...projects];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(term) || 
        project.description?.toLowerCase().includes(term) ||
        project.clientName?.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(project => project.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        case 'client':
          comparison = (a.clientName || '').localeCompare(b.clientName || '');
          break;
        case 'startDate':
          comparison = new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime();
          break;
        case 'endDate':
          comparison = new Date(a.endDate || 0).getTime() - new Date(b.endDate || 0).getTime();
          break;
        case 'progress':
          comparison = (a.progress || 0) - (b.progress || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading projects..." />;
  }

  const canCreateProject = user?.role === 'admin' || user?.role === 'project_manager';

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects</h1>
        {canCreateProject && (
          <Link to="/projects/new" className="btn btn-primary">
            <i className="fas fa-plus"></i> New Project
          </Link>
        )}
      </div>
      
      {message && (
        <div className="alert alert-success">
          {message}
          <button className="close-btn" onClick={() => setMessage(null)}>×</button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          {error}
          <button className="close-btn" onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <div className="projects-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <i className="fas fa-search"></i>
        </div>
        
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="sort-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="client">Client</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
            <option value="progress">Progress</option>
          </select>
          
          <button 
            className="sort-order-btn" 
            onClick={toggleSortOrder}
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <p>No projects found. {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters.' : ''}</p>
          {canCreateProject && (
            <Link to="/projects/new" className="btn btn-primary">
              Create Your First Project
            </Link>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <Link to={`/projects/${project.id}`} key={project.id} className="project-card">
              <div className="project-card-header">
                <h3 className="project-name">{project.name}</h3>
                <span className={`status-badge status-${project.status}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="project-card-body">
                <p className="project-description">
                  {project.description ? (
                    project.description.length > 100 
                      ? `${project.description.substring(0, 100)}...` 
                      : project.description
                  ) : 'No description provided.'}
                </p>
                
                <div className="project-meta">
                  {project.clientName && (
                    <div className="meta-item">
                      <span className="meta-label">Client:</span>
                      <span className="meta-value">{project.clientName}</span>
                    </div>
                  )}
                  
                  {project.startDate && (
                    <div className="meta-item">
                      <span className="meta-label">Start:</span>
                      <span className="meta-value">
                        {new Date(project.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {project.endDate && (
                    <div className="meta-item">
                      <span className="meta-label">End:</span>
                      <span className="meta-value">
                        {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="project-card-footer">
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{project.progress}% Complete</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage; 