import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? 'EXISTS' : 'MISSING',
      MONGODB_URI_LENGTH: process.env.MONGODB_URI?.length || 0,
      MONGODB_URI_STARTS_WITH: process.env.MONGODB_URI?.substring(0, 20) || 'N/A',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'EXISTS' : 'MISSING',
      ALL_ENV_KEYS: Object.keys(process.env).filter(key => 
        key.includes('MONGODB') || 
        key.includes('NEXTAUTH') || 
        key.includes('GOOGLE')
      )
    }
  });
}
