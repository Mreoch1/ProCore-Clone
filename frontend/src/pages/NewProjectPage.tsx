import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { createProject } from '../utils/supabaseClient';
import { Project } from '../types/Project';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/NewProjectPage.css';

const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    description: '',
    status: 'not_started',
    startDate: '',
    endDate: '',
    budget: undefined,
    progress: 0,
    clientName: '',
    location: '',
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle budget as a number
    if (name === 'budget') {
      setFormData({
        ...formData,
        [name]: value ? parseFloat(value) : undefined,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Project name is required';
    }
    
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        errors.endDate = 'End date cannot be before start date';
      }
    }
    
    if (formData.budget !== undefined && formData.budget < 0) {
      errors.budget = 'Budget cannot be negative';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Add creator information
      const projectData = {
        ...formData,
        createdBy: user?.id,
      };
      
      const newProject = await createProject(projectData);
      
      if (newProject) {
        navigate(`/projects/${newProject.id}`, { state: { message: 'Project created successfully' } });
      } else {
        setError('Failed to create project');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError('An error occurred while creating the project');
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/projects');
  };
  
  if (loading) {
    return <LoadingSpinner fullScreen message="Creating project..." />;
  }
  
  return (
    <div className="new-project-page">
      <div className="page-header">
        <h1>Create New Project</h1>
      </div>
      
      {error && (
        <div className="alert alert-error">
          {error}
          <button className="close-btn" onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <form className="project-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={formErrors.name ? 'error' : ''}
              placeholder="Enter project name"
              required
            />
            {formErrors.name && <div className="error-message">{formErrors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Timeline & Budget</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={formErrors.endDate ? 'error' : ''}
              />
              {formErrors.endDate && <div className="error-message">{formErrors.endDate}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="budget">Budget ($)</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget === undefined ? '' : formData.budget}
              onChange={handleChange}
              placeholder="Enter project budget"
              min="0"
              step="0.01"
              className={formErrors.budget ? 'error' : ''}
            />
            {formErrors.budget && <div className="error-message">{formErrors.budget}</div>}
          </div>
        </div>
        
        <div className="form-section">
          <h2>Client Information</h2>
          
          <div className="form-group">
            <label htmlFor="clientName">Client Name</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Enter client name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter project location"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectPage; 