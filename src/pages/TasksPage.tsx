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

interface TaskFilters {
  status: string[];
  priority: string[];
  assignee: string[];
  dueDate: 'all' | 'overdue' | 'today' | 'week' | 'month';
  search: string;
}

interface SortOption {
  field: keyof Task | 'project';
  direction: 'asc' | 'desc';
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
  const [filters, setFilters] = useState<TaskFilters>({
    status: [],
    priority: [],
    assignee: [],
    dueDate: 'all',
    search: ''
  });
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'due_date',
    direction: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    review: 0,
    todo: 0,
    overdue: 0
  });

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, selectedProject, filters, sortOption]);

  const filterAndSortTasks = () => {
    let filtered = [...tasks];
    
    // Project filter
    if (selectedProject !== 'all') {
      filtered = filtered.filter(task => task.project_id === selectedProject);
    }
    
    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }
    
    // Priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }
    
    // Assignee filter
    if (filters.assignee.length > 0) {
      filtered = filtered.filter(task => filters.assignee.includes(task.assignee_id));
    }
    
    // Due date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekLater = new Date(today);
    weekLater.setDate(weekLater.getDate() + 7);
    const monthLater = new Date(today);
    monthLater.setMonth(monthLater.getMonth() + 1);

    switch (filters.dueDate) {
      case 'overdue':
        filtered = filtered.filter(task => {
          const dueDate = new Date(task.due_date);
          return dueDate < today && task.status !== 'completed';
        });
        break;
      case 'today':
        filtered = filtered.filter(task => {
          const dueDate = new Date(task.due_date);
          return dueDate >= today && dueDate < tomorrow;
        });
        break;
      case 'week':
        filtered = filtered.filter(task => {
          const dueDate = new Date(task.due_date);
          return dueDate >= today && dueDate <= weekLater;
        });
        break;
      case 'month':
        filtered = filtered.filter(task => {
          const dueDate = new Date(task.due_date);
          return dueDate >= today && dueDate <= monthLater;
        });
        break;
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        projects.find(p => p.id === task.project_id)?.name.toLowerCase().includes(searchLower) ||
        users.find(u => u.id === task.assignee_id)?.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort tasks
    filtered.sort((a, b) => {
      if (sortOption.field === 'project') {
        const projectA = projects.find(p => p.id === a.project_id)?.name || '';
        const projectB = projects.find(p => p.id === b.project_id)?.name || '';
        return sortOption.direction === 'asc'
          ? projectA.localeCompare(projectB)
          : projectB.localeCompare(projectA);
      }
      
      const valueA = a[sortOption.field];
      const valueB = b[sortOption.field];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOption.direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return sortOption.direction === 'asc'
        ? (valueA > valueB ? 1 : -1)
        : (valueB > valueA ? 1 : -1);
    });
    
    setFilteredTasks(filtered);
    
    // Calculate task statistics
    const stats = {
      total: filtered.length,
      completed: filtered.filter(task => task.status === 'completed').length,
      inProgress: filtered.filter(task => task.status === 'in_progress').length,
      review: filtered.filter(task => task.status === 'review').length,
      todo: filtered.filter(task => task.status === 'todo').length,
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

  const toggleFilter = (type: keyof TaskFilters, value: string) => {
    setFilters(prev => {
      if (type === 'dueDate') {
        return { ...prev, [type]: value };
      }
      
      const array = prev[type] as string[];
      const newArray = array.includes(value)
        ? array.filter(v => v !== value)
        : [...array, value];
      
      return { ...prev, [type]: newArray };
    });
  };

  const handleSort = (field: SortOption['field']) => {
    setSortOption(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div className="tasks-title">
          <h1>Tasks</h1>
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        <div className="tasks-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          <div className="project-filter">
            <select 
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          
          <button className="new-task-button" onClick={() => handleTaskCreate({})}>
            New Task
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <h3>Status</h3>
            <div className="filter-options">
              {['todo', 'in_progress', 'review', 'completed'].map(status => (
                <label key={status} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={() => toggleFilter('status', status)}
                  />
                  {status.replace('_', ' ')}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Priority</h3>
            <div className="filter-options">
              {['high', 'medium', 'low'].map(priority => (
                <label key={priority} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.priority.includes(priority)}
                    onChange={() => toggleFilter('priority', priority)}
                  />
                  {priority}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Due Date</h3>
            <div className="filter-options">
              {[
                { value: 'all', label: 'All' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' }
              ].map(option => (
                <label key={option.value} className="filter-option">
                  <input
                    type="radio"
                    checked={filters.dueDate === option.value}
                    onChange={() => setFilters(prev => ({ ...prev, dueDate: option.value as TaskFilters['dueDate'] }))}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Assignee</h3>
            <div className="filter-options">
              {users.map(user => (
                <label key={user.id} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.assignee.includes(user.id)}
                    onChange={() => toggleFilter('assignee', user.id)}
                  />
                  {user.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

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
        <div className="task-stat-card review">
          <div className="stat-value">{taskStats.review}</div>
          <div className="stat-label">In Review</div>
        </div>
        <div className="task-stat-card todo">
          <div className="stat-value">{taskStats.todo}</div>
          <div className="stat-label">To Do</div>
        </div>
        <div className="task-stat-card overdue">
          <div className="stat-value">{taskStats.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      <div className="tasks-sort">
        <span>Sort by:</span>
        {[
          { field: 'due_date', label: 'Due Date' },
          { field: 'priority', label: 'Priority' },
          { field: 'status', label: 'Status' },
          { field: 'project', label: 'Project' }
        ].map(option => (
          <button
            key={option.field}
            className={`sort-button ${sortOption.field === option.field ? 'active' : ''}`}
            onClick={() => handleSort(option.field as SortOption['field'])}
          >
            {option.label}
            {sortOption.field === option.field && (
              <span className="sort-direction">
                {sortOption.direction === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedProject === 'all' ? (
        <div className="project-tasks-container">
          {projects.map(project => {
            const projectTasks = filteredTasks.filter(task => task.project_id === project.id);
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
      ) : (
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