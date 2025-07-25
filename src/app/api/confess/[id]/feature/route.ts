import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Confession from '@/models/Confession';
import { authOptions } from '@/lib/auth';
import { ApiResponse } from '@/types';

export async function PATCH(
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
    
    const { isFeatured }: { isFeatured: boolean } = await req.json();
    
    const confession = await Confession.findById(id);
    
    if (!confession) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Confession not found',
      }, { status: 404 });
    }
    
    confession.isFeatured = isFeatured;
    await confession.save();
    
    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Confession ${isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: confession,
    });
    
  } catch (error) {
    console.error('Error featuring confession:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
