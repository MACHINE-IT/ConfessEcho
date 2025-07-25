'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { VoteButton } from '@/components/ui/vote-button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Loader2, 
  Send, 
  Sparkles, 
  Brain, 
  MessageCircle,
  Trash2,
  AlertTriangle 
} from 'lucide-react'
import Link from 'next/link'
import { IConfession, IComment, AIAdviceResponse } from '@/types'
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

export default function ConfessionPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  
  const [confession, setConfession] = useState<IConfession | null>(null)
  const [comments, setComments] = useState<IComment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [aiAdvice, setAiAdvice] = useState<AIAdviceResponse | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [voteLoading, setVoteLoading] = useState(false)
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchConfession()
    }
  }, [params.id])

  const fetchConfession = async () => {
    try {
      const response = await fetch(`/api/confess/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setConfession(data.data)
        setComments(data.data.comments || [])
      } else {
        toast.error(data.error || 'Confession not found')
        router.push('/')
      }
    } catch (error) {
      toast.error('Failed to load confession')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!session) {
      router.push('/login')
      return
    }

    if (!confession) return

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
        setConfession(prev => prev ? {
          ...prev,
          upvotes: data.data.upvotes,
          downvotes: data.data.downvotes,
          totalVotes: data.data.totalVotes,
        } as IConfession : null)
        setUserVote(data.data.action === 'removed' ? null : voteType)
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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push('/login')
      return
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    if (!confession) return

    setCommentLoading(true)
    try {
      const response = await fetch(`/api/confess/${confession._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })

      const data = await response.json()

      if (data.success) {
        setComments(prev => [data.data, ...prev])
        setNewComment('')
        toast.success('Comment added successfully')
      } else {
        toast.error(data.error || 'Failed to add comment')
      }
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleGetAIAdvice = async () => {
    if (!confession) return

    setAiLoading(true)
    try {
      const response = await fetch('/api/ai/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: confession.title,
          confession: confession.body,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setAiAdvice(data.data)
      } else {
        toast.error(data.error || 'Failed to get AI advice')
      }
    } catch (error) {
      toast.error('Failed to get AI advice')
    } finally {
      setAiLoading(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!session?.user?.isAdmin) return

    try {
      const response = await fetch(`/api/comment/${commentId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setComments(prev => prev.filter(c => c._id !== commentId))
        toast.success('Comment deleted')
      } else {
        toast.error(data.error || 'Failed to delete comment')
      }
    } catch (error) {
      toast.error('Failed to delete comment')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!confession) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Confession not found</h2>
        <Link href="/">
          <Button>Back to Feed</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Button>
      </Link>

      {/* Confession */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold leading-tight mb-2">
                {confession.title}
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{confession.tag}</Badge>
                {confession.isFeatured && (
                  <Badge variant="default" className="gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </Badge>
                )}
                <span className="text-sm text-gray-500">
                  {timeAgo(new Date(confession.createdAt))}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {confession.body}
          </p>

          {/* Voting and Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <VoteButton
                type="upvote"
                count={confession.upvotes}
                isActive={userVote === 'upvote'}
                onClick={() => handleVote('upvote')}
                disabled={voteLoading}
              />
              <VoteButton
                type="downvote"
                count={confession.downvotes}
                isActive={userVote === 'downvote'}
                onClick={() => handleVote('downvote')}
                disabled={voteLoading}
              />
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{comments.length}</span>
              </div>
            </div>

            <Button
              onClick={handleGetAIAdvice}
              disabled={aiLoading}
              variant="outline"
              className="gap-2"
            >
              {aiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Brain className="w-4 h-4" />
              )}
              Get AI Advice
            </Button>
          </div>

          {/* AI Advice */}
          {aiAdvice && (
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-200">
                  <Brain className="w-5 h-5" />
                  AI Advice & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                    Advice
                  </h4>
                  <p className="text-purple-700 dark:text-purple-200 leading-relaxed">
                    {aiAdvice.advice}
                  </p>
                </div>
                
                {aiAdvice.resources && aiAdvice.resources.length > 0 && (
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">
                      Suggested Resources
                    </h4>
                    <ul className="space-y-1">
                      {aiAdvice.resources.map((resource, index) => (
                        <li key={index} className="text-sm text-purple-600 dark:text-purple-300">
                          • {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                  <AlertTriangle className="w-3 h-3" />
                  This advice is AI-generated and should not replace professional help when needed.
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Add Comment */}
      {session ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add a Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <Textarea
                placeholder="Share your thoughts, support, or similar experiences..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {newComment.length}/500 characters
                </span>
                <Button
                  type="submit"
                  disabled={commentLoading || !newComment.trim()}
                  className="gap-2"
                >
                  {commentLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Post Comment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Sign in to add comments and vote on confessions
            </p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={comment._id}>
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.author.image || ''} />
                      <AvatarFallback>
                        {comment.author.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {timeAgo(new Date(comment.createdAt))}
                        </span>
                        {session?.user?.isAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteComment(comment._id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                  {index < comments.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
