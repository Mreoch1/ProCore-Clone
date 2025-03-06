import { useState, useEffect } from 'react';
import { Task, User, Project } from '../types/project';
import TodoList from '../components/TodoList';
import '../styles/TasksPage.css';

interface TasksPageProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  onTaskUpdate?: (task: Task) => void;
  onTaskCreate?: (task: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  projects,
  users,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete
}) => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    overdue: 0
  });

  useEffect(() => {
    filterTasks();
  }, [tasks, selectedProject]);

  const filterTasks = () => {
    let filtered = [...tasks];
    
    if (selectedProject !== 'all') {
      filtered = filtered.filter(task => task.project_id === selectedProject);
    }
    
    setFilteredTasks(filtered);
    
    // Calculate task statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      total: filtered.length,
      completed: filtered.filter(task => task.status === 'completed').length,
      inProgress: filtered.filter(task => task.status === 'in_progress').length,
      notStarted: filtered.filter(task => task.status === 'not_started').length,
      overdue: filtered.filter(task => {
        if (!task.due_date || task.status === 'completed') return false;
        const dueDate = new Date(task.due_date);
        return dueDate < today;
      }).length
    };
    
    setTaskStats(stats);
  };

  const handleTaskCreate = (task: Partial<Task>) => {
    if (onTaskCreate) {
      // If creating from the all projects view, ensure project_id is set
      if (selectedProject !== 'all') {
        task.project_id = selectedProject;
      }
      onTaskCreate(task);
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>Tasks</h1>
        <div className="project-filter">
          <label htmlFor="project-select">Project:</label>
          <select 
            id="project-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="task-stats-container">
        <div className="task-stat-card">
          <div className="stat-value">{taskStats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="task-stat-card completed">
          <div className="stat-value">{taskStats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="task-stat-card in-progress">
          <div className="stat-value">{taskStats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="task-stat-card not-started">
          <div className="stat-value">{taskStats.notStarted}</div>
          <div className="stat-label">Not Started</div>
        </div>
        <div className="task-stat-card overdue">
          <div className="stat-value">{taskStats.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      {selectedProject === 'all' && (
        <div className="project-tasks-container">
          {projects.map(project => {
            const projectTasks = tasks.filter(task => task.project_id === project.id);
            if (projectTasks.length === 0) return null;
            
            return (
              <div key={project.id} className="project-tasks-section">
                <div className="project-tasks-header">
                  <h2>{project.name}</h2>
                  <span className="task-count">{projectTasks.length} tasks</span>
                </div>
                <TodoList 
                  tasks={projectTasks}
                  projectId={project.id}
                  users={users}
                  onTaskUpdate={onTaskUpdate}
                  onTaskCreate={handleTaskCreate}
                  onTaskDelete={onTaskDelete}
                />
              </div>
            );
          })}
        </div>
      )}

      {selectedProject !== 'all' && (
        <div className="selected-project-container">
          <div className="selected-project-info">
            <h2>{getProjectName(selectedProject)}</h2>
            <p>Manage tasks for this project</p>
          </div>
          <TodoList 
            tasks={filteredTasks}
            projectId={selectedProject}
            users={users}
            onTaskUpdate={onTaskUpdate}
            onTaskCreate={handleTaskCreate}
            onTaskDelete={onTaskDelete}
          />
        </div>
      )}
    </div>
  );
};

export default TasksPage; 