import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import { authOptions } from '@/lib/auth';
import { ApiResponse } from '@/types';

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
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Comment not found',
      }, { status: 404 });
    }
    
    await comment.deleteOne();
    
    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Comment deleted successfully',
    });
    
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
