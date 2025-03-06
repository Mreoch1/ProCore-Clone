import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, getProjects } from '../utils/supabaseClient';
import { Task, TaskStatistics } from '../types/Task';
import { Project } from '../types/Project';
import { useUser } from '../contexts/UserContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/TasksPage.css';

interface TasksPageProps {}

interface TaskFilters {
  status: string[];
  priority: string[];
  assignee: string[];
  dueDate: string | null;
}

interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

const TasksPage: React.FC<TasksPageProps> = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    status: [],
    priority: [],
    assignee: [],
    dueDate: null,
  });
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'dueDate',
    direction: 'asc',
  });
  const [taskStats, setTaskStats] = useState<TaskStatistics>({
    total: 0,
    completed: 0,
    inProgress: 0,
    review: 0,
    todo: 0,
    overdue: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [tasksData, projectsData] = await Promise.all([
          getTasks(),
          getProjects(),
        ]);
        setTasks(tasksData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading tasks data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, selectedProject, filters, sortOption, searchTerm]);

  const filterAndSortTasks = () => {
    let filtered = [...tasks];

    // Filter by project
    if (selectedProject !== 'all') {
      filtered = filtered.filter(task => task.projectId === selectedProject);
    }

    // Filter by status
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }

    // Filter by priority
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }

    // Filter by assignee
    if (filters.assignee.length > 0) {
      filtered = filtered.filter(task => 
        task.assigneeId && filters.assignee.includes(task.assigneeId)
      );
    }

    // Filter by due date
    if (filters.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (filters.dueDate === 'today') {
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      } else if (filters.dueDate === 'this-week') {
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
        
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate <= endOfWeek;
        });
      } else if (filters.dueDate === 'overdue') {
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(23, 59, 59, 999);
          return dueDate < today && task.status !== 'completed';
        });
      }
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        task => 
          task.title.toLowerCase().includes(term) || 
          (task.description && task.description.toLowerCase().includes(term))
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      const { field, direction } = sortOption;
      const multiplier = direction === 'asc' ? 1 : -1;

      if (field === 'dueDate') {
        if (!a.dueDate) return multiplier;
        if (!b.dueDate) return -multiplier;
        return multiplier * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      }
      
      if (field === 'priority') {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        const aValue = priorityValues[a.priority as keyof typeof priorityValues] || 0;
        const bValue = priorityValues[b.priority as keyof typeof priorityValues] || 0;
        return multiplier * (bValue - aValue);
      }
      
      if (field === 'status') {
        const statusValues = { todo: 1, in_progress: 2, review: 3, completed: 4 };
        const aValue = statusValues[a.status as keyof typeof statusValues] || 0;
        const bValue = statusValues[b.status as keyof typeof statusValues] || 0;
        return multiplier * (aValue - bValue);
      }
      
      if (field === 'title') {
        return multiplier * a.title.localeCompare(b.title);
      }
      
      return 0;
    });

    // Update task statistics
    const stats: TaskStatistics = {
      total: filtered.length,
      completed: filtered.filter(task => task.status === 'completed').length,
      inProgress: filtered.filter(task => task.status === 'in_progress').length,
      review: filtered.filter(task => task.status === 'review').length,
      todo: filtered.filter(task => task.status === 'todo').length,
      overdue: filtered.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today && task.status !== 'completed';
      }).length,
    };

    setTaskStats(stats);
    setFilteredTasks(filtered);
  };

  const handleCreateTask = () => {
    // This would open a modal or navigate to a create task page
    console.log('Create task');
  };

  const toggleFilter = (type: keyof TaskFilters, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (type === 'dueDate') {
        newFilters.dueDate = newFilters.dueDate === value ? null : value;
      } else {
        const filterArray = [...newFilters[type]];
        const index = filterArray.indexOf(value);
        
        if (index >= 0) {
          filterArray.splice(index, 1);
        } else {
          filterArray.push(value);
        }
        
        newFilters[type] = filterArray;
      }
      
      return newFilters;
    });
  };

  const handleSort = (field: string) => {
    setSortOption(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading tasks..." />;
  }

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div className="tasks-title">
          <h1>Tasks</h1>
          <span className="task-count">{taskStats.total} tasks</span>
        </div>
        
        <div className="tasks-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="clear-search" 
                onClick={() => setSearchTerm('')}
              >
                ×
              </button>
            )}
          </div>
          
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="project-filter"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          
          <button className="create-task-btn" onClick={handleCreateTask}>
            Create Task
          </button>
          
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <h3>Status</h3>
            <div className="filter-options">
              <div 
                className={`filter-option ${filters.status.includes('todo') ? 'active' : ''}`}
                onClick={() => toggleFilter('status', 'todo')}
              >
                To Do
              </div>
              <div 
                className={`filter-option ${filters.status.includes('in_progress') ? 'active' : ''}`}
                onClick={() => toggleFilter('status', 'in_progress')}
              >
                In Progress
              </div>
              <div 
                className={`filter-option ${filters.status.includes('review') ? 'active' : ''}`}
                onClick={() => toggleFilter('status', 'review')}
              >
                Review
              </div>
              <div 
                className={`filter-option ${filters.status.includes('completed') ? 'active' : ''}`}
                onClick={() => toggleFilter('status', 'completed')}
              >
                Completed
              </div>
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Priority</h3>
            <div className="filter-options">
              <div 
                className={`filter-option ${filters.priority.includes('high') ? 'active' : ''}`}
                onClick={() => toggleFilter('priority', 'high')}
              >
                High
              </div>
              <div 
                className={`filter-option ${filters.priority.includes('medium') ? 'active' : ''}`}
                onClick={() => toggleFilter('priority', 'medium')}
              >
                Medium
              </div>
              <div 
                className={`filter-option ${filters.priority.includes('low') ? 'active' : ''}`}
                onClick={() => toggleFilter('priority', 'low')}
              >
                Low
              </div>
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Due Date</h3>
            <div className="filter-options">
              <div 
                className={`filter-option ${filters.dueDate === 'today' ? 'active' : ''}`}
                onClick={() => toggleFilter('dueDate', 'today')}
              >
                Today
              </div>
              <div 
                className={`filter-option ${filters.dueDate === 'this-week' ? 'active' : ''}`}
                onClick={() => toggleFilter('dueDate', 'this-week')}
              >
                This Week
              </div>
              <div 
                className={`filter-option ${filters.dueDate === 'overdue' ? 'active' : ''}`}
                onClick={() => toggleFilter('dueDate', 'overdue')}
              >
                Overdue
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="task-stats-container">
        <div className="task-stat-card">
          <div className="stat-value">{taskStats.todo}</div>
          <div className="stat-label">To Do</div>
        </div>
        <div className="task-stat-card">
          <div className="stat-value">{taskStats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="task-stat-card">
          <div className="stat-value">{taskStats.review}</div>
          <div className="stat-label">Review</div>
        </div>
        <div className="task-stat-card">
          <div className="stat-value">{taskStats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="task-stat-card">
          <div className="stat-value">{taskStats.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>
      
      <div className="tasks-sort">
        <span>Sort by:</span>
        <button 
          className={`sort-button ${sortOption.field === 'dueDate' ? 'active' : ''}`}
          onClick={() => handleSort('dueDate')}
        >
          Due Date {sortOption.field === 'dueDate' && (sortOption.direction === 'asc' ? '↑' : '↓')}
        </button>
        <button 
          className={`sort-button ${sortOption.field === 'priority' ? 'active' : ''}`}
          onClick={() => handleSort('priority')}
        >
          Priority {sortOption.field === 'priority' && (sortOption.direction === 'asc' ? '↑' : '↓')}
        </button>
        <button 
          className={`sort-button ${sortOption.field === 'status' ? 'active' : ''}`}
          onClick={() => handleSort('status')}
        >
          Status {sortOption.field === 'status' && (sortOption.direction === 'asc' ? '↑' : '↓')}
        </button>
        <button 
          className={`sort-button ${sortOption.field === 'title' ? 'active' : ''}`}
          onClick={() => handleSort('title')}
        >
          Title {sortOption.field === 'title' && (sortOption.direction === 'asc' ? '↑' : '↓')}
        </button>
      </div>
      
      <div className="tasks-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const project = projects.find(p => p.id === task.projectId);
            
            return (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <div className={`task-priority priority-${task.priority}`}>
                    {task.priority}
                  </div>
                  <div className={`task-status status-${task.status.replace('_', '-')}`}>
                    {task.status.replace('_', ' ')}
                  </div>
                </div>
                
                <h3 className="task-title">{task.title}</h3>
                
                {task.description && (
                  <p className="task-description">
                    {task.description.length > 100
                      ? `${task.description.substring(0, 100)}...`
                      : task.description}
                  </p>
                )}
                
                <div className="task-meta">
                  {project && (
                    <div className="task-project">
                      <span className="meta-label">Project:</span>
                      <Link to={`/projects/${project.id}`}>{project.name}</Link>
                    </div>
                  )}
                  
                  {task.dueDate && (
                    <div className="task-due-date">
                      <span className="meta-label">Due:</span>
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="task-actions">
                  <Link to={`/tasks/${task.id}`} className="view-task-btn">
                    View Details
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <p>No tasks found matching your filters.</p>
            <button className="create-task-btn" onClick={handleCreateTask}>
              Create New Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage; 