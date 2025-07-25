<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ConfessEcho - Anonymous Confession Web App

This is a full-stack Next.js 14+ application for anonymous confessions with the following tech stack:

## Tech Stack
- **Frontend**: Next.js 14+ App Router, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: OpenAI API for confession advice
- **Email**: Resend API
- **Deployment**: Vercel

## Project Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components and UI components
- `src/lib/` - Utility functions, database connection, auth config
- `src/models/` - Mongoose schemas
- `src/types/` - TypeScript type definitions
- `middleware.ts` - Next.js middleware for route protection

## Key Features
- Anonymous confession posting
- User authentication (Google OAuth)
- Voting system (upvote/downvote)
- Commenting system
- AI-powered advice using OpenAI
- Admin panel for moderation
- Trending/featured confessions
- Mobile-responsive design

## Database Models
- **User**: email, name, image, isAdmin
- **Confession**: title, body, tag, votes, isFeatured, authorIP
- **Comment**: content, author, confession
- **Vote**: user, confession, voteType

## API Routes
- `/api/confess` - CRUD operations for confessions
- `/api/confess/[id]/vote` - Voting functionality
- `/api/confess/[id]/comment` - Adding comments
- `/api/confess/[id]/feature` - Admin featuring confessions
- `/api/comment/[id]` - Comment management
- `/api/trending` - Trending confessions
- `/api/ai/advice` - AI advice generation
- `/api/auth/[...nextauth]` - NextAuth.js routes

## Code Style
- Use TypeScript with strict type checking
- Follow React hooks best practices
- Use ShadCN UI components for consistency
- Implement proper error handling and loading states
- Use server components where possible, client components only when needed
- Follow Next.js App Router conventions

## Security & Privacy
- Anonymous posting (only IP stored for moderation)
- Protected routes using middleware
- Admin-only functionality
- Input validation and sanitization
- Rate limiting for AI API calls

When working on this project, maintain the existing patterns and ensure all new features follow the established architecture.
