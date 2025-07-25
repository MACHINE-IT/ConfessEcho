# Deployment Guide for Confessly

## Quick Setup

### 1. Environment Variables
Set up the following environment variables in your deployment platform:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/confessly?retryWrites=true&w=majority

# NextAuth.js
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI API (Get from OpenAI Platform)
OPENAI_API_KEY=sk-your-openai-api-key

# Resend API (Get from Resend.com)
RESEND_API_KEY=re_your-resend-api-key

# Admin Emails (comma separated)
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

### 2. MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Add your connection string to `MONGODB_URI`
4. Whitelist your deployment platform's IP addresses

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)

### 4. OpenAI API Setup
1. Sign up at [OpenAI Platform](https://platform.openai.com)
2. Create an API key
3. Add billing information for API usage

### 5. Resend Setup (Optional)
1. Sign up at [Resend.com](https://resend.com)
2. Create an API key
3. Verify your domain for email sending

### 6. Vercel Deployment
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Security Checklist
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Set up MongoDB IP whitelist
- [ ] Configure Google OAuth redirect URIs
- [ ] Set admin emails correctly
- [ ] Enable MongoDB authentication
- [ ] Use production MongoDB cluster

## Post-Deployment
1. Test Google OAuth login
2. Create a test confession
3. Test AI advice feature
4. Verify admin panel access
5. Test voting and commenting

## Monitoring
- Monitor OpenAI API usage and costs
- Check MongoDB connection and usage
- Monitor application performance in Vercel
- Set up error tracking (optional: Sentry)

## Scaling Considerations
- Consider MongoDB indexing for performance
- Implement rate limiting for API routes
- Add caching for frequently accessed data
- Monitor and optimize bundle size
