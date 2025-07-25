'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ConfessionTag } from '@/types'
import { toast } from 'sonner'

const confessionTags: ConfessionTag[] = [
  'Love', 'Career', 'School', 'Family', 'Friendship', 'Health', 'Money', 'Personal', 'Other'
]

export default function ConfessPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    tag: 'Other' as ConfessionTag,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.body.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.title.length > 200) {
      toast.error('Title must be less than 200 characters')
      return
    }

    if (formData.body.length > 2000) {
      toast.error('Body must be less than 2000 characters')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/confess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Confession shared successfully!')
        router.push(`/confession/${data.data._id}`)
      } else {
        toast.error(data.error || 'Failed to submit confession')
      }
    } catch (error) {
      toast.error('Failed to submit confession')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Share Your Confession
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your story is anonymous and safe here
          </p>
        </div>
      </div>

      {/* Confession Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tell Your Story</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Give your confession a title..."
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-gray-500">
                {formData.title.length}/200 characters
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={formData.tag} 
                onValueChange={(value) => handleInputChange('tag', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {confessionTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Body */}
            <div className="space-y-2">
              <Label htmlFor="body">
                Your Confession <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="body"
                placeholder="Share your thoughts, feelings, or experiences. This is a safe space to express yourself anonymously..."
                value={formData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                rows={8}
                maxLength={2000}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                {formData.body.length}/2000 characters
              </p>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                Privacy & Safety
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Your confession is completely anonymous</li>
                <li>• No personal information is collected or stored</li>
                <li>• Only your IP address is logged for moderation purposes</li>
                <li>• Be respectful and follow community guidelines</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.body.trim()}
                className="flex-1 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Share Confession
                  </>
                )}
              </Button>
              <Link href="/">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips for Sharing</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>• Be honest and authentic in your expression</li>
            <li>• Choose a descriptive title that captures the essence</li>
            <li>• Select the most appropriate category for better discovery</li>
            <li>• Remember that others may have similar experiences</li>
            <li>• Consider how your story might help others feel less alone</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
