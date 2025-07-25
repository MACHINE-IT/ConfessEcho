'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { VoteButton } from '@/components/ui/vote-button'
import { MessageCircle, Sparkles } from 'lucide-react'
import { IConfession } from '@/types'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

// Simple time ago function
function timeAgo(date: Date) {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    return `${diffInDays}d ago`
  }
}

interface ConfessionCardProps {
  confession: IConfession & {
    comments?: any[]
    userVote?: 'upvote' | 'downvote' | null
  }
  showPreview?: boolean
}

export function ConfessionCard({ confession, showPreview = true }: ConfessionCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [voteLoading, setVoteLoading] = useState(false)
  const [votes, setVotes] = useState({
    upvotes: confession.upvotes,
    downvotes: confession.downvotes,
    userVote: confession.userVote || null,
  })

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!session) {
      router.push('/login')
      return
    }

    setVoteLoading(true)
    try {
      const response = await fetch(`/api/confess/${confession._id}/vote`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      })

      const data = await response.json()

      if (data.success) {
        setVotes({
          upvotes: data.data.upvotes,
          downvotes: data.data.downvotes,
          userVote: data.data.action === 'removed' ? null : voteType,
        })
        toast.success(data.message)
      } else {
        toast.error(data.error || 'Failed to vote')
      }
    } catch (error) {
      toast.error('Failed to vote')
    } finally {
      setVoteLoading(false)
    }
  }

  const previewBody = showPreview && confession.body.length > 200 
    ? confession.body.substring(0, 200) + '...' 
    : confession.body

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Link 
              href={`/confession/${confession._id}`}
              className="hover:underline"
            >
              <h3 className="font-semibold text-lg leading-tight">
                {confession.title}
              </h3>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {confession.isFeatured && (
              <Sparkles className="w-5 h-5 text-yellow-500" />
            )}
            <Badge variant="secondary" className="text-xs">
              {confession.tag}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {previewBody}
        </p>
        {showPreview && confession.body.length > 200 && (
          <Link 
            href={`/confession/${confession._id}`}
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            Read more
          </Link>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <VoteButton
              type="upvote"
              count={votes.upvotes}
              isActive={votes.userVote === 'upvote'}
              onClick={() => handleVote('upvote')}
              disabled={voteLoading}
            />
            <VoteButton
              type="downvote"
              count={votes.downvotes}
              isActive={votes.userVote === 'downvote'}
              onClick={() => handleVote('downvote')}
              disabled={voteLoading}
            />
            
            <Link 
              href={`/confession/${confession._id}`}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">
                {confession.comments?.length || 0}
              </span>
            </Link>
          </div>

          <time className="text-xs text-gray-500">
            {timeAgo(new Date(confession.createdAt))}
          </time>
        </div>
      </CardFooter>
    </Card>
  )
}
