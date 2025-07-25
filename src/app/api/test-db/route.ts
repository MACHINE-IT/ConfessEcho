import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_URI starts with mongodb:', process.env.MONGODB_URI?.startsWith('mongodb'));
    
    await dbConnect();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      envCheck: {
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoUriFormat: process.env.MONGODB_URI?.startsWith('mongodb') ? 'Valid' : 'Invalid'
      }
    });
    
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      envCheck: {
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoUriFormat: process.env.MONGODB_URI?.startsWith('mongodb') ? 'Valid' : 'Invalid'
      }
    }, { status: 500 });
  }
}
