import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const googleCallback = (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }

  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.redirect(`${process.env.CLIENT_URL}?token=${token}&userId=${req.user._id}`);
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
