import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types/Project';
import { User } from '../types/User';
import { getProjects, getCurrentUser } from '../utils/supabaseClient';
import '../styles/ProjectsPage.css';

interface ProjectsPageProps {}

const ProjectsPage: React.FC<ProjectsPageProps> = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Project statistics
  const [projectStats, setProjectStats] = useState({
    total: 0,
    planning: 0,
    in_progress: 0,
    completed: 0,
    on_hold: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        // Get projects
        const { data: projectsData, error: projectsError } = await getProjects();
        
        if (projectsError) {
          throw new Error(projectsError.message);
        }
        
        if (projectsData) {
          setProjects(projectsData);
          setFilteredProjects(projectsData);
          calculateProjectStats(projectsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter, sortBy, sortDirection]);
  
  const calculateProjectStats = (projectList: Project[]) => {
    const stats = {
      total: projectList.length,
      planning: 0,
      in_progress: 0,
      completed: 0,
      on_hold: 0
    };
    
    projectList.forEach(project => {
      if (project.status) {
        stats[project.status as keyof typeof stats] += 1;
      }
    });
    
    setProjectStats(stats);
  };
  
  const filterProjects = () => {
    let filtered = [...projects];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.client && project.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.location && project.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA: any = a[sortBy as keyof Project];
      let valueB: any = b[sortBy as keyof Project];
      
      // Handle null values
      if (valueA === null) valueA = sortDirection === 'asc' ? '\uffff' : '';
      if (valueB === null) valueB = sortDirection === 'asc' ? '\uffff' : '';
      
      // Handle date comparison
      if (sortBy === 'created_at' || sortBy === 'start_date' || sortBy === 'end_date') {
        valueA = valueA ? new Date(valueA).getTime() : 0;
        valueB = valueB ? new Date(valueB).getTime() : 0;
      }
      
      // Handle budget comparison
      if (sortBy === 'budget') {
        valueA = valueA || 0;
        valueB = valueB || 0;
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setFilteredProjects(filtered);
  };
  
  const handleCreateProject = () => {
    navigate('/projects/new');
  };
  
  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const getStatusClass = (status: string) => {
    return `status-badge ${status.replace('_', '-')}`;
  };
  
  if (loading) {
    return <div className="loading-container">Loading projects...</div>;
  }
  
  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div className="header-left">
          <h1 className="projects-title">Projects</h1>
          <button 
            className="filter-toggle" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className="fas fa-filter"></i>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        <div className="header-right">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="create-project-btn" onClick={handleCreateProject}>
            <i className="fas fa-plus"></i>
            New Project
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <h3>Status</h3>
            <div className="filter-options">
              <button 
                className={`filter-option ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-option ${statusFilter === 'planning' ? 'active' : ''}`}
                onClick={() => setStatusFilter('planning')}
              >
                Planning
              </button>
              <button 
                className={`filter-option ${statusFilter === 'in_progress' ? 'active' : ''}`}
                onClick={() => setStatusFilter('in_progress')}
              >
                In Progress
              </button>
              <button 
                className={`filter-option ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </button>
              <button 
                className={`filter-option ${statusFilter === 'on_hold' ? 'active' : ''}`}
                onClick={() => setStatusFilter('on_hold')}
              >
                On Hold
              </button>
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Sort By</h3>
            <div className="filter-options">
              <button 
                className={`filter-option ${sortBy === 'created_at' ? 'active' : ''}`}
                onClick={() => setSortBy('created_at')}
              >
                Date Created
              </button>
              <button 
                className={`filter-option ${sortBy === 'name' ? 'active' : ''}`}
                onClick={() => setSortBy('name')}
              >
                Name
              </button>
              <button 
                className={`filter-option ${sortBy === 'start_date' ? 'active' : ''}`}
                onClick={() => setSortBy('start_date')}
              >
                Start Date
              </button>
              <button 
                className={`filter-option ${sortBy === 'end_date' ? 'active' : ''}`}
                onClick={() => setSortBy('end_date')}
              >
                End Date
              </button>
              <button 
                className={`filter-option ${sortBy === 'budget' ? 'active' : ''}`}
                onClick={() => setSortBy('budget')}
              >
                Budget
              </button>
              <button 
                className="sort-direction-btn"
                onClick={toggleSortDirection}
              >
                {sortDirection === 'asc' ? (
                  <i className="fas fa-arrow-up"></i>
                ) : (
                  <i className="fas fa-arrow-down"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="project-stats">
        <div className="stat-card">
          <div className="stat-value">{projectStats.total}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card planning">
          <div className="stat-value">{projectStats.planning}</div>
          <div className="stat-label">Planning</div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-value">{projectStats.in_progress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-value">{projectStats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card on-hold">
          <div className="stat-value">{projectStats.on_hold}</div>
          <div className="stat-label">On Hold</div>
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="no-projects">
          <i className="fas fa-folder-open"></i>
          <h3>No projects found</h3>
          <p>Try adjusting your filters or create a new project</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="project-card"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="project-card-header">
                <h3 className="project-name">{project.name}</h3>
                <span className={getStatusClass(project.status || 'planning')}>
                  {project.status?.replace('_', ' ')}
                </span>
              </div>
              
              <p className="project-description">
                {project.description || 'No description provided'}
              </p>
              
              <div className="project-meta-info">
                {project.client && (
                  <div className="meta-item">
                    <i className="fas fa-building"></i>
                    <span>{project.client}</span>
                  </div>
                )}
                
                {project.location && (
                  <div className="meta-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{project.location}</span>
                  </div>
                )}
                
                <div className="meta-item">
                  <i className="fas fa-calendar"></i>
                  <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
                </div>
                
                {project.budget && (
                  <div className="meta-item">
                    <i className="fas fa-dollar-sign"></i>
                    <span>${project.budget.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <div className="project-card-footer">
                <div className="project-created">
                  Created: {formatDate(project.created_at)}
                </div>
                <button className="view-project-btn">
                  View Details
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage; 