import React, { useState, useEffect } from 'react';
import { Task } from '../types/Task';
import { User } from '../types/User';
import { Project } from '../types/Project';
import '../styles/TaskDetail.css';

interface TaskDetailProps {
  task: Task;
  users: User[];
  projects: Project[];
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  users,
  projects,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [comment, setComment] = useState<string>('');
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    setEditedTask({ ...task });
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedTask({ ...task });
    setEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      text: comment,
      userId: '1', // Replace with actual user ID
      userName: 'Current User', // Replace with actual user name
      createdAt: new Date().toISOString()
    };
    
    setEditedTask(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newComment]
    }));
    
    setComment('');
    onUpdate({
      ...editedTask,
      comments: [...(editedTask.comments || []), newComment]
    });
  };

  const handleAddAttachment = () => {
    if (!attachmentName.trim()) return;
    
    const newAttachment = {
      id: Date.now().toString(),
      name: attachmentName,
      url: '#',
      uploadedBy: '1', // Replace with actual user ID
      uploadedAt: new Date().toISOString()
    };
    
    setEditedTask(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), newAttachment]
    }));
    
    setAttachmentName('');
    setIsUploading(false);
    onUpdate({
      ...editedTask,
      attachments: [...(editedTask.attachments || []), newAttachment]
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'in progress':
        return 'status-in-progress';
      case 'review':
        return 'status-review';
      case 'todo':
        return 'status-todo';
      default:
        return '';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  return (
    <div className="task-detail-overlay">
      <div className="task-detail-container">
        <div className="task-detail-header">
          <button className="close-button" onClick={onClose}>×</button>
          {!editMode ? (
            <div className="task-detail-title-container">
              <h2>{task.title}</h2>
              <div className="task-detail-actions">
                <button className="edit-button" onClick={() => setEditMode(true)}>Edit</button>
                <button className="delete-button" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          ) : (
            <div className="task-detail-title-container">
              <input
                type="text"
                name="title"
                value={editedTask.title}
                onChange={handleInputChange}
                className="task-title-input"
              />
              <div className="task-detail-actions">
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="task-detail-content">
          {!editMode ? (
            <>
              <div className="task-detail-info">
                <div className="task-info-item">
                  <span className="info-label">Status:</span>
                  <span className={`info-value status-badge ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div className="task-info-item">
                  <span className="info-label">Priority:</span>
                  <span className={`info-value priority-badge ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="task-info-item">
                  <span className="info-label">Project:</span>
                  <span className="info-value">
                    {projects.find(p => p.id === task.projectId)?.name || 'Unknown Project'}
                  </span>
                </div>
                <div className="task-info-item">
                  <span className="info-label">Assigned To:</span>
                  <span className="info-value">
                    {users.find(u => u.id === task.assigneeId)?.name || 'Unassigned'}
                  </span>
                </div>
                <div className="task-info-item">
                  <span className="info-label">Due Date:</span>
                  <span className="info-value">
                    {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                  </span>
                </div>
              </div>
              
              <div className="task-description">
                <h3>Description</h3>
                <p>{task.description || 'No description provided.'}</p>
              </div>
            </>
          ) : (
            <div className="task-edit-form">
              <div className="form-group">
                <label>Status:</label>
                <select
                  name="status"
                  value={editedTask.status}
                  onChange={handleInputChange}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Priority:</label>
                <select
                  name="priority"
                  value={editedTask.priority}
                  onChange={handleInputChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Project:</label>
                <select
                  name="projectId"
                  value={editedTask.projectId}
                  onChange={handleInputChange}
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Assigned To:</label>
                <select
                  name="assigneeId"
                  value={editedTask.assigneeId || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Due Date:</label>
                <input
                  type="date"
                  name="dueDate"
                  value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={editedTask.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <div className="task-attachments">
            <h3>Attachments</h3>
            {task.attachments && task.attachments.length > 0 ? (
              <ul className="attachments-list">
                {task.attachments.map(attachment => (
                  <li key={attachment.id} className="attachment-item">
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                      {attachment.name}
                    </a>
                    <span className="attachment-info">
                      Uploaded on {formatDate(attachment.uploadedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-items-message">No attachments</p>
            )}
            
            <div className="add-attachment">
              {isUploading ? (
                <div className="attachment-form">
                  <input
                    type="text"
                    placeholder="Attachment name"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                  />
                  <div className="attachment-actions">
                    <button onClick={handleAddAttachment}>Add</button>
                    <button onClick={() => setIsUploading(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setIsUploading(true)}>Add Attachment</button>
              )}
            </div>
          </div>
          
          <div className="task-comments">
            <h3>Comments</h3>
            {task.comments && task.comments.length > 0 ? (
              <ul className="comments-list">
                {task.comments.map(comment => (
                  <li key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.userName}</span>
                      <span className="comment-date">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-items-message">No comments</p>
            )}
            
            <div className="add-comment">
              <textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={handleAddComment}>Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail; 