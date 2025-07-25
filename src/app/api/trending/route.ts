import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Confession from '@/models/Confession';
import { ApiResponse } from '@/types';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const days = parseInt(searchParams.get('days') || '7');
    
    // Calculate date threshold
    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    // Get trending confessions
    // Combination of vote score and recency
    const trendingConfessions = await Confession.aggregate([
      {
        $match: {
          createdAt: { $gte: dateThreshold }
        }
      },
      {
        $addFields: {
          // Calculate trending score: totalVotes + (age factor)
          trendingScore: {
            $add: [
              '$totalVotes',
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: [new Date(), '$createdAt'] },
                      1000 * 60 * 60 * 24 // Convert to days
                    ]
                  },
                  -0.1 // Newer posts get higher score
                ]
              }
            ]
          }
        }
      },
      {
        $sort: { trendingScore: -1, totalVotes: -1, createdAt: -1 }
      },
      {
        $limit: limit
      }
    ]);
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        confessions: trendingConfessions,
        period: `${days} days`,
      },
    });
    
  } catch (error) {
    console.error('Error fetching trending confessions:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
