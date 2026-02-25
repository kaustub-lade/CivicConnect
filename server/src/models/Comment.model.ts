import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  complaint: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  complaint: {
    type: Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    minlength: [1, 'Comment must be at least 1 character'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

export default mongoose.model<IComment>('Comment', CommentSchema);
