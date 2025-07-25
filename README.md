# ConfessEcho - Anonymous Confession Web App

A full-stack anonymous confession web app built with Next.js 14+, MongoDB, and modern UI components.

## Features

- 🔐 **Anonymous Confessions** - Anyone can post confessions without login
- 👆 **Voting System** - Upvote/downvote confessions (requires login)
- 💬 **Comments** - Add comments (login required)
- 🤖 **AI Advice** - Get advice on confessions using OpenAI API
- 👑 **Admin Panel** - Manage confessions and users (admin only)
- 🔍 **Trending** - View top confessions by votes and time
- 🏷️ **Tags** - Filter confessions by category
- 📱 **Responsive** - Mobile-first design

## Tech Stack

- **Frontend**: Next.js 14+ App Router, Tailwind CSS, ShadCN UI
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Auth**: NextAuth.js with Google OAuth
- **AI**: OpenAI API
- **Email**: Resend
- **Deployment**: Vercel + MongoDB Atlas

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.local` and fill in your credentials:
   - MongoDB connection string
   - NextAuth secret and Google OAuth credentials
   - OpenAI API key
   - Resend API key
   - Admin emails

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
ADMIN_EMAILS=admin@example.com
```

## API Routes

- `POST /api/confess` - Create confession
- `GET /api/confess` - List confessions
- `GET /api/confess/[id]` - Get single confession
- `PATCH /api/confess/[id]/vote` - Vote on confession
- `PATCH /api/confess/[id]/feature` - Feature confession (admin)
- `DELETE /api/confess/[id]` - Delete confession (admin)
- `POST /api/confess/[id]/comment` - Add comment
- `DELETE /api/comment/[id]` - Delete comment (admin)
- `GET /api/trending` - Get trending confessions
- `POST /api/ai/advice` - Get AI advice

## Pages

- `/` - Home feed
- `/confess` - New confession form
- `/confession/[id]` - Single confession view
- `/admin` - Admin dashboard
- `/profile` - User profile
- `/login` - Authentication

## Deployment

Deploy on Vercel with MongoDB Atlas:

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy!

## License

MIT License
