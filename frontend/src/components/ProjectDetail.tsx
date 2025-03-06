import { useState } from 'react';
import { Project, Task, Document, User } from '../types/project';
import '../styles/ProjectDetail.css';

interface ProjectDetailProps {
  project: Project;
  tasks: Task[];
  documents: Document[];
  team: User[];
  onTaskUpdate?: (task: Task) => void;
  onDocumentUpload?: (document: Document) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  tasks,
  documents,
  team,
  onTaskUpdate,
  onDocumentUpload
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'documents' | 'team'>('overview');
  const [newTask, setNewTask] = useState<Partial<Task>>({
    project_id: project.id,
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee_id: '',
    due_date: ''
  });
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const handleTaskCreate = () => {
    console.log('Creating new task:', newTask);
    // In a real app, this would call an API to create the task
    
    // Reset form and close modal
    setNewTask({
      project_id: project.id,
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee_id: '',
      due_date: ''
    });
    setShowNewTaskModal(false);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    if (!onTaskUpdate) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    onTaskUpdate({
      ...task,
      status: newStatus
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onDocumentUpload || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    // In a real app, this would upload the file to storage and then save the document
    console.log('Uploading file:', file);
    
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      project_id: project.id,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploaded_by: 'current-user-id', // This would be the current user's ID
      created_at: new Date().toISOString()
    };
    
    onDocumentUpload(newDocument);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getProjectProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const getTeamMembers = () => {
    return team.filter(member => project.team_members.includes(member.id));
  };

  return (
    <div className="project-detail">
      <div className="project-header">
        <div className="project-info">
          <h2>{project.name}</h2>
          <div className="project-meta">
            <span className="project-client">{project.client}</span>
            <span className="project-location">{project.location}</span>
            <span className="project-dates">
              {formatDate(project.start_date)} - {formatDate(project.end_date)}
            </span>
            <span className="project-status" data-status={project.status}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="project-actions">
          <button className="project-action-button">
            <i className="fas fa-edit"></i> Edit Project
          </button>
          <button className="project-action-button">
            <i className="fas fa-trash"></i> Delete Project
          </button>
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
          Tasks ({tasks.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents ({documents.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          Team ({getTeamMembers().length})
        </button>
      </div>
      
      <div className="project-content">
        {activeTab === 'overview' && (
          <div className="project-overview">
            <div className="overview-section">
              <h3>Description</h3>
              <p>{project.description || 'No description provided.'}</p>
            </div>
            
            <div className="overview-section">
              <h3>Progress</h3>
              <div className="project-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${getProjectProgress()}%` }}
                  ></div>
                </div>
                <span className="progress-percent">{getProjectProgress()}% Complete</span>
              </div>
              <div className="task-stats">
                <div className="task-stat">
                  <span className="stat-value">{tasks.length}</span>
                  <span className="stat-label">Total Tasks</span>
                </div>
                <div className="task-stat">
                  <span className="stat-value">{tasks.filter(t => t.status === 'completed').length}</span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="task-stat">
                  <span className="stat-value">{tasks.filter(t => t.status === 'in_progress').length}</span>
                  <span className="stat-label">In Progress</span>
                </div>
                <div className="task-stat">
                  <span className="stat-value">{tasks.filter(t => t.status === 'todo').length}</span>
                  <span className="stat-label">To Do</span>
                </div>
              </div>
            </div>
            
            <div className="overview-section">
              <h3>Budget</h3>
              <div className="budget-info">
                <div className="budget-amount">
                  <span className="budget-label">Total Budget</span>
                  <span className="budget-value">${project.budget.toLocaleString()}</span>
                </div>
                {/* In a real app, you would calculate spent amount and remaining budget */}
                <div className="budget-amount">
                  <span className="budget-label">Spent</span>
                  <span className="budget-value">$0</span>
                </div>
                <div className="budget-amount">
                  <span className="budget-label">Remaining</span>
                  <span className="budget-value">${project.budget.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'tasks' && (
          <div className="project-tasks">
            <div className="tasks-header">
              <h3>Tasks</h3>
              <button 
                className="add-task-button"
                onClick={() => setShowNewTaskModal(true)}
              >
                <i className="fas fa-plus"></i> Add Task
              </button>
            </div>
            
            <div className="task-board">
              <div className="task-column">
                <div className="column-header">
                  <h4>To Do</h4>
                  <span className="task-count">{tasks.filter(t => t.status === 'todo').length}</span>
                </div>
                <div className="task-list">
                  {tasks.filter(t => t.status === 'todo').map(task => (
                    <div key={task.id} className="task-card" data-priority={task.priority}>
                      <div className="task-card-header">
                        <h5>{task.title}</h5>
                        <span className="task-priority">{task.priority}</span>
                      </div>
                      <p className="task-description">{task.description}</p>
                      <div className="task-card-footer">
                        <span className="task-assignee">
                          {team.find(u => u.id === task.assignee_id)?.name || 'Unassigned'}
                        </span>
                        <span className="task-due-date">{formatDate(task.due_date)}</span>
                      </div>
                      <div className="task-actions">
                        <button onClick={() => handleTaskStatusChange(task.id, 'in_progress')}>
                          Move to In Progress
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="task-column">
                <div className="column-header">
                  <h4>In Progress</h4>
                  <span className="task-count">{tasks.filter(t => t.status === 'in_progress').length}</span>
                </div>
                <div className="task-list">
                  {tasks.filter(t => t.status === 'in_progress').map(task => (
                    <div key={task.id} className="task-card" data-priority={task.priority}>
                      <div className="task-card-header">
                        <h5>{task.title}</h5>
                        <span className="task-priority">{task.priority}</span>
                      </div>
                      <p className="task-description">{task.description}</p>
                      <div className="task-card-footer">
                        <span className="task-assignee">
                          {team.find(u => u.id === task.assignee_id)?.name || 'Unassigned'}
                        </span>
                        <span className="task-due-date">{formatDate(task.due_date)}</span>
                      </div>
                      <div className="task-actions">
                        <button onClick={() => handleTaskStatusChange(task.id, 'todo')}>
                          Move to To Do
                        </button>
                        <button onClick={() => handleTaskStatusChange(task.id, 'review')}>
                          Move to Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="task-column">
                <div className="column-header">
                  <h4>Review</h4>
                  <span className="task-count">{tasks.filter(t => t.status === 'review').length}</span>
                </div>
                <div className="task-list">
                  {tasks.filter(t => t.status === 'review').map(task => (
                    <div key={task.id} className="task-card" data-priority={task.priority}>
                      <div className="task-card-header">
                        <h5>{task.title}</h5>
                        <span className="task-priority">{task.priority}</span>
                      </div>
                      <p className="task-description">{task.description}</p>
                      <div className="task-card-footer">
                        <span className="task-assignee">
                          {team.find(u => u.id === task.assignee_id)?.name || 'Unassigned'}
                        </span>
                        <span className="task-due-date">{formatDate(task.due_date)}</span>
                      </div>
                      <div className="task-actions">
                        <button onClick={() => handleTaskStatusChange(task.id, 'in_progress')}>
                          Move to In Progress
                        </button>
                        <button onClick={() => handleTaskStatusChange(task.id, 'completed')}>
                          Move to Completed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="task-column">
                <div className="column-header">
                  <h4>Completed</h4>
                  <span className="task-count">{tasks.filter(t => t.status === 'completed').length}</span>
                </div>
                <div className="task-list">
                  {tasks.filter(t => t.status === 'completed').map(task => (
                    <div key={task.id} className="task-card" data-priority={task.priority}>
                      <div className="task-card-header">
                        <h5>{task.title}</h5>
                        <span className="task-priority">{task.priority}</span>
                      </div>
                      <p className="task-description">{task.description}</p>
                      <div className="task-card-footer">
                        <span className="task-assignee">
                          {team.find(u => u.id === task.assignee_id)?.name || 'Unassigned'}
                        </span>
                        <span className="task-due-date">{formatDate(task.due_date)}</span>
                      </div>
                      <div className="task-actions">
                        <button onClick={() => handleTaskStatusChange(task.id, 'review')}>
                          Move to Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div className="project-documents">
            <div className="documents-header">
              <h3>Documents</h3>
              <div className="document-actions">
                <label className="upload-button">
                  <i className="fas fa-upload"></i> Upload Document
                  <input 
                    type="file" 
                    onChange={handleFileUpload} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>
            </div>
            
            <div className="documents-list">
              {documents.length > 0 ? (
                <table className="documents-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Size</th>
                      <th>Uploaded By</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc.id}>
                        <td className="document-name">
                          <i className={`fas fa-file${doc.type.includes('pdf') ? '-pdf' : doc.type.includes('image') ? '-image' : ''}`}></i>
                          {doc.name}
                        </td>
                        <td>{doc.type}</td>
                        <td>{formatFileSize(doc.size)}</td>
                        <td>{team.find(u => u.id === doc.uploaded_by)?.name || 'Unknown'}</td>
                        <td>{formatDate(doc.created_at || '')}</td>
                        <td className="document-actions">
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="document-action">
                            <i className="fas fa-download"></i>
                          </a>
                          <button className="document-action">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-documents">
                  <p>No documents have been uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'team' && (
          <div className="project-team">
            <div className="team-header">
              <h3>Team Members</h3>
              <button className="add-member-button">
                <i className="fas fa-user-plus"></i> Add Team Member
              </button>
            </div>
            
            <div className="team-list">
              {getTeamMembers().length > 0 ? (
                getTeamMembers().map(member => (
                  <div key={member.id} className="team-member-card">
                    <img 
                      src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`} 
                      alt={member.name} 
                      className="member-avatar" 
                    />
                    <div className="member-info">
                      <h4>{member.name}</h4>
                      <p className="member-role">{member.role.replace('_', ' ')}</p>
                      <p className="member-position">{member.position}</p>
                      <p className="member-contact">
                        <i className="fas fa-envelope"></i> {member.email}
                        {member.phone && (
                          <>
                            <br />
                            <i className="fas fa-phone"></i> {member.phone}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="member-actions">
                      <button className="member-action">
                        <i className="fas fa-user-minus"></i> Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-team-members">
                  <p>No team members have been assigned to this project.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {showNewTaskModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Task</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleTaskCreate(); }}>
              <div className="form-group">
                <label htmlFor="task-title">Task Title</label>
                <input 
                  id="task-title"
                  type="text" 
                  value={newTask.title} 
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="task-description">Description</label>
                <textarea 
                  id="task-description"
                  value={newTask.description} 
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows={3}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="task-assignee">Assignee</label>
                <select 
                  id="task-assignee"
                  value={newTask.assignee_id} 
                  onChange={(e) => setNewTask({...newTask, assignee_id: e.target.value})}
                >
                  <option value="">Select Assignee</option>
                  {team.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-priority">Priority</label>
                <select 
                  id="task-priority"
                  value={newTask.priority} 
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as Task['priority']})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-due-date">Due Date</label>
                <input 
                  id="task-due-date"
                  type="date" 
                  value={newTask.due_date} 
                  onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowNewTaskModal(false)}>Cancel</button>
                <button type="submit">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail; 