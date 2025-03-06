import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  getProject, 
  getProjectTasks, 
  getProjectTeam, 
  getProjectDocuments,
  deleteProject
} from '../utils/supabaseClient';
import { Project } from '../types/Project';
import { Task } from '../types/Task';
import { Document } from '../types/Document';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/ProjectPage.css';

interface ProjectPageParams {
  projectId: string;
}

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<keyof ProjectPageParams>() as ProjectPageParams;
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setLoading(true);
        
        // Load project details
        const projectData = await getProject(projectId);
        if (!projectData) {
          setError('Project not found');
          setLoading(false);
          return;
        }
        setProject(projectData);
        
        // Load project tasks
        const tasksData = await getProjectTasks(projectId);
        setTasks(tasksData);
        
        // Load project team
        const teamData = await getProjectTeam(projectId);
        setTeam(teamData);
        
        // Load project documents
        const documentsData = await getProjectDocuments(projectId);
        setDocuments(documentsData);
        
        // Check if user is admin or project manager
        setIsAdmin(user?.role === 'admin' || user?.role === 'project_manager');
        
      } catch (err) {
        console.error('Error loading project data:', err);
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };
    
    loadProjectData();
  }, [projectId, user?.role]);

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      const success = await deleteProject(projectId);
      
      if (success) {
        navigate('/projects', { state: { message: 'Project deleted successfully' } });
      } else {
        setError('Failed to delete project');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading project details..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/projects" className="btn btn-primary">Back to Projects</Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="not-found-container">
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/projects" className="btn btn-primary">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="project-page">
      <div className="project-header">
        <div className="project-title">
          <h1>{project.name}</h1>
          <span className={`status-badge status-${project.status}`}>
            {project.status.replace('_', ' ')}
          </span>
        </div>
        
        <div className="project-actions">
          {isAdmin && (
            <>
              <Link to={`/projects/${projectId}/edit`} className="btn btn-secondary">
                Edit Project
              </Link>
              <button onClick={handleDeleteProject} className="btn btn-danger">
                Delete Project
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="project-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <span className="progress-text">{project.progress}% Complete</span>
      </div>
      
      <div className="project-meta">
        <div className="meta-item">
          <span className="meta-label">Client:</span>
          <span className="meta-value">{project.clientName || 'N/A'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Start Date:</span>
          <span className="meta-value">
            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">End Date:</span>
          <span className="meta-value">
            {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
          </span>
        </div>
        {project.budget && (
          <div className="meta-item">
            <span className="meta-label">Budget:</span>
            <span className="meta-value">${project.budget.toLocaleString()}</span>
          </div>
        )}
        {project.location && (
          <div className="meta-item">
            <span className="meta-label">Location:</span>
            <span className="meta-value">{project.location}</span>
          </div>
        )}
      </div>
      
      <div className="project-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks ({tasks.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          Team ({team.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents ({documents.length})
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="description-section">
              <h3>Description</h3>
              <p>{project.description || 'No description provided.'}</p>
            </div>
            
            <div className="stats-section">
              <div className="stat-card">
                <h4>Tasks</h4>
                <div className="stat-value">{tasks.length}</div>
                <div className="stat-breakdown">
                  <div>Completed: {tasks.filter(t => t.status === 'completed').length}</div>
                  <div>In Progress: {tasks.filter(t => t.status === 'in_progress').length}</div>
                  <div>To Do: {tasks.filter(t => t.status === 'todo').length}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <h4>Team</h4>
                <div className="stat-value">{team.length}</div>
              </div>
              
              <div className="stat-card">
                <h4>Documents</h4>
                <div className="stat-value">{documents.length}</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'tasks' && (
          <div className="tasks-tab">
            <div className="tab-header">
              <h3>Project Tasks</h3>
              <Link to={`/projects/${projectId}/tasks/new`} className="btn btn-primary">
                Add Task
              </Link>
            </div>
            
            {tasks.length === 0 ? (
              <p className="empty-state">No tasks have been added to this project yet.</p>
            ) : (
              <div className="tasks-list">
                {tasks.map(task => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <h4 className="task-title">
                        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                      </h4>
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="task-meta">
                      <span className={`status-badge status-${task.status}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      
                      {task.dueDate && (
                        <span className="due-date">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="task-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{task.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'team' && (
          <div className="team-tab">
            <div className="tab-header">
              <h3>Project Team</h3>
              {isAdmin && (
                <button className="btn btn-primary">Add Team Member</button>
              )}
            </div>
            
            {team.length === 0 ? (
              <p className="empty-state">No team members have been assigned to this project yet.</p>
            ) : (
              <div className="team-list">
                {team.map(member => (
                  <div key={member.id} className="team-member-card">
                    <div className="member-avatar">
                      {member.user_name?.charAt(0) || 'U'}
                    </div>
                    <div className="member-info">
                      <h4>{member.user_name}</h4>
                      <p>{member.role}</p>
                    </div>
                    {isAdmin && (
                      <button className="btn btn-danger btn-sm">Remove</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div className="documents-tab">
            <div className="tab-header">
              <h3>Project Documents</h3>
              <button className="btn btn-primary">Upload Document</button>
            </div>
            
            {documents.length === 0 ? (
              <p className="empty-state">No documents have been uploaded to this project yet.</p>
            ) : (
              <div className="documents-list">
                {documents.map(doc => (
                  <div key={doc.id} className="document-card">
                    <div className="document-icon">
                      <i className="fas fa-file"></i>
                    </div>
                    <div className="document-info">
                      <h4>{doc.name}</h4>
                      <p>
                        {doc.type} • {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="document-date">
                        Uploaded: {new Date(doc.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="document-actions">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                        View
                      </a>
                      <button className="btn btn-sm btn-danger">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage; 