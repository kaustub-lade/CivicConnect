import { Request, Response } from 'express';
import Complaint from '../models/Complaint.model';
import User from '../models/User.model';

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Public
export const getComplaints = async (req: Request, res: Response) => {
  try {
    const { category, status, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query: any = {};
    if (category && category !== 'all') query.category = category;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$text = { $search: search as string };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const complaints = await Complaint.find(query)
      .populate('createdBy', 'name avatar')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Complaint.countDocuments(query);

    res.json({
      success: true,
      data: complaints,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Public
export const getComplaint = async (req: Request, res: Response) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('createdBy', 'name avatar email')
      .populate('assignedTo', 'name email')
      .populate('updates.updatedBy', 'name');

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
export const createComplaint = async (req: Request, res: Response) => {
  try {
    const { title, description, category, imageURL, location, priority } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      imageURL,
      location,
      priority,
      createdBy: req.user?.id
    });

    // Award points to user for reporting
    await User.findByIdAndUpdate(req.user?.id, { $inc: { points: 10 } });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('createdBy', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: populatedComplaint
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private (Authority/Admin)
export const updateComplaint = async (req: Request, res: Response) => {
  try {
    const { status, assignedTo, priority } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Update fields
    if (status) complaint.status = status;
    if (assignedTo) complaint.assignedTo = assignedTo;
    if (priority) complaint.priority = priority;

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('createdBy', 'name avatar')
      .populate('assignedTo', 'name');

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      data: updatedComplaint
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Creator/Admin)
export const deleteComplaint = async (req: Request, res: Response) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Check if user is the creator or admin
    if (complaint.createdBy.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this complaint' });
    }

    await complaint.deleteOne();

    res.json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Upvote complaint
// @route   POST /api/complaints/:id/upvote
// @access  Private
export const upvoteComplaint = async (req: Request, res: Response) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const userId = req.user?.id;
    const alreadyUpvoted = complaint.upvotes.includes(userId);

    if (alreadyUpvoted) {
      // Remove upvote
      complaint.upvotes = complaint.upvotes.filter(id => id.toString() !== userId);
      complaint.upvoteCount -= 1;
    } else {
      // Add upvote
      complaint.upvotes.push(userId);
      complaint.upvoteCount += 1;
    }

    await complaint.save();

    res.json({
      success: true,
      message: alreadyUpvoted ? 'Upvote removed' : 'Upvoted successfully',
      upvoteCount: complaint.upvoteCount
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Add update to complaint
// @route   POST /api/complaints/:id/updates
// @access  Private (Authority/Admin)
export const addUpdate = async (req: Request, res: Response) => {
  try {
    const { message, image } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    complaint.updates.push({
      message,
      image,
      timestamp: new Date(),
      updatedBy: req.user?.id
    });

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('updates.updatedBy', 'name');

    res.json({
      success: true,
      message: 'Update added successfully',
      data: updatedComplaint
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// @desc    Get statistics
// @route   GET /api/complaints/stats
// @access  Public
export const getStats = async (req: Request, res: Response) => {
  try {
    const totalIssues = await Complaint.countDocuments();
    const resolvedIssues = await Complaint.countDocuments({ status: 'resolved' });
    const inProgressIssues = await Complaint.countDocuments({ status: 'in-progress' });
    
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalIssues,
        resolvedIssues,
        inProgressIssues,
        categoryStats
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};
