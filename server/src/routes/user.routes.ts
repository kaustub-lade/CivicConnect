import express from 'express';
import { protect } from '../middleware/auth.middleware';
import User from '../models/User.model';
import Complaint from '../models/Complaint.model';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's complaints
    const complaints = await Complaint.find({ createdBy: user._id })
      .select('title status createdAt')
      .limit(10);

    res.json({
      success: true,
      data: {
        user,
        recentComplaints: complaints
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, location, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { name, phone, location, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
router.get('/leaderboard', async (_req, res) => {
  try {
    const topUsers = await User.find()
      .select('name avatar points badges')
      .sort({ points: -1 })
      .limit(10);

    res.json({
      success: true,
      data: topUsers
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

export default router;
