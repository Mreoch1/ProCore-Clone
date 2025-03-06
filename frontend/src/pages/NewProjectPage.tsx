import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../utils/supabaseClient';
import '../styles/NewProjectPage.css';

interface NewProjectPageProps {}

const NewProjectPage: React.FC<NewProjectPageProps> = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client: '',
    location: '',
    start_date: '',
    end_date: '',
    budget: '',
    status: 'planning'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Project name is required');
      }
      
      // Format budget as number if provided
      const budget = formData.budget ? parseFloat(formData.budget) : null;
      
      // Create project
      const { data, error: createError } = await createProject({
        ...formData,
        budget
      });
      
      if (createError) {
        throw new Error(createError.message);
      }
      
      if (data) {
        // Navigate to the new project page
        navigate(`/projects/${data.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <div className="new-project-page">
      <div className="page-header">
        <h1>Create New Project</h1>
        <button className="cancel-button" onClick={handleCancel}>
          <i className="fas fa-times"></i>
          Cancel
        </button>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Project Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
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
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            
            <div className="form-group full-width">
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
              <label htmlFor="client">Client</label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
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
            
            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="budget">Budget ($)</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter project budget"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="secondary-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="primary-button"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectPage; 