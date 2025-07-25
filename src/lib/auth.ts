import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// Temporarily using JWT strategy for OAuth testing
// import { MongoDBAdapter } from '@auth/mongodb-adapter';
// import { MongoClient } from 'mongodb';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// const client = new MongoClient(process.env.MONGODB_URI!);

export const authOptions: NextAuthOptions = {
  // adapter: MongoDBAdapter(client), // Temporarily disabled
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user?.email) {
        // Try to get user from database but don't fail if it doesn't exist
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.isAdmin = dbUser.isAdmin;
          } else {
            // Create user if they don't exist
            const newUser = await User.create({
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
            });
            session.user.id = newUser._id.toString();
            session.user.isAdmin = newUser.isAdmin;
          }
        } catch (error) {
          console.error('Error handling user in session:', error);
          // Set fallback values
          session.user.id = token.sub || 'temp-id';
          session.user.isAdmin = false;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Always allow Google sign-ins
      return true;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      isAdmin?: boolean;
    };
  }
}
