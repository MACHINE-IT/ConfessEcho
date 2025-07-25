import mongoose, { Schema } from 'mongoose';
import { IConfession } from '@/types';

const ConfessionSchema = new Schema<IConfession>({
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  body: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  tag: {
    type: String,
    enum: ['Love', 'Career', 'School', 'Family', 'Friendship', 'Health', 'Money', 'Personal', 'Other'],
    default: 'Other',
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  authorIP: {
    type: String,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for comments
ConfessionSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'confession',
});

// Update totalVotes when upvotes or downvotes change
ConfessionSchema.pre('save', function(next) {
  this.totalVotes = this.upvotes - this.downvotes;
  next();
});

// Index for efficient queries
ConfessionSchema.index({ createdAt: -1 });
ConfessionSchema.index({ totalVotes: -1, createdAt: -1 });
ConfessionSchema.index({ tag: 1, createdAt: -1 });
ConfessionSchema.index({ isFeatured: -1, createdAt: -1 });

export default mongoose.models.Confession || mongoose.model<IConfession>('Confession', ConfessionSchema);
