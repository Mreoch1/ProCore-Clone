import React, { useState, useEffect } from 'react';
import { Project, Task, Document, User } from '../types/project';
import { subscribeToProjects, subscribeToTasks, createProject } from '../utils/supabaseClient';
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
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    client: '',
    location: '',
    status: 'planning',
    start_date: '',
    end_date: '',
    budget: 0,
    team_members: []
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [customization, setCustomization] = useState({
    showProjects: true,
    showTasks: true,
    showActivity: true,
    showProgress: true
  });

  // Calculate project statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const planningProjects = projects.filter(p => p.status === 'planning').length;

  // Get upcoming tasks
  const upcomingTasks = tasks
    .filter(task => new Date(task.due_date) > new Date())
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  useEffect(() => {
    // Subscribe to real-time updates
    const projectSubscription = subscribeToProjects((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      // Update activity feed
      const activity: ActivityItem = {
        id: Date.now().toString(),
        type: 'project',
        action: eventType === 'INSERT' ? 'created' : eventType === 'UPDATE' ? 'updated' : 'deleted',
        item: newRecord?.name || oldRecord?.name,
        user: team.find(u => u.id === (newRecord?.team_members?.[0] || oldRecord?.team_members?.[0]))?.name || 'Unknown',
        time: 'Just now'
      };
      
      setRecentActivity(prev => [activity, ...prev].slice(0, 10));
    });

    const taskSubscription = subscribeToTasks(null, (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      const activity: ActivityItem = {
        id: Date.now().toString(),
        type: 'task',
        action: eventType === 'INSERT' ? 'created' : eventType === 'UPDATE' ? 'updated' : 'deleted',
        item: newRecord?.title || oldRecord?.title,
        user: team.find(u => u.id === (newRecord?.assignee_id || oldRecord?.assignee_id))?.name || 'Unknown',
        time: 'Just now'
      };
      
      setRecentActivity(prev => [activity, ...prev].slice(0, 10));
    });

    // Initial activity feed
    const initialActivity = [
      ...documents.slice(0, 3).map(doc => ({
        id: doc.id,
        type: 'document' as const,
        action: 'uploaded',
        item: doc.name,
        user: team.find(u => u.id === doc.uploaded_by)?.name || 'Unknown',
        time: new Date(doc.created_at).toLocaleDateString()
      })),
      ...tasks.slice(0, 3).map(task => ({
        id: task.id,
        type: 'task' as const,
        action: task.status === 'completed' ? 'completed' : 'updated',
        item: task.title,
        user: team.find(u => u.id === task.assignee_id)?.name || 'Unknown',
        time: new Date(task.updated_at).toLocaleDateString()
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    setRecentActivity(initialActivity);

    return () => {
      projectSubscription.unsubscribe();
      taskSubscription.unsubscribe();
    };
  }, [documents, tasks, team]);

  const handleNewProject = async () => {
    try {
      const project = await createProject(newProject as Omit<Project, 'id' | 'created_at' | 'updated_at'>);
      setShowNewProjectModal(false);
      setNewProject({
        name: '',
        description: '',
        client: '',
        location: '',
        status: 'planning',
        start_date: '',
        end_date: '',
        budget: 0,
        team_members: []
      });
      onProjectSelect(project);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const toggleCustomization = (key: keyof typeof customization) => {
    setCustomization(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-actions">
          <button 
            className="dashboard-action-button"
            onClick={() => setShowNewProjectModal(true)}
          >
            + New Project
          </button>
          <button 
            className="dashboard-action-button"
            onClick={() => document.getElementById('customization-menu')?.click()}
          >
            Customize Dashboard
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {customization.showProjects && (
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
                <div className="stat-value">{planningProjects}</div>
                <div className="stat-label">Planning</div>
              </div>
            </div>
          </div>
        )}

        {customization.showActivity && (
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
                      <strong>{activity.user}</strong> {activity.action} {activity.type}{' '}
                      <strong>{activity.item}</strong>
                    </p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {customization.showTasks && (
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
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="task-status" data-status={task.status}>
                    {task.status.replace('_', ' ')}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {customization.showProgress && (
          <div className="dashboard-card project-progress">
            <h3>Project Progress</h3>
            <div className="progress-list">
              {projects.slice(0, 3).map(project => (
                <div 
                  key={project.id} 
                  className="progress-item"
                  onClick={() => onProjectSelect(project)}
                >
                  <div className="progress-header">
                    <h4>{project.name}</h4>
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
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Project</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleNewProject(); }}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Client</label>
                <input
                  type="text"
                  value={newProject.client}
                  onChange={(e) => setNewProject(prev => ({ ...prev, client: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newProject.location}
                  onChange={(e) => setNewProject(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={newProject.start_date}
                  onChange={(e) => setNewProject(prev => ({ ...prev, start_date: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={newProject.end_date}
                  onChange={(e) => setNewProject(prev => ({ ...prev, end_date: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Budget</label>
                <input
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject(prev => ({ ...prev, budget: Number(e.target.value) }))}
                  required
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

      {/* Customization Menu */}
      <div id="customization-menu" className="customization-menu">
        <h3>Customize Dashboard</h3>
        <div className="customization-options">
          <label>
            <input
              type="checkbox"
              checked={customization.showProjects}
              onChange={() => toggleCustomization('showProjects')}
            />
            Show Project Overview
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
              checked={customization.showActivity}
              onChange={() => toggleCustomization('showActivity')}
            />
            Show Recent Activity
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
    </div>
  );
};

export default Dashboard; 