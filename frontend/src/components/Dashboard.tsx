import { useState, useEffect } from 'react';
import { Project, Task, Document, User } from '../types/project';
import '../styles/Dashboard.css';

interface DashboardProps {
  projects: Project[];
  tasks: Task[];
  documents: Document[];
  team: User[];
  onProjectSelect: (project: Project) => void;
}

interface ActivityItem {
  id: string;
  type: 'document' | 'task' | 'comment' | 'project';
  action: string;
  item: string;
  user: string;
  time: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  projects, 
  tasks, 
  documents, 
  team, 
  onProjectSelect 
}) => {
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [customization, setCustomization] = useState({
    showProjects: true,
    showActivity: true,
    showTasks: true,
    showProgress: true
  });
  const [showCustomizationMenu, setShowCustomizationMenu] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    clientName: '',
    location: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    budget: 0,
    teamMembers: []
  });

  // Generate activity feed from tasks, documents, and projects
  useEffect(() => {
    const activity: ActivityItem[] = [];
    
    // Add recent tasks
    tasks.slice(0, 5).forEach(task => {
      const user = team.find(u => u.id === task.assigneeId)?.name || 'Unknown User';
      activity.push({
        id: `task-${task.id}`,
        type: 'task',
        action: 'updated',
        item: task.title,
        user,
        time: task.updatedAt || task.createdAt || new Date().toISOString()
      });
    });
    
    // Add recent documents
    documents.slice(0, 3).forEach(doc => {
      const user = team.find(u => u.id === doc.uploaded_by)?.name || 'Unknown User';
      activity.push({
        id: `doc-${doc.id}`,
        type: 'document',
        action: 'uploaded',
        item: doc.name,
        user,
        time: doc.created_at || new Date().toISOString()
      });
    });
    
    // Add recent projects
    projects.slice(0, 2).forEach(project => {
      activity.push({
        id: `project-${project.id}`,
        type: 'project',
        action: 'created',
        item: project.name,
        user: 'System',
        time: project.createdAt || new Date().toISOString()
      });
    });
    
    // Sort by time (most recent first)
    activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    
    setRecentActivity(activity.slice(0, 10));
  }, [tasks, documents, projects, team]);

  const handleNewProject = async () => {
    // In a real app, this would call an API to create the project
    console.log('Creating new project:', newProject);
    
    // Reset form and close modal
    setNewProject({
      name: '',
      description: '',
      clientName: '',
      location: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      budget: 0,
      teamMembers: []
    });
    setShowNewProjectModal(false);
  };

  const toggleCustomization = (key: keyof typeof customization) => {
    setCustomization({
      ...customization,
      [key]: !customization[key]
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome to Recon Project Management</h2>
        <div className="dashboard-actions">
          <button 
            className="dashboard-action-button"
            onClick={() => setShowNewProjectModal(true)}
          >
            <i className="fas fa-plus"></i> New Project
          </button>
          <button 
            className="dashboard-action-button"
            onClick={() => setShowCustomizationMenu(!showCustomizationMenu)}
          >
            <i className="fas fa-cog"></i> Customize Dashboard
          </button>
        </div>
      </div>
      
      {showCustomizationMenu && (
        <div className="customization-menu">
          <h3>Customize Dashboard</h3>
          <div className="customization-options">
            <label>
              <input 
                type="checkbox" 
                checked={customization.showProjects} 
                onChange={() => toggleCustomization('showProjects')} 
              />
              Show Project Statistics
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={customization.showActivity} 
                onChange={() => toggleCustomization('showActivity')} 
              />
              Show Recent Activity
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={customization.showTasks} 
                onChange={() => toggleCustomization('showTasks')} 
              />
              Show Upcoming Tasks
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={customization.showProgress} 
                onChange={() => toggleCustomization('showProgress')} 
              />
              Show Project Progress
            </label>
          </div>
        </div>
      )}
      
      <div className="dashboard-grid">
        {customization.showProjects && (
          <div className="dashboard-card project-stats">
            <h3>Project Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{projects.length}</div>
                <div className="stat-label">Total Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {projects.filter(p => p.status === 'in_progress').length}
                </div>
                <div className="stat-label">Active Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {tasks.filter(t => t.status === 'completed').length}
                </div>
                <div className="stat-label">Completed Tasks</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{team.length}</div>
                <div className="stat-label">Team Members</div>
              </div>
            </div>
          </div>
        )}
        
        {customization.showActivity && (
          <div className="dashboard-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-icon ${activity.type}`}>
                      <i className={
                        activity.type === 'document' ? 'fas fa-file' :
                        activity.type === 'task' ? 'fas fa-tasks' :
                        activity.type === 'comment' ? 'fas fa-comment' :
                        'fas fa-project-diagram'
                      }></i>
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>{activity.user}</strong> {activity.action} {activity.type} <strong>{activity.item}</strong>
                      </p>
                      <span className="activity-time">{formatDate(activity.time)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recent activity</p>
              )}
            </div>
            <div className="card-footer">
              <button className="view-all">View All Activity</button>
            </div>
          </div>
        )}
        
        {customization.showTasks && (
          <div className="dashboard-card">
            <h3>Upcoming Tasks</h3>
            <div className="task-list">
              {tasks.filter(task => task.status !== 'completed')
                .slice(0, 5)
                .map(task => (
                  <div key={task.id} className="task-item">
                    <div className="task-priority" data-priority={task.priority}></div>
                    <div className="task-content">
                      <div className="task-title">{task.title}</div>
                      <div className="task-meta">
                        <span className="task-project">
                          {projects.find(p => p.id === task.projectId)?.name || 'Unknown Project'}
                        </span>
                        <span className="task-status" data-status={task.status}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="card-footer">
              <button className="view-all" onClick={() => onProjectSelect(projects[0])}>View All Tasks</button>
            </div>
          </div>
        )}
        
        {customization.showProgress && (
          <div className="dashboard-card">
            <h3>Project Progress</h3>
            <div className="progress-list">
              {projects.slice(0, 4).map(project => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
                const progressPercent = projectTasks.length > 0 
                  ? Math.round((completedTasks / projectTasks.length) * 100) 
                  : 0;
                
                return (
                  <div key={project.id} className="progress-item" onClick={() => onProjectSelect(project)}>
                    <div className="progress-header">
                      <h4>{project.name}</h4>
                      <span className="progress-percent">{progressPercent}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        data-status={
                          progressPercent === 0 ? 'not_started' :
                          progressPercent === 100 ? 'completed' :
                          'in_progress'
                        }
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="progress-meta">
                      <span className="progress-client">{project.clientName}</span>
                      <span className="progress-status" data-status={project.status}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="card-footer">
              <button className="view-all">View All Projects</button>
            </div>
          </div>
        )}
      </div>
      
      {showNewProjectModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Project</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleNewProject(); }}>
              <div className="form-group">
                <label htmlFor="project-name">Project Name</label>
                <input 
                  id="project-name"
                  type="text" 
                  value={newProject.name} 
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="project-description">Description</label>
                <textarea 
                  id="project-description"
                  value={newProject.description} 
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  rows={3}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="project-client">Client</label>
                <input 
                  id="project-client"
                  type="text" 
                  value={newProject.clientName} 
                  onChange={(e) => setNewProject({...newProject, clientName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="project-location">Location</label>
                <input 
                  id="project-location"
                  type="text" 
                  value={newProject.location} 
                  onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="project-start-date">Start Date</label>
                <input 
                  id="project-start-date"
                  type="date" 
                  value={newProject.startDate} 
                  onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="project-end-date">End Date</label>
                <input 
                  id="project-end-date"
                  type="date" 
                  value={newProject.endDate} 
                  onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="project-budget">Budget</label>
                <input 
                  id="project-budget"
                  type="number" 
                  value={newProject.budget || ''} 
                  onChange={(e) => setNewProject({...newProject, budget: parseFloat(e.target.value)})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowNewProjectModal(false)}>Cancel</button>
                <button type="submit">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 