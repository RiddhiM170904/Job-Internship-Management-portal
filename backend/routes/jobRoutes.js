import express from 'express';
import { 
  getAllJobs, 
  getJobById, 
  createJob, 
  updateJob, 
  deleteJob 
} from '../controllers/jobController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createJob);
router.put('/:id', authMiddleware, adminMiddleware, updateJob);
router.delete('/:id', authMiddleware, adminMiddleware, deleteJob);

export default router;
