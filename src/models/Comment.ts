import mongoose, { Schema } from 'mongoose';
import { IComment } from '@/types';

const CommentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: true,
    maxlength: 500,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  confession: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
CommentSchema.index({ confession: 1, createdAt: -1 });
CommentSchema.index({ author: 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
