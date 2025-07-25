import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Check if user is admin for admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const token = req.nextauth.token;
      if (!token?.isAdmin) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Admin routes require admin access
        if (pathname.startsWith('/admin')) {
          return token?.isAdmin === true;
        }
        
        // Protected API routes
        if (pathname.startsWith('/api/confess/') && 
            (pathname.includes('/comment') || pathname.includes('/vote'))) {
          return !!token;
        }
        
        // Other protected routes
        if (pathname.startsWith('/profile')) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/api/confess/:path*/comment',
    '/api/confess/:path*/vote',
    '/api/comment/:path*',
  ],
};
