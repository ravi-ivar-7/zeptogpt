'use client'
import React from 'react'

interface InlineSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'dots' | 'pulse' | 'ring' | 'gradient'
  color?: 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'white'
  text?: string
  position?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
}

export default function InlineSpinner({ 
  size = 'sm', 
  variant = 'gradient',
  color = 'blue',
  text,
  position = 'left',
  className = '' 
}: InlineSpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  }

  const colorThemes = {
    blue: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      text: 'text-blue-300',
      glow: 'shadow-blue-500/25'
    },
    purple: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      gradient: 'from-purple-400 via-purple-500 to-purple-600',
      text: 'text-purple-300',
      glow: 'shadow-purple-500/25'
    },
    pink: {
      primary: '#ec4899',
      secondary: '#db2777',
      gradient: 'from-pink-400 via-pink-500 to-pink-600',
      text: 'text-pink-300',
      glow: 'shadow-pink-500/25'
    },
    green: {
      primary: '#10b981',
      secondary: '#059669',
      gradient: 'from-green-400 via-green-500 to-green-600',
      text: 'text-green-300',
      glow: 'shadow-green-500/25'
    },
    orange: {
      primary: '#f59e0b',
      secondary: '#d97706',
      gradient: 'from-orange-400 via-orange-500 to-orange-600',
      text: 'text-orange-300',
      glow: 'shadow-orange-500/25'
    },
    white: {
      primary: '#ffffff',
      secondary: '#f3f4f6',
      gradient: 'from-white via-gray-100 to-gray-200',
      text: 'text-white',
      glow: 'shadow-white/25'
    }
  }

  const theme = colorThemes[color]

  const renderSpinner = () => {
    const baseSize = sizeClasses[size]
    
    switch (variant) {
      case 'dots':
        return (
          <div className="flex items-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${baseSize} rounded-full bg-gradient-to-r ${theme.gradient} shadow-lg ${theme.glow}`}
                style={{
                  animation: `pulse 1.4s ease-in-out ${i * 0.16}s infinite both`
                }}
              />
            ))}
          </div>
        )
      
      case 'pulse':
        return (
          <div className="relative">
            <div 
              className={`${baseSize} rounded-full bg-gradient-to-r ${theme.gradient} shadow-lg ${theme.glow}`}
              style={{
                animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            />
            <div 
              className={`absolute inset-0 ${baseSize} rounded-full bg-gradient-to-r ${theme.gradient} opacity-75`}
              style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
          </div>
        )
      
      case 'ring':
        return (
          <div className="relative">
            <div 
              className={`${baseSize} rounded-full border-2 border-transparent bg-gradient-to-r ${theme.gradient} shadow-lg ${theme.glow}`}
              style={{
                background: `conic-gradient(from 90deg at 50% 50%, transparent 0deg, ${theme.primary} 360deg)`,
                animation: 'spin 1s linear infinite'
              }}
            />
            <div className={`absolute inset-0.5 rounded-full bg-gray-900`} />
          </div>
        )
      
      case 'gradient':
      default:
        return (
          <div className="relative">
            {/* Outer glow ring */}
            <div 
              className={`absolute -inset-1 rounded-full bg-gradient-to-r ${theme.gradient} opacity-30 blur-sm`}
              style={{
                animation: 'spin 2s linear infinite'
              }}
            />
            {/* Main spinner */}
            <div 
              className={`relative ${baseSize} rounded-full`}
              style={{
                background: `conic-gradient(from 0deg, transparent, transparent, ${theme.primary}, transparent)`,
                animation: 'spin 1s linear infinite'
              }}
            >
              <div className={`absolute inset-0.5 rounded-full bg-gray-900`} />
            </div>
            {/* Center dot */}
            <div className={`absolute inset-0 flex items-center justify-center`}>
              <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${theme.gradient}`} />
            </div>
          </div>
        )
    }
  }

  const spinner = renderSpinner()

  if (!text) {
    return <div className={`inline-flex ${className}`}>{spinner}</div>
  }

  const layoutClasses = {
    left: 'inline-flex items-center gap-3',
    right: 'inline-flex items-center gap-3 flex-row-reverse',
    top: 'flex flex-col items-center gap-2',
    bottom: 'flex flex-col items-center gap-2 flex-col-reverse'
  }

  return (
    <div className={`${layoutClasses[position]} ${className}`}>
      {spinner}
      <span className={`${theme.text} text-sm font-medium tracking-wide drop-shadow-sm`}>
        {text}
      </span>
    </div>
  )
}
