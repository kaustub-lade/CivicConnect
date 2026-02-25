import express ,{ Request, Response } from 'express';
import { protect } from '../middleware/auth.middleware';
import { upload, uploadToCloudinary } from '../utils/cloudinary.utils';

const router = express.Router();

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file, 'civicconnect/complaints');

    res.json({
      success: true,
      url: imageUrl,
      message: 'Image uploaded successfully'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
});

export default router;
