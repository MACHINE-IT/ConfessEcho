'use client'

import { useState, useEffect } from 'react'
import { ConfessionCard } from '@/components/ConfessionCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, Loader2, ArrowLeft, Flame } from 'lucide-react'
import Link from 'next/link'
import { IConfession } from '@/types'
import { toast } from 'sonner'

export default function TrendingPage() {
  const [trendingConfessions, setTrendingConfessions] = useState<IConfession[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('7')

  useEffect(() => {
    fetchTrendingConfessions()
  }, [timeframe])

  const fetchTrendingConfessions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/trending?days=${timeframe}&limit=20`)
      const data = await response.json()

      if (data.success) {
        setTrendingConfessions(data.data.confessions)
      } else {
        toast.error(data.error || 'Failed to load trending confessions')
      }
    } catch (error) {
      toast.error('Failed to load trending confessions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </Button>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trending Confessions
            </h1>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Discover the most engaging confessions based on votes and community interaction. 
          These stories have resonated with many people and sparked meaningful conversations.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Time Period</span>
            </div>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 24 hours</SelectItem>
                <SelectItem value="3">Last 3 days</SelectItem>
                <SelectItem value="7">Last week</SelectItem>
                <SelectItem value="30">Last month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trending Confessions */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : trendingConfessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No trending confessions
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No confessions are trending for the selected time period.
                Try a different timeframe or check back later.
              </p>
              <Link href="/confess">
                <Button>Share a Confession</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>
                Showing {trendingConfessions.length} trending confessions from the{' '}
                {timeframe === '1' && 'last 24 hours'}
                {timeframe === '3' && 'last 3 days'}
                {timeframe === '7' && 'last week'}
                {timeframe === '30' && 'last month'}
              </span>
            </div>
            
            {trendingConfessions.map((confession, index) => (
              <div key={confession._id} className="relative">
                {/* Trending Rank */}
                <div className="absolute -left-4 top-4 z-10">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                    ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-500'}
                  `}>
                    {index + 1}
                  </div>
                </div>
                
                <div className="ml-6">
                  <ConfessionCard confession={confession} showPreview={true} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Info Section */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-200">
            <TrendingUp className="w-5 h-5" />
            How Trending Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-orange-800 dark:text-orange-200">
          <p>• Confessions are ranked by a combination of votes and engagement</p>
          <p>• Newer confessions get a boost to promote fresh content</p>
          <p>• Comments and community interaction also influence ranking</p>
          <p>• The algorithm balances popularity with recency for fairness</p>
        </CardContent>
      </Card>
    </div>
  )
}
