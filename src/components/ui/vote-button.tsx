import { cn } from '@/lib/utils'

export function VoteButton({
  type,
  count,
  isActive,
  onClick,
  disabled,
}: {
  type: 'upvote' | 'downvote'
  count: number
  isActive: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        isActive && type === 'upvote' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        isActive && type === 'downvote' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
        !isActive && 'text-gray-600 dark:text-gray-400',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {type === 'upvote' ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
      <span>{count}</span>
    </button>
  )
}
