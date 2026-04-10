import express from 'express';
import { analyzeError, getSimilarErrors } from '../controllers/debugController.js';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', optionalAuthMiddleware, analyzeError);

router.get('/similar', getSimilarErrors);

export default router;
