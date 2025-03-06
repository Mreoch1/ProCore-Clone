import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectDetail from '../components/ProjectDetail';
import { Project } from '../types/Project';
import { Task } from '../types/Task';
import { Document } from '../types/Document';
import { User } from '../types/User';
import { 
  getProject, 
  getProjectTasks, 
  getProjectDocuments, 
  getProjectTeam,
  updateTask,
  uploadDocument
} from '../utils/supabaseClient';
import '../styles/ProjectPage.css';

interface ProjectPageProps {}

const ProjectPage: React.FC<ProjectPageProps> = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [team, setTeam] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        setError('Project ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch project details
        const { data: projectData, error: projectError } = await getProject(projectId);
        
        if (projectError) {
          throw new Error(projectError.message);
        }
        
        if (!projectData) {
          throw new Error('Project not found');
        }
        
        setProject(projectData);
        
        // Fetch project tasks
        const { data: tasksData, error: tasksError } = await getProjectTasks(projectId);
        
        if (tasksError) {
          throw new Error(tasksError.message);
        }
        
        setTasks(tasksData || []);
        
        // Fetch project documents
        const { data: documentsData, error: documentsError } = await getProjectDocuments(projectId);
        
        if (documentsError) {
          throw new Error(documentsError.message);
        }
        
        setDocuments(documentsData || []);
        
        // Fetch project team
        const { data: teamData, error: teamError } = await getProjectTeam(projectId);
        
        if (teamError) {
          throw new Error(teamError.message);
        }
        
        setTeam(teamData || []);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);
  
  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      const { data, error } = await updateTask(updatedTask);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        // Update the tasks state with the updated task
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === updatedTask.id ? data : task
          )
        );
      }
    } catch (err) {
      console.error('Error updating task:', err);
      // You could set an error state here to display to the user
    }
  };
  
  const handleDocumentUpload = async (file: File, metadata: any) => {
    if (!projectId) return;
    
    try {
      const { data, error } = await uploadDocument(projectId, file, metadata);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        // Add the new document to the documents state
        setDocuments(prevDocuments => [...prevDocuments, data]);
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      // You could set an error state here to display to the user
    }
  };
  
  const handleBackClick = () => {
    navigate('/projects');
  };
  
  if (loading) {
    return <div className="loading-container">Loading project details...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error: {error}</h2>
        <button className="back-button" onClick={handleBackClick}>
          <i className="fas fa-arrow-left"></i>
          Back to Projects
        </button>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="not-found-container">
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist or you don't have access to it.</p>
        <button className="back-button" onClick={handleBackClick}>
          <i className="fas fa-arrow-left"></i>
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="project-page">
      <div className="project-page-header">
        <button className="back-button" onClick={handleBackClick}>
          <i className="fas fa-arrow-left"></i>
          Back to Projects
        </button>
      </div>
      
      <ProjectDetail
        project={project}
        tasks={tasks}
        documents={documents}
        team={team}
        onTaskUpdate={handleTaskUpdate}
        onDocumentUpload={handleDocumentUpload}
      />
    </div>
  );
};

export default ProjectPage; 