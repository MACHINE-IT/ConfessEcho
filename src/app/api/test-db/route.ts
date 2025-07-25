import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length);
    console.log('MONGODB_URI starts with mongodb:', process.env.MONGODB_URI?.startsWith('mongodb'));
    
    // First check if environment variable exists
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_URI environment variable is not set',
        debug: {
          nodeEnv: process.env.NODE_ENV,
          vercelEnv: process.env.VERCEL_ENV,
          allMongoVars: Object.keys(process.env).filter(key => key.includes('MONGO'))
        }
      }, { status: 500 });
    }

    // Try dynamic import of dbConnect to avoid build-time issues
    const { default: dbConnect } = await import('@/lib/db');
    await dbConnect();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      debug: {
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoUriLength: process.env.MONGODB_URI?.length,
        mongoUriFormat: process.env.MONGODB_URI?.startsWith('mongodb') ? 'Valid' : 'Invalid',
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      }
    });
    
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        hasMongoUri: !!process.env.MONGODB_URI,
        mongoUriLength: process.env.MONGODB_URI?.length,
        mongoUriFormat: process.env.MONGODB_URI?.startsWith('mongodb') ? 'Valid' : 'Invalid',
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        stack: error instanceof Error ? error.stack : 'No stack trace'
      }
    }, { status: 500 });
  }
}
