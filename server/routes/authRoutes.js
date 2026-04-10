import express from 'express';
import passport from 'passport';
import { googleCallback, getCurrentUser, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleCallback
);

router.get('/me', authMiddleware, getCurrentUser);

router.post('/logout', logout);

export default router;
