import express from 'express';
import { 
  createApplication, 
  getMyApplications, 
  getAllApplications, 
  updateApplicationStatus,
  getApplicationById
} from '../controllers/applicationController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', authMiddleware, createApplication);
router.get('/me', authMiddleware, getMyApplications);
router.get('/:id', authMiddleware, getApplicationById);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllApplications);
router.put('/:id/status', authMiddleware, adminMiddleware, updateApplicationStatus);

export default router;
