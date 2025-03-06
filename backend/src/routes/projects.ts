import express from 'express';
import { 
  getAllProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get all projects
router.get('/', authenticate, getAllProjects);

// Get project by ID
router.get('/:id', authenticate, getProjectById);

// Create new project
router.post('/', authenticate, createProject);

// Update project
router.put('/:id', authenticate, updateProject);

// Delete project
router.delete('/:id', authenticate, deleteProject);

export default router; 