import express from 'express';
import {
  getUserHistory,
  getErrorById,
  updateError,
  deleteError,
  getStats,
} from '../controllers/historyController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUserHistory);

router.get('/stats', authMiddleware, getStats);

router.get('/:id', authMiddleware, getErrorById);

router.put('/:id', authMiddleware, updateError);

router.delete('/:id', authMiddleware, deleteError);

export default router;
