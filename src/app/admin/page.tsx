'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ConfessionCard } from '@/components/ConfessionCard'
import { 
  Loader2, 
  Shield, 
  Trash2, 
  Star, 
  StarOff, 
  Users,
  MessageSquare,
  TrendingUp,
  AlertCircle 
} from 'lucide-react'
import { IConfession, IComment, IUser } from '@/types'
import { toast } from 'sonner'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [confessions, setConfessions] = useState<IConfession[]>([])
  const [comments, setComments] = useState<IComment[]>([])
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalConfessions: 0,
    totalComments: 0,
    totalUsers: 0,
    featuredConfessions: 0,
  })

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || !session.user?.isAdmin) {
      router.push('/')
      return
    }
    
    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch confessions
      const confResponse = await fetch('/api/confess?limit=50&sort=recent')
      const confData = await confResponse.json()
      
      if (confData.success) {
        setConfessions(confData.data.confessions)
        setStats(prev => ({
          ...prev,
          totalConfessions: confData.data.pagination.total,
          featuredConfessions: confData.data.confessions.filter((c: IConfession) => c.isFeatured).length,
        }))
      }

      // Note: In a real app, you'd have separate API endpoints for admin data
      // For now, we'll use placeholder data for comments and users stats
      setStats(prev => ({
        ...prev,
        totalComments: 0, // Would fetch from /api/admin/comments
        totalUsers: 0,    // Would fetch from /api/admin/users
      }))
      
    } catch (error) {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfession = async (confessionId: string) => {
    if (!confirm('Are you sure you want to delete this confession? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/confess/${confessionId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setConfessions(prev => prev.filter(c => c._id !== confessionId))
        toast.success('Confession deleted successfully')
      } else {
        toast.error(data.error || 'Failed to delete confession')
      }
    } catch (error) {
      toast.error('Failed to delete confession')
    }
  }

  const handleFeatureConfession = async (confessionId: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/confess/${confessionId}/feature`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured }),
      })

      const data = await response.json()

      if (data.success) {
        setConfessions(prev => prev.map(c => 
          c._id === confessionId 
            ? { ...c, isFeatured } as IConfession
            : c
        ))
        toast.success(data.message)
      } else {
        toast.error(data.error || 'Failed to update confession')
      }
    } catch (error) {
      toast.error('Failed to update confession')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-300">
          You don&apos;t have permission to access this page.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage confessions, comments, and users
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Confessions</p>
                <p className="text-2xl font-bold">{stats.totalConfessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Featured</p>
                <p className="text-2xl font-bold">{stats.featuredConfessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Comments</p>
                <p className="text-2xl font-bold">{stats.totalComments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="confessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="confessions">Confessions</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        {/* Confessions Tab */}
        <TabsContent value="confessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Confessions</CardTitle>
            </CardHeader>
            <CardContent>
              {confessions.length === 0 ? (
                <p className="text-center text-gray-500 py-6">No confessions found</p>
              ) : (
                <div className="space-y-4">
                  {confessions.map((confession) => (
                    <div key={confession._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{confession.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{confession.tag}</Badge>
                            {confession.isFeatured && (
                              <Badge variant="default" className="gap-1">
                                <Star className="w-3 h-3" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                            {confession.body.substring(0, 200)}...
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant={confession.isFeatured ? "default" : "outline"}
                            onClick={() => handleFeatureConfession(confession._id, !confession.isFeatured)}
                            className="gap-1"
                          >
                            {confession.isFeatured ? (
                              <>
                                <StarOff className="w-3 h-3" />
                                Unfeature
                              </>
                            ) : (
                              <>
                                <Star className="w-3 h-3" />
                                Feature
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteConfession(confession._id)}
                            className="gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👍 {confession.upvotes}</span>
                        <span>👎 {confession.downvotes}</span>
                        <span>💬 {confession.comments?.length || 0}</span>
                        <span>{new Date(confession.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-6">
                Comment management would be implemented here. 
                You can view and delete inappropriate comments.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-6">
                User management would be implemented here.
                You can view user statistics and manage admin roles.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
