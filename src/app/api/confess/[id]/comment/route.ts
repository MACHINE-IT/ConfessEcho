import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import Confession from '@/models/Confession';
import { authOptions } from '@/lib/auth';
import { ApiResponse } from '@/types';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required to comment',
      }, { status: 401 });
    }
    
    await dbConnect();
    
    const { content }: { content: string } = await req.json();
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Comment content is required',
      }, { status: 400 });
    }
    
    if (content.length > 500) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Comment must be less than 500 characters',
      }, { status: 400 });
    }
    
    // Check if confession exists
    const confession = await Confession.findById(id);
    
    if (!confession) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Confession not found',
      }, { status: 404 });
    }
    
    const comment = await Comment.create({
      content: content.trim(),
      author: session.user.id,
      confession: id,
    });
    
    // Populate author information
    await comment.populate('author', 'name image');
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: comment,
      message: 'Comment added successfully',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
