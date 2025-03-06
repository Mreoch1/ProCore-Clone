import { useState, useEffect } from 'react';
import { Task, User } from '../types/project';
import Todo from './Todo';
import '../styles/TodoList.css';

interface TodoListProps {
  tasks: Task[];
  projectId?: string;
  users: User[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate?: (task: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  tasks,
  projectId,
  users,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete
}) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('due_date');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'not_started',
    priority: 'medium',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    project_id: projectId || '',
    assigned_to: ''
  });

  useEffect(() => {
    filterAndSortTasks();
  }, [tasks, statusFilter, priorityFilter, sortOption]);

  useEffect(() => {
    if (projectId) {
      setNewTask(prev => ({ ...prev, project_id: projectId }));
    }
  }, [projectId]);

  const filterAndSortTasks = () => {
    let filtered = [...tasks];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'due_date':
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case 'priority':
          const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        case 'status':
          const statusOrder = { 'not_started': 0, 'in_progress': 1, 'completed': 2 };
          return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    setFilteredTasks(filtered);
  };

  const handleStatusChange = (taskId: string, status: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { status });
    }
  };

  const handlePriorityChange = (taskId: string, priority: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { priority });
    }
  };

  const handleAssigneeChange = (taskId: string, assignedTo: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { assigned_to: assignedTo });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title || !newTask.due_date) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (onTaskCreate) {
      onTaskCreate({
        ...newTask,
        created_at: new Date().toISOString()
      });
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        status: 'not_started',
        priority: 'medium',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        project_id: projectId || '',
        assigned_to: ''
      });
      setShowNewTaskForm(false);
    }
  };

  return (
    <div className="todo-list-container">
      <div className="todo-header">
        <h2>Tasks</h2>
        <button 
          className="action-button"
          onClick={() => setShowNewTaskForm(!showNewTaskForm)}
        >
          {showNewTaskForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>
      
      {showNewTaskForm && (
        <div className="new-task-form-container">
          <form className="new-task-form" onSubmit={handleCreateTask}>
            <div className="form-group">
              <label htmlFor="title">Task Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                required
                placeholder="Enter task title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={newTask.description || ''}
                onChange={handleInputChange}
                placeholder="Enter task description"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status*</label>
                <select
                  id="status"
                  name="status"
                  value={newTask.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="priority">Priority*</label>
                <select
                  id="priority"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="due_date">Due Date*</label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={newTask.due_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="assigned_to">Assignee</label>
                <select
                  id="assigned_to"
                  name="assigned_to"
                  value={newTask.assigned_to || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="action-button">Create Task</button>
              <button 
                type="button" 
                className="action-button secondary"
                onClick={() => setShowNewTaskForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="todo-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select 
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="priority-filter">Priority:</label>
          <select 
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort-option">Sort By:</label>
          <select 
            id="sort-option"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
      
      <div className="todo-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <Todo
              key={task.id}
              task={task}
              users={users}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
              onAssigneeChange={handleAssigneeChange}
              onDelete={onTaskDelete}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>No tasks match your filters. Try changing your filter criteria or add a new task.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList; 