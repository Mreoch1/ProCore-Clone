import { Project, Task } from '../types/project';
import '../styles/Dashboard.css';

interface DashboardProps {
  projects: Project[];
  onProjectSelect?: (project: Project) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onProjectSelect = () => {} }) => {
  // Mock data for dashboard
  const recentActivity = [
    { id: '1', type: 'document', action: 'uploaded', item: 'Site Plan v2', user: 'Jane Smith', time: '2 hours ago' },
    { id: '2', type: 'task', action: 'completed', item: 'Finalize budget', user: 'John Doe', time: 'Yesterday' },
    { id: '3', type: 'comment', action: 'added', item: 'Foundation Plans', user: 'Mike Johnson', time: '2 days ago' },
    { id: '4', type: 'project', action: 'created', item: 'New Office Building', user: 'Sarah Williams', time: '3 days ago' },
  ];

  const upcomingTasks: Task[] = [
    { 
      id: '1', 
      title: 'Review contractor proposals', 
      status: 'Not Started', 
      priority: 'High',
      due_date: '2023-04-15',
      project_id: '1'
    },
    { 
      id: '2', 
      title: 'Finalize site logistics plan', 
      status: 'In Progress', 
      priority: 'Medium',
      due_date: '2023-04-18',
      project_id: '1'
    },
    { 
      id: '3', 
      title: 'Submit permit applications', 
      status: 'Not Started', 
      priority: 'High',
      due_date: '2023-04-20',
      project_id: '2'
    },
  ];

  // Calculate project statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  const handleProjectClick = (project: Project) => {
    onProjectSelect(project);
  };

  const handleViewAllTasks = () => {
    // Navigate to tasks page
    // This would be handled by the parent component
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-actions">
          <button className="dashboard-action-button">Customize Dashboard</button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Project Statistics */}
        <div className="dashboard-card project-stats">
          <h3>Project Overview</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{totalProjects}</div>
              <div className="stat-label">Total Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{activeProjects}</div>
              <div className="stat-label">Active Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{completedProjects}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{totalProjects - activeProjects - completedProjects}</div>
              <div className="stat-label">Planning</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card recent-activity">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            {recentActivity.map(activity => (
              <li key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'document' && '📄'}
                  {activity.type === 'task' && '✓'}
                  {activity.type === 'comment' && '💬'}
                  {activity.type === 'project' && '🏗️'}
                </div>
                <div className="activity-content">
                  <p>
                    <strong>{activity.user}</strong> {activity.action} {activity.type} <strong>{activity.item}</strong>
                  </p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="card-footer">
            <a href="#" className="view-all">View all activity</a>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="dashboard-card upcoming-tasks">
          <h3>Upcoming Tasks</h3>
          <ul className="task-list">
            {upcomingTasks.map(task => (
              <li key={task.id} className="task-item">
                <div className="task-priority" data-priority={task.priority.toLowerCase()}></div>
                <div className="task-content">
                  <h4 className="task-title">{task.title}</h4>
                  <div className="task-meta">
                    <span className="task-project">
                      {projects.find(p => p.id === task.project_id)?.name || 'Unknown Project'}
                    </span>
                    <span className="task-due">
                      Due: {new Date(task.due_date || '').toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="task-status" data-status={task.status.toLowerCase().replace(' ', '_')}>
                  {task.status}
                </div>
              </li>
            ))}
          </ul>
          <div className="card-footer">
            <a href="#" className="view-all">View all tasks</a>
          </div>
        </div>

        {/* Project Progress */}
        <div className="dashboard-card project-progress">
          <h3>Project Progress</h3>
          <div className="progress-list">
            {projects.slice(0, 3).map(project => (
              <div 
                key={project.id} 
                className="progress-item"
                onClick={() => handleProjectClick(project)}
              >
                <div className="progress-header">
                  <h4>{project.name}</h4>
                  <span className="progress-percent">{project.progress || 0}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${project.progress || 0}%` }}
                    data-status={project.status}
                  ></div>
                </div>
                <div className="progress-meta">
                  <span className="progress-client">{project.client}</span>
                  <span className="progress-status" data-status={project.status}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer">
            <a href="#" className="view-all">View all projects</a>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <section className="projects-section">
        <div className="section-header">
          <h2>All Projects</h2>
          <button className="action-button">+ New Project</button>
        </div>
        
        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="project-card" 
                onClick={() => handleProjectClick(project)}
              >
                <h3>{project.name}</h3>
                <div className="project-details">
                  <p><strong>Client:</strong> {project.client}</p>
                  <p><strong>Status:</strong> <span className={`status-${project.status}`}>{project.status.replace('_', ' ')}</span></p>
                  {project.progress !== undefined && (
                    <div className="project-progress">
                      <div className="progress-label">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${project.progress}%` }}
                          data-status={project.status}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="project-actions">
                  <button className="view-button">View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No projects found. Create your first project to get started.</p>
            <button className="action-button">Create Project</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard; 