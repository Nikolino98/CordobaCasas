import express from 'express';
import {
  getUserById,
  updateUser
} from '../models/userModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in GET /users/profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', protect, async (req, res) => {
  try {
    const updatedUser = await updateUser(req.user.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error in PUT /users/profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

export default router;