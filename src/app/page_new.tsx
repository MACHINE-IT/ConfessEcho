'use client'

import { useState, useEffect } from 'react'
import { ConfessionCard } from '@/components/ConfessionCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { IConfession, ConfessionTag } from '@/types'
import { toast } from 'sonner'

const confessionTags: ConfessionTag[] = [
  'Love', 'Career', 'School', 'Family', 'Friendship', 'Health', 'Money', 'Personal', 'Other'
]

export default function HomePage() {
  const [confessions, setConfessions] = useState<IConfession[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedSort, setSelectedSort] = useState<'recent' | 'trending' | 'votes'>('recent')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  const fetchConfessions = async (
    page: number = 1, 
    sort: string = 'recent', 
    tag: string = 'all'
  ) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sort,
        ...(tag !== 'all' && { tag }),
      })

      const response = await fetch(`/api/confess?${params}`)
      const data = await response.json()

      if (data.success) {
        setConfessions(data.data.confessions)
        setTotalPages(data.data.pagination.pages)
        setCurrentPage(data.data.pagination.current)
      } else {
        toast.error(data.error || 'Failed to load confessions')
      }
    } catch (error) {
      toast.error('Failed to load confessions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfessions(1, selectedSort, selectedTag)
  }, [selectedSort, selectedTag])

  const handleSortChange = (value: string) => {
    setSelectedSort(value as 'recent' | 'trending' | 'votes')
  }

  const handleTagChange = (value: string) => {
    setSelectedTag(value)
  }

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchConfessions(currentPage + 1, selectedSort, selectedTag)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Anonymous Confessions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Share your thoughts, feelings, and experiences anonymously. 
          Get support and advice from our caring community.
        </p>
        <Link href="/confess">
          <Button size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            Share Your Confession
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={selectedTag === 'all' ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => handleTagChange('all')}
          >
            All
          </Badge>
          {confessionTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleTagChange(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <Select value={selectedSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="votes">Most Voted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Confessions Feed */}
      <div className="space-y-6">
        {loading && confessions.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : confessions.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No confessions found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {selectedTag !== 'all' 
                ? `No confessions found with the tag "${selectedTag}"`
                : 'Be the first to share a confession!'
              }
            </p>
            <Link href="/confess">
              <Button>Share Your Story</Button>
            </Link>
          </div>
        ) : (
          <>
            {confessions.map((confession) => (
              <ConfessionCard 
                key={confession._id} 
                confession={confession} 
                showPreview={true} 
              />
            ))}

            {/* Load More */}
            {currentPage < totalPages && (
              <div className="flex justify-center pt-6">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
