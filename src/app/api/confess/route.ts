import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import '@/models'; // Import all models to ensure they're registered
import Confession from '@/models/Confession';
import { ApiResponse, CreateConfessionData, PaginationParams } from '@/types';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body: CreateConfessionData = await req.json();
    const { title, body: content, tag } = body;
    
    // Get client IP
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
    
    // Validate input
    if (!title || !content) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Title and body are required',
      }, { status: 400 });
    }
    
    if (title.length > 200) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Title must be less than 200 characters',
      }, { status: 400 });
    }
    
    if (content.length > 2000) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Body must be less than 2000 characters',
      }, { status: 400 });
    }
    
    const confession = await Confession.create({
      title,
      body: content,
      tag: tag || 'Other',
      authorIP: ip,
    });
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: confession,
      message: 'Confession created successfully',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating confession:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'recent';
    const tag = searchParams.get('tag');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = {};
    if (tag && tag !== 'all') {
      query.tag = tag;
    }
    
    // Build sort
    let sortQuery: any = { createdAt: -1 }; // Default: recent
    
    if (sort === 'trending') {
      // Trending: high votes + recent (last 7 days weight)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      sortQuery = { totalVotes: -1, createdAt: -1 };
    } else if (sort === 'votes') {
      sortQuery = { totalVotes: -1, createdAt: -1 };
    }
    
    // Get confessions with pagination
    const confessions = await Confession.find(query)
      .populate('comments')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const total = await Confession.countDocuments(query);
    
    const response = {
      confessions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: response,
    });
    
  } catch (error) {
    console.error('Error fetching confessions:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
