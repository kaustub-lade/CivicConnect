import express from 'express';
import { protect } from '../middleware/auth.middleware';
import VolunteerOpportunity from '../models/VolunteerOpportunity.model';
import User from '../models/User.model';

const router = express.Router();

// @desc    Get all volunteer opportunities
// @route   GET /api/volunteers/opportunities
// @access  Public
router.get('/opportunities', async (_req, res) => {
  try {
    const opportunities = await VolunteerOpportunity.find({ status: 'open' })
      .populate('organizer', 'name')
      .sort({ date: 1 });

    res.json({
      success: true,
      data: opportunities
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @desc    Create volunteer opportunity
// @route   POST /api/volunteers/opportunities
// @access  Private
router.post('/opportunities', protect, async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.create({
      ...req.body,
      organizer: req.user?.id
    });

    res.status(201).json({
      success: true,
      data: opportunity
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @desc    Join volunteer opportunity
// @route   POST /api/volunteers/opportunities/:id/join
// @access  Private
router.post('/opportunities/:id/join', protect, async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    if (opportunity.participants.includes(req.user?.id)) {
      return res.status(400).json({ error: 'Already joined this opportunity' });
    }

    if (opportunity.participants.length >= opportunity.participantsNeeded) {
      return res.status(400).json({ error: 'This opportunity is full' });
    }

    opportunity.participants.push(req.user?.id);
    await opportunity.save();

    // Award points to user
    await User.findByIdAndUpdate(req.user?.id, { $inc: { points: 5 } });

    res.json({
      success: true,
      message: 'Successfully joined the opportunity'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

export default router;
