import express from 'express';
import { 
  getAllDocuments, 
  getDocumentById, 
  createDocument, 
  updateDocument, 
  deleteDocument,
  getDocumentsByProject
} from '../controllers/documentController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/fileUpload';

const router = express.Router();

// Get all documents
router.get('/', authenticate, getAllDocuments);

// Get document by ID
router.get('/:id', authenticate, getDocumentById);

// Get documents by project ID
router.get('/project/:projectId', authenticate, getDocumentsByProject);

// Create new document with file upload
router.post('/', authenticate, upload.single('file'), createDocument);

// Update document
router.put('/:id', authenticate, updateDocument);

// Delete document
router.delete('/:id', authenticate, deleteDocument);

export default router; 