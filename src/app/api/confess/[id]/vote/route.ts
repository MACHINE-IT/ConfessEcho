import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Confession from '@/models/Confession';
import Vote from '@/models/Vote';
import { authOptions } from '@/lib/auth';
import { ApiResponse } from '@/types';

interface Params {
  id: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required to vote',
      }, { status: 401 });
    }
    
    await dbConnect();
    
    const { voteType }: { voteType: 'upvote' | 'downvote' } = await req.json();
    
    if (!['upvote', 'downvote'].includes(voteType)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid vote type',
      }, { status: 400 });
    }
    
    const confession = await Confession.findById(params.id);
    
    if (!confession) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Confession not found',
      }, { status: 404 });
    }
    
    // Check if user already voted
    const existingVote = await Vote.findOne({
      user: session.user.id,
      confession: params.id,
    });
    
    if (existingVote) {
      // If same vote type, remove the vote
      if (existingVote.voteType === voteType) {
        await existingVote.deleteOne();
        
        // Update confession vote counts
        if (voteType === 'upvote') {
          confession.upvotes = Math.max(0, confession.upvotes - 1);
        } else {
          confession.downvotes = Math.max(0, confession.downvotes - 1);
        }
        
        await confession.save();
        
        return NextResponse.json<ApiResponse>({
          success: true,
          message: 'Vote removed',
          data: {
            action: 'removed',
            upvotes: confession.upvotes,
            downvotes: confession.downvotes,
            totalVotes: confession.totalVotes,
          },
        });
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        await existingVote.save();
        
        // Update confession vote counts
        if (voteType === 'upvote') {
          confession.upvotes += 1;
          confession.downvotes = Math.max(0, confession.downvotes - 1);
        } else {
          confession.downvotes += 1;
          confession.upvotes = Math.max(0, confession.upvotes - 1);
        }
        
        await confession.save();
        
        return NextResponse.json<ApiResponse>({
          success: true,
          message: 'Vote updated',
          data: {
            action: 'updated',
            voteType,
            upvotes: confession.upvotes,
            downvotes: confession.downvotes,
            totalVotes: confession.totalVotes,
          },
        });
      }
    } else {
      // Create new vote
      await Vote.create({
        user: session.user.id,
        confession: params.id,
        voteType,
      });
      
      // Update confession vote counts
      if (voteType === 'upvote') {
        confession.upvotes += 1;
      } else {
        confession.downvotes += 1;
      }
      
      await confession.save();
      
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Vote recorded',
        data: {
          action: 'created',
          voteType,
          upvotes: confession.upvotes,
          downvotes: confession.downvotes,
          totalVotes: confession.totalVotes,
        },
      });
    }
    
  } catch (error) {
    console.error('Error handling vote:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
