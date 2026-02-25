import express from 'express';
import {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  upvoteComplaint,
  addUpdate,
  getStats
} from '../controllers/complaint.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/stats', getStats);
router.get('/', getComplaints);
router.get('/:id', getComplaint);
router.post('/', protect, createComplaint);
router.put('/:id', protect, authorize('authority', 'admin'), updateComplaint);
router.delete('/:id', protect, deleteComplaint);
router.post('/:id/upvote', protect, upvoteComplaint);
router.post('/:id/updates', protect, authorize('authority', 'admin'), addUpdate);

export default router;
