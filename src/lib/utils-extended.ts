// Utility functions for the Confessly app

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)

  if (diffInMinutes < 1) {
    return 'just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`
  } else if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`
  } else {
    return date.toLocaleDateString()
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function validateConfession(title: string, body: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!title.trim()) {
    errors.push('Title is required')
  } else if (title.length > 200) {
    errors.push('Title must be less than 200 characters')
  }

  if (!body.trim()) {
    errors.push('Body is required')
  } else if (body.length > 2000) {
    errors.push('Body must be less than 2000 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateComment(content: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!content.trim()) {
    errors.push('Comment is required')
  } else if (content.length > 500) {
    errors.push('Comment must be less than 500 characters')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip')
  return ip || 'unknown'
}
