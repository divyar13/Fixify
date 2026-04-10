import express from 'express';
import {
  shareError,
  unshareError,
  getCommunityFeed,
  upvoteError,
  getLanguages,
} from '../controllers/communityController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/share', authMiddleware, shareError);

router.post('/unshare/:id', authMiddleware, unshareError);

router.get('/feed', getCommunityFeed);

router.get('/languages', getLanguages);

router.post('/:id/upvote', upvoteError);

export default router;
