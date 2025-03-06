import { useState } from 'react';
import { Project, Task, Document, User } from '../types/project';
import TodoList from './TodoList';
import '../styles/ProjectDetail.css';

interface ProjectDetailProps {
  project: Project;
  tasks?: Task[];
  documents?: Document[];
  team?: User[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate?: (task: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onDocumentUpload?: (document: Partial<Document>) => void;
  onDocumentDelete?: (documentId: string) => void;
  onBackToDashboard?: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
  project, 
  tasks = [], 
  documents = [], 
  team = [],
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  onDocumentUpload,
  onDocumentDelete,
  onBackToDashboard
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    if (!project.end_date) return 'No end date set';
    
    const today = new Date();
    const endDate = new Date(project.end_date);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past due';
    if (diffDays === 0) return 'Due today';
    return `${diffDays} days remaining`;
  };

  // Calculate task stats
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'Completed').length,
    inProgress: tasks.filter(task => task.status === 'In Progress').length,
    notStarted: tasks.filter(task => task.status === 'Not Started').length,
  };

  const handleTaskStatusChange = (taskId: string, status: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { status });
    }
  };

  const handleTaskPriorityChange = (taskId: string, priority: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { priority });
    }
  };

  const handleTaskAssigneeChange = (taskId: string, assigneeId: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { assignee_id: assigneeId });
    }
  };

  const handleCreateTask = (task: Partial<Task>) => {
    if (onTaskCreate) {
      onTaskCreate({
        ...task,
        project_id: project.id
      });
    }
  };

  const handleUploadDocument = (document: Partial<Document>) => {
    if (onDocumentUpload) {
      onDocumentUpload({
        ...document,
        project_id: project.id
      });
    }
  };

  return (
    <div className="project-detail">
      <div className="project-header">
        <div className="project-title-section">
          <button className="back-button" onClick={onBackToDashboard}>
            ← Back to Dashboard
          </button>
          <h1>{project.name}</h1>
          <div className="project-meta">
            <span className="project-client">{project.client}</span>
            <span className="project-status" data-status={project.status}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="project-actions">
          <button className="action-button">Edit Project</button>
          <button className="action-button secondary">Export</button>
        </div>
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
          Tasks <span className="tab-count">{tasks.length}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents <span className="tab-count">{documents.length}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          Team <span className="tab-count">{team.length}</span>
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-card project-info">
                <h3>Project Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Client</div>
                    <div className="info-value">{project.client}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Location</div>
                    <div className="info-value">{project.location || 'N/A'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Start Date</div>
                    <div className="info-value">{formatDate(project.start_date)}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">End Date</div>
                    <div className="info-value">{formatDate(project.end_date)}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Budget</div>
                    <div className="info-value">{formatCurrency(project.budget)}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Project Manager</div>
                    <div className="info-value">{project.manager || 'Not assigned'}</div>
                  </div>
                </div>
              </div>

              <div className="overview-card project-progress">
                <h3>Project Progress</h3>
                <div className="progress-container">
                  <div className="progress-circle">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path className="circle-bg"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path className="circle"
                        strokeDasharray={`${project.progress || 0}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.35" className="percentage">{project.progress || 0}%</text>
                    </svg>
                  </div>
                  <div className="progress-info">
                    <div className="progress-item">
                      <div className="progress-label">Days Remaining</div>
                      <div className="progress-value">{calculateDaysRemaining()}</div>
                    </div>
                    <div className="progress-item">
                      <div className="progress-label">Tasks Completed</div>
                      <div className="progress-value">{taskStats.completed} / {taskStats.total}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overview-card project-description">
                <h3>Description</h3>
                <p>{project.description || 'No description provided.'}</p>
              </div>

              <div className="overview-card task-summary">
                <h3>Task Summary</h3>
                <div className="task-stats">
                  <div className="task-stat-item">
                    <div className="task-stat-value">{taskStats.total}</div>
                    <div className="task-stat-label">Total</div>
                  </div>
                  <div className="task-stat-item completed">
                    <div className="task-stat-value">{taskStats.completed}</div>
                    <div className="task-stat-label">Completed</div>
                  </div>
                  <div className="task-stat-item in-progress">
                    <div className="task-stat-value">{taskStats.inProgress}</div>
                    <div className="task-stat-label">In Progress</div>
                  </div>
                  <div className="task-stat-item not-started">
                    <div className="task-stat-value">{taskStats.notStarted}</div>
                    <div className="task-stat-label">Not Started</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-tab">
            <TodoList 
              tasks={tasks}
              projectId={project.id}
              users={team}
              onTaskUpdate={onTaskUpdate}
              onTaskCreate={onTaskCreate}
              onTaskDelete={onTaskDelete}
            />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="documents-tab">
            <div className="tab-actions">
              <button className="action-button" onClick={() => setActiveTab('upload')}>Upload Document</button>
              <div className="filter-actions">
                <select className="filter-select">
                  <option value="all">All Categories</option>
                  <option value="plans">Plans</option>
                  <option value="contracts">Contracts</option>
                  <option value="permits">Permits</option>
                  <option value="reports">Reports</option>
                </select>
              </div>
            </div>

            <div className="documents-list">
              <div className="documents-header">
                <div className="document-header-name">Name</div>
                <div className="document-header-category">Category</div>
                <div className="document-header-uploaded">Uploaded</div>
                <div className="document-header-by">By</div>
                <div className="document-header-actions">Actions</div>
              </div>
              
              {documents.length > 0 ? (
                documents.map(doc => (
                  <div key={doc.id} className="document-row">
                    <div className="document-name">
                      <div className="document-icon">
                        {doc.file_type.includes('pdf') ? '📄' : 
                         doc.file_type.includes('image') ? '🖼️' : 
                         doc.file_type.includes('sheet') ? '📊' : 
                         doc.file_type.includes('document') ? '📝' : '📁'}
                      </div>
                      <div>
                        <div className="document-title">{doc.title}</div>
                        <div className="document-meta">
                          {(doc.file_size / 1024 / 1024).toFixed(2)} MB • {doc.file_type}
                        </div>
                      </div>
                    </div>
                    <div className="document-category">
                      {doc.category || 'Uncategorized'}
                    </div>
                    <div className="document-uploaded">
                      {formatDate(doc.uploaded_at)}
                    </div>
                    <div className="document-by">
                      {doc.uploaded_by}
                    </div>
                    <div className="document-actions">
                      <a href={doc.url} className="icon-button" title="Download" target="_blank" rel="noopener noreferrer">⬇️</a>
                      <button className="icon-button" title="Share">🔗</button>
                      <button 
                        className="icon-button" 
                        title="Delete"
                        onClick={() => onDocumentDelete && onDocumentDelete(doc.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No documents have been uploaded to this project yet.</p>
                  <button className="action-button" onClick={() => setActiveTab('upload')}>Upload First Document</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="team-tab">
            <div className="tab-actions">
              <button className="action-button">Add Team Member</button>
              <div className="filter-actions">
                <select className="filter-select">
                  <option value="all">All Roles</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="team_member">Team Member</option>
                  <option value="client">Client</option>
                </select>
              </div>
            </div>

            <div className="team-list">
              {team.length > 0 ? (
                team.map(member => (
                  <div key={member.id} className="team-card">
                    <div className="team-avatar">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt={member.name || `${member.first_name} ${member.last_name}`} />
                      ) : (
                        <div className="avatar-placeholder">
                          {member.first_name ? member.first_name.charAt(0) : ''}
                          {member.last_name ? member.last_name.charAt(0) : ''}
                        </div>
                      )}
                    </div>
                    <div className="team-info">
                      <h4>{member.name || `${member.first_name} ${member.last_name}`}</h4>
                      <div className="team-role" data-role={member.role}>
                        {member.role?.replace('_', ' ') || 'Team Member'}
                      </div>
                      <div className="team-contact">
                        <div className="team-email">{member.email}</div>
                        {member.phone && (
                          <div className="team-phone">{member.phone}</div>
                        )}
                      </div>
                      {member.company && (
                        <div className="team-company">{member.company}</div>
                      )}
                    </div>
                    <div className="team-actions">
                      <button className="icon-button" title="Email">✉️</button>
                      <button className="icon-button" title="Edit">✏️</button>
                      <button className="icon-button" title="Remove">❌</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No team members have been added to this project yet.</p>
                  <button className="action-button">Add First Team Member</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail; 