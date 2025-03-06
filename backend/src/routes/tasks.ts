import express from 'express';
import { 
  getAllTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask,
  getTasksByProject,
  getTasksByAssignee
} from '../controllers/taskController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get all tasks
router.get('/', authenticate, getAllTasks);

// Get task by ID
router.get('/:id', authenticate, getTaskById);

// Get tasks by project ID
router.get('/project/:projectId', authenticate, getTasksByProject);

// Get tasks by assignee ID
router.get('/assignee/:userId', authenticate, getTasksByAssignee);

// Create new task
router.post('/', authenticate, createTask);

// Update task
router.put('/:id', authenticate, updateTask);

// Delete task
router.delete('/:id', authenticate, deleteTask);

export default router; 