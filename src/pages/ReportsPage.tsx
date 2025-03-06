import React, { useState, useEffect } from 'react';
import { Project, Task, User } from '../types/project';
import { fetchBudgetItems } from '../utils/supabaseClient';
import '../styles/ReportsPage.css';

interface ReportsPageProps {
  projects: Project[];
  tasks: Task[];
  team: User[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({
  projects,
  tasks,
  team
}) => {
  const [activeReport, setActiveReport] = useState<string>('project-progress');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [reportData, setReportData] = useState<any>({});
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch budget data when needed
  useEffect(() => {
    const loadBudgetData = async () => {
      if (activeReport !== 'budget-tracking') return;
      
      setLoading(true);
      setError(null);
      try {
        const filteredProjects = selectedProject === 'all' 
          ? projects 
          : projects.filter(p => p.id === selectedProject);
        
        const budgetPromises = filteredProjects.map(project => 
          fetchBudgetItems(project.id)
        );
        
        const budgetResults = await Promise.all(budgetPromises);
        const projectBudgets = filteredProjects.map((project, index) => {
          const projectBudgetItems = budgetResults[index] || [];
          const totalEstimated = projectBudgetItems.reduce((sum, item) => sum + item.estimated_amount, 0);
          const totalActual = projectBudgetItems.reduce((sum, item) => sum + item.actual_amount, 0);
          
          return {
            id: project.id,
            name: project.name,
            totalBudget: project.budget || 0,
            budgetSpent: totalActual,
            budgetRemaining: (project.budget || 0) - totalActual,
            progress: project.progress || 0,
            isOverBudget: totalActual > (project.budget || 0),
            items: projectBudgetItems
          };
        });
        
        setBudgetData(projectBudgets);
      } catch (err: any) {
        console.error('Error fetching budget data:', err);
        setError(err.message);
        setBudgetData([]);
      } finally {
        setLoading(false);
      }
    };

    loadBudgetData();
  }, [activeReport, selectedProject, projects]);

  useEffect(() => {
    generateReportData();
  }, [activeReport, selectedProject, projects, tasks, team, budgetData]);

  const generateReportData = () => {
    switch (activeReport) {
      case 'project-progress':
        generateProjectProgressData();
        break;
      case 'task-status':
        generateTaskStatusData();
        break;
      case 'team-workload':
        generateTeamWorkloadData();
        break;
      case 'budget-tracking':
        generateBudgetTrackingData();
        break;
      default:
        setReportData({});
    }
  };

  const generateProjectProgressData = () => {
    const filteredProjects = selectedProject === 'all' 
      ? projects 
      : projects.filter(p => p.id === selectedProject);
    
    const data = filteredProjects.map(project => ({
      id: project.id,
      name: project.name,
      progress: project.progress || 0,
      status: project.status,
      startDate: project.start_date,
      endDate: project.end_date,
      daysRemaining: project.end_date 
        ? Math.ceil((new Date(project.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null,
      tasksTotal: tasks.filter(t => t.project_id === project.id).length,
      tasksCompleted: tasks.filter(t => t.project_id === project.id && t.status === 'completed').length
    }));

    setReportData({ 
      type: 'project-progress',
      data
    });
  };

  const generateTaskStatusData = () => {
    const relevantTasks = selectedProject === 'all'
      ? tasks
      : tasks.filter(t => t.project_id === selectedProject);
    
    const statusCounts = {
      not_started: relevantTasks.filter(t => t.status === 'not_started').length,
      in_progress: relevantTasks.filter(t => t.status === 'in_progress').length,
      completed: relevantTasks.filter(t => t.status === 'completed').length,
      on_hold: relevantTasks.filter(t => t.status === 'on_hold').length,
      cancelled: relevantTasks.filter(t => t.status === 'cancelled').length
    };
    
    const priorityCounts = {
      high: relevantTasks.filter(t => t.priority === 'high').length,
      medium: relevantTasks.filter(t => t.priority === 'medium').length,
      low: relevantTasks.filter(t => t.priority === 'low').length
    };
    
    const overdueTasks = relevantTasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      return new Date(t.due_date) < new Date();
    });

    setReportData({
      type: 'task-status',
      statusCounts,
      priorityCounts,
      overdueTasks,
      total: relevantTasks.length
    });
  };

  const generateTeamWorkloadData = () => {
    const relevantTasks = selectedProject === 'all'
      ? tasks
      : tasks.filter(t => t.project_id === selectedProject);
    
    const teamWorkload = team.map(member => {
      const assignedTasks = relevantTasks.filter(t => t.assigned_to === member.name);
      return {
        id: member.id,
        name: member.name,
        role: member.role,
        totalTasks: assignedTasks.length,
        completedTasks: assignedTasks.filter(t => t.status === 'completed').length,
        inProgressTasks: assignedTasks.filter(t => t.status === 'in_progress').length,
        notStartedTasks: assignedTasks.filter(t => t.status === 'not_started').length,
        overdueTasks: assignedTasks.filter(t => {
          if (!t.due_date || t.status === 'completed') return false;
          return new Date(t.due_date) < new Date();
        }).length
      };
    });

    setReportData({
      type: 'team-workload',
      teamWorkload
    });
  };

  const generateBudgetTrackingData = () => {
    setReportData({
      type: 'budget-tracking',
      budgetData: budgetData
    });
  };

  const renderProjectProgressReport = () => {
    if (!reportData.data || reportData.data.length === 0) {
      return <div className="empty-state">No project data available</div>;
    }

    return (
      <div className="report-content">
        <div className="progress-cards">
          {reportData.data.map((project: any) => (
            <div key={project.id} className="progress-card">
              <div className="progress-card-header">
                <h3>{project.name}</h3>
                <span className={`status-badge status-${project.status}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="progress-indicator">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${project.progress}%` }}
                    data-status={project.status}
                  ></div>
                </div>
                <div className="progress-percentage">{project.progress}%</div>
              </div>
              
              <div className="progress-details">
                <div className="detail-item">
                  <span className="detail-label">Tasks:</span>
                  <span className="detail-value">{project.tasksCompleted} / {project.tasksTotal}</span>
                </div>
                
                {project.daysRemaining !== null && (
                  <div className="detail-item">
                    <span className="detail-label">Time Remaining:</span>
                    <span className={`detail-value ${project.daysRemaining < 0 ? 'overdue' : ''}`}>
                      {project.daysRemaining < 0 
                        ? `${Math.abs(project.daysRemaining)} days overdue` 
                        : `${project.daysRemaining} days`}
                    </span>
                  </div>
                )}
                
                <div className="detail-item">
                  <span className="detail-label">Start Date:</span>
                  <span className="detail-value">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">End Date:</span>
                  <span className="detail-value">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTaskStatusReport = () => {
    if (!reportData.total) {
      return <div className="empty-state">No task data available</div>;
    }

    const { statusCounts, priorityCounts, overdueTasks, total } = reportData;

    return (
      <div className="report-content">
        <div className="report-section">
          <h3>Task Status Distribution</h3>
          <div className="chart-container">
            <div className="bar-chart">
              {Object.entries(statusCounts).map(([status, count]: [string, any]) => (
                <div key={status} className="chart-item">
                  <div className="chart-label">{status.replace('_', ' ')}</div>
                  <div className="chart-bar-container">
                    <div 
                      className={`chart-bar status-${status}`} 
                      style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                    ></div>
                    <span className="chart-value">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="report-section">
          <h3>Task Priority Distribution</h3>
          <div className="chart-container">
            <div className="bar-chart">
              {Object.entries(priorityCounts).map(([priority, count]: [string, any]) => (
                <div key={priority} className="chart-item">
                  <div className="chart-label">{priority}</div>
                  <div className="chart-bar-container">
                    <div 
                      className={`chart-bar priority-${priority}`} 
                      style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                    ></div>
                    <span className="chart-value">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="report-section">
          <h3>Overdue Tasks ({overdueTasks.length})</h3>
          {overdueTasks.length > 0 ? (
            <div className="overdue-tasks-list">
              {overdueTasks.map((task: Task) => (
                <div key={task.id} className="overdue-task-item">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    <span className="due-date">
                      Due: {new Date(task.due_date || '').toLocaleDateString()}
                    </span>
                    <span className="assignee">
                      Assigned to: {task.assigned_to || 'Unassigned'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No overdue tasks</div>
          )}
        </div>
      </div>
    );
  };

  const renderTeamWorkloadReport = () => {
    if (!reportData.teamWorkload || reportData.teamWorkload.length === 0) {
      return <div className="empty-state">No team workload data available</div>;
    }

    return (
      <div className="report-content">
        <div className="workload-table-container">
          <table className="workload-table">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Role</th>
                <th>Total Tasks</th>
                <th>Completed</th>
                <th>In Progress</th>
                <th>Not Started</th>
                <th>Overdue</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {reportData.teamWorkload.map((member: any) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>
                    <span className={`role-badge role-${member.role}`}>
                      {member.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{member.totalTasks}</td>
                  <td>{member.completedTasks}</td>
                  <td>{member.inProgressTasks}</td>
                  <td>{member.notStartedTasks}</td>
                  <td className={member.overdueTasks > 0 ? 'overdue' : ''}>
                    {member.overdueTasks}
                  </td>
                  <td>
                    <div className="completion-rate">
                      <div className="completion-bar">
                        <div 
                          className="completion-fill" 
                          style={{ 
                            width: `${member.totalTasks ? (member.completedTasks / member.totalTasks) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                      <span className="completion-percentage">
                        {member.totalTasks ? Math.round((member.completedTasks / member.totalTasks) * 100) : 0}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBudgetTrackingReport = () => {
    if (!reportData.budgetData || reportData.budgetData.length === 0) {
      return <div className="empty-state">No budget data available</div>;
    }

    return (
      <div className="report-content">
        <div className="budget-cards">
          {reportData.budgetData.map((project: any) => (
            <div key={project.id} className={`budget-card ${project.isOverBudget ? 'over-budget' : ''}`}>
              <div className="budget-card-header">
                <h3>{project.name}</h3>
                {project.isOverBudget && (
                  <span className="over-budget-badge">Over Budget</span>
                )}
              </div>
              
              <div className="budget-amount">
                <span className="currency">$</span>
                <span className="amount">{project.totalBudget.toLocaleString()}</span>
              </div>
              
              <div className="budget-progress">
                <div className="budget-bar">
                  <div 
                    className={`budget-fill ${project.isOverBudget ? 'over-budget' : ''}`} 
                    style={{ width: `${project.isOverBudget ? 100 : (project.budgetSpent / project.totalBudget) * 100}%` }}
                  ></div>
                </div>
                <div className="budget-labels">
                  <span>Spent: ${project.budgetSpent.toLocaleString()}</span>
                  <span>Remaining: ${project.budgetRemaining.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="budget-details">
                <div className="detail-item">
                  <span className="detail-label">Project Progress:</span>
                  <span className="detail-value">{project.progress}%</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Budget Utilization:</span>
                  <span className="detail-value">
                    {project.totalBudget ? Math.round((project.budgetSpent / project.totalBudget) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (activeReport) {
      case 'project-progress':
        return renderProjectProgressReport();
      case 'task-status':
        return renderTaskStatusReport();
      case 'team-workload':
        return renderTeamWorkloadReport();
      case 'budget-tracking':
        return renderBudgetTrackingReport();
      default:
        return <div className="empty-state">Select a report to view</div>;
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>Reports</h1>
      </div>
      
      <div className="reports-controls">
        <div className="report-selector">
          <label htmlFor="report-type">Report Type:</label>
          <select 
            id="report-type"
            value={activeReport}
            onChange={(e) => setActiveReport(e.target.value)}
          >
            <option value="project-progress">Project Progress</option>
            <option value="task-status">Task Status</option>
            <option value="team-workload">Team Workload</option>
            <option value="budget-tracking">Budget Tracking</option>
          </select>
        </div>
        
        <div className="project-selector">
          <label htmlFor="project-filter">Project:</label>
          <select 
            id="project-filter"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="report-container">
        {renderReportContent()}
      </div>
    </div>
  );
};

export default ReportsPage; 