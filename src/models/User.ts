import mongoose, { Schema } from 'mongoose';
import { IUser } from '@/types';

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Check if user is admin based on email
UserSchema.pre('save', function(next) {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  this.isAdmin = adminEmails.includes(this.email);
  next();
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
