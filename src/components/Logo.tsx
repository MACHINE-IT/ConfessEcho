import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer circle representing echo/sound waves */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="text-blue-500"
          opacity="0.3"
        />
        
        {/* Middle circle */}
        <circle
          cx="50"
          cy="50"
          r="35"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-blue-500"
          opacity="0.5"
        />
        
        {/* Inner circle */}
        <circle
          cx="50"
          cy="50"
          r="25"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-blue-500"
          opacity="0.7"
        />
        
        {/* Heart shape in center representing confessions/emotions */}
        <path
          d="M50 30c-5-10-20-10-20 2 0 8 12 15 20 25 8-10 20-17 20-25 0-12-15-12-20-2z"
          fill="currentColor"
          className="text-red-500"
        />
        
        {/* Sound waves on the right */}
        <path
          d="M70 40 Q75 45 75 50 Q75 55 70 60"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-blue-600"
          opacity="0.8"
        />
        
        <path
          d="M75 35 Q82 42 82 50 Q82 58 75 65"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-blue-600"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}

export function LogoText({ className = '' }: { className?: string }) {
  return (
    <span className={`font-bold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent ${className}`}>
      ConfessEcho
    </span>
  )
}
