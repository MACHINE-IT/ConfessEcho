import mongoose, { Schema } from 'mongoose';
import { IVote } from '@/types';

const VoteSchema = new Schema<IVote>({
  user: {
    type: String,
    ref: 'User',
  },
  confession: {
    type: String,
    required: true,
  },
  voteType: {
    type: String,
    enum: ['upvote', 'downvote'],
    required: true,
  },
  userIP: {
    type: String,
  },
}, {
  timestamps: true,
});

// Ensure one vote per user/IP per confession
VoteSchema.index({ user: 1, confession: 1 }, { unique: true, sparse: true });
VoteSchema.index({ userIP: 1, confession: 1 }, { unique: true, sparse: true });

export default mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);
