import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteerOpportunity extends Document {
  title: string;
  description: string;
  category: string;
  location: string;
  date: Date;
  duration: string;
  participantsNeeded: number;
  participants: mongoose.Types.ObjectId[];
  organizer: mongoose.Types.ObjectId;
  status: 'open' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerOpportunitySchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  participantsNeeded: {
    type: Number,
    required: true,
    min: 1
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed'],
    default: 'open'
  }
}, {
  timestamps: true
});

export default mongoose.model<IVolunteerOpportunity>('VolunteerOpportunity', VolunteerOpportunitySchema);
