import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  loginUser,
  getCurrentUser
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Auth routes
router.post('/login', loginUser);
router.get('/me', authenticate, getCurrentUser);

// User management routes
router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.post('/', authenticate, createUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router; 