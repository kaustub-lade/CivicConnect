import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaint extends Document {
  title: string;
  description: string;
  category: 'garbage' | 'water' | 'roads' | 'electricity' | 'public-safety' | 'other';
  imageURL?: string; // For backwards compatibility
  images?: string[]; // Support multiple images
  location: {
    lat: number;
    lng: number;
    area: string;
    address?: string;
  };
  status: 'submitted' | 'verified' | 'assigned' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  upvotes: mongoose.Types.ObjectId[];
  upvoteCount: number;
  updates: {
    message: string;
    image?: string;
    timestamp: Date;
    updatedBy: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['garbage', 'water', 'roads', 'electricity', 'public-safety', 'other']
  },
  imageURL: {
    type: String,
    default: ''
  },
  images: {
    type: [String],
    default: []
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required']
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['submitted', 'verified', 'assigned', 'in-progress', 'resolved'],
    default: 'submitted'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  upvoteCount: {
    type: Number,
    default: 0
  },
  updates: [{
    message: {
      type: String,
      required: true
    },
    image: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }]
}, {
  timestamps: true
});

// Index for geospatial queries
ComplaintSchema.index({ 'location.lat': 1, 'location.lng': 1 });

// Index for text search
ComplaintSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IComplaint>('Complaint', ComplaintSchema);
