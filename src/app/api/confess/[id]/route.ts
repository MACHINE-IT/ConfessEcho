import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Confession from '@/models/Confession';
import Comment from '@/models/Comment';
import { authOptions } from '@/lib/auth';
import { ApiResponse } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const confession = await Confession.findById(id).lean();
    
    if (!confession) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Confession not found',
      }, { status: 404 });
    }
    
    // Get comments for this confession
    const comments = await Comment.find({ confession: id })
      .populate('author', 'name image')
      .sort({ createdAt: -1 })
      .lean();
    
    const response = {
      ...confession,
      comments,
    };
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: response,
    });
    
  } catch (error) {
    console.error('Error fetching confession:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized - Admin access required',
      }, { status: 403 });
    }
    
    await dbConnect();
    
    const confession = await Confession.findById(id);
    
    if (!confession) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Confession not found',
      }, { status: 404 });
    }
    
    // Delete all comments for this confession
    await Comment.deleteMany({ confession: id });
    
    // Delete the confession
    await confession.deleteOne();
    
    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Confession deleted successfully',
    });
    
  } catch (error) {
    console.error('Error deleting confession:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
