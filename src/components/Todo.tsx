import React from 'react';
import { Task, User } from '../types/project';
import '../styles/Todo.css';

interface TodoProps {
  task: Task;
  users: User[];
  onStatusChange?: (taskId: string, newStatus: string) => void;
  onPriorityChange?: (taskId: string, newPriority: string) => void;
  onAssigneeChange?: (taskId: string, newAssigneeId: string) => void;
  onDelete?: (taskId: string) => void;
}

const Todo: React.FC<TodoProps> = ({
  task,
  users,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onDelete
}) => {
  // Format the due date
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    return dueDate < today && task.status !== 'completed';
  };

  // Get the assigned user's name
  const getAssigneeName = () => {
    if (!task.assigned_to) return 'Unassigned';
    return task.assigned_to;
  };

  // Get initials for the avatar
  const getInitials = (name: string) => {
    if (!name || name === 'Unassigned') return 'UA';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`todo-item ${isOverdue() ? 'overdue' : ''}`} data-status={task.status}>
      <div className="todo-header">
        <div className="todo-status">
          <select 
            value={task.status} 
            onChange={(e) => onStatusChange && onStatusChange(task.id, e.target.value)}
            className={`status-select status-${task.status}`}
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="todo-actions">
          <button 
            className="delete-button" 
            onClick={() => onDelete && onDelete(task.id)}
            title="Delete task"
          >
            ×
          </button>
        </div>
      </div>

      <div className="todo-content">
        <h3 className="todo-title">{task.title}</h3>
        <p className="todo-description">{task.description}</p>
      </div>

      <div className="todo-footer">
        <div className="todo-meta">
          <div className="todo-priority">
            <label>Priority:</label>
            <select 
              value={task.priority} 
              onChange={(e) => onPriorityChange && onPriorityChange(task.id, e.target.value)}
              className={`priority-select priority-${task.priority}`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="todo-due-date">
            <span className="due-date-label">Due:</span>
            <span className={`due-date-value ${isOverdue() ? 'overdue' : ''}`}>
              {task.due_date ? formatDueDate(task.due_date) : 'No due date'}
            </span>
          </div>
        </div>

        <div className="todo-assignee">
          <label>Assigned to:</label>
          <div className="assignee-selector">
            <div className="assignee-avatar" title={getAssigneeName()}>
              {getInitials(getAssigneeName())}
            </div>
            <select 
              value={task.assigned_to || ''} 
              onChange={(e) => onAssigneeChange && onAssigneeChange(task.id, e.target.value)}
              className="assignee-select"
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
      </div>
    </div>
  );
};

export default Todo; 