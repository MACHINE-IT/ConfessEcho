import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  image?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConfession extends Document {
  _id: string;
  title: string;
  body: string;
  tag?: string;
  upvotes: number;
  downvotes: number;
  totalVotes: number;
  isFeatured: boolean;
  authorIP?: string;
  createdAt: Date;
  updatedAt: Date;
  comments: IComment[];
}

export interface IComment extends Document {
  _id: string;
  content: string;
  author: IUser;
  confession: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVote extends Document {
  _id: string;
  user?: IUser;
  confession: string;
  voteType: 'upvote' | 'downvote';
  userIP?: string;
  createdAt: Date;
}

export type ConfessionTag = 
  | 'Love'
  | 'Career'
  | 'School'
  | 'Family'
  | 'Friendship'
  | 'Health'
  | 'Money'
  | 'Personal'
  | 'Other';

export interface CreateConfessionData {
  title: string;
  body: string;
  tag?: ConfessionTag;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: 'recent' | 'trending' | 'votes';
  tag?: ConfessionTag;
}

export interface AIAdviceResponse {
  advice: string;
  category: string;
  resources?: string[];
}
