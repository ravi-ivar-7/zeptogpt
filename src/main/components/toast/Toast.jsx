'use client'
import { useEffect, useRef, useState } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info, Bell, Loader2 } from 'lucide-react'
import { useToastStore } from '@/main/services/toast/store'

const Toast = ({ toast }) => {
  const { removeToast, pauseToast, resumeToast } = useToastStore()
  const [progress, setProgress] = useState(100)
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(Date.now())
  const pausedTimeRef = useRef(0)

  // Toast type configurations
  const toastConfig = {
    success: {
      bgColor: 'bg-gradient-to-r from-emerald-500 to-green-600',
      textColor: 'text-white',
      icon: CheckCircle,
      progressColor: 'bg-white/30'
    },
    error: {
      bgColor: 'bg-gradient-to-r from-red-500 to-rose-600',
      textColor: 'text-white',
      icon: XCircle,
      progressColor: 'bg-white/30'
    },
    warning: {
      bgColor: 'bg-gradient-to-r from-amber-500 to-orange-600',
      textColor: 'text-white',
      icon: AlertTriangle,
      progressColor: 'bg-white/30'
    },
    info: {
      bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      textColor: 'text-white',
      icon: Info,
      progressColor: 'bg-white/30'
    },
    loading: {
      bgColor: 'bg-gradient-to-r from-gray-600 to-gray-700',
      textColor: 'text-white',
      icon: Loader2,
      progressColor: 'bg-white/30',
      animated: true
    },
    processing: {
      bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      textColor: 'text-white',
      icon: Loader2,
      progressColor: 'bg-white/30',
      animated: true
    }
  }

  const config = toastConfig[toast.type] || toastConfig.info
  const IconComponent = toast.icon || config.icon

  // Animation entrance effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Progress bar and auto-dismiss logic
  useEffect(() => {
    if (toast.duration <= 0) return // Persistent toast

    const updateProgress = () => {
      if (toast.isPaused) return

      const now = Date.now()
      const elapsed = now - startTimeRef.current - pausedTimeRef.current
      const remaining = Math.max(0, toast.duration - elapsed)
      const progressPercent = (remaining / toast.duration) * 100

      setProgress(progressPercent)

      if (remaining <= 0) {
        handleDismiss()
      }
    }

    intervalRef.current = setInterval(updateProgress, 16) // ~60fps
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [toast.duration, toast.isPaused, toast.id])

  // Handle pause/resume
  const handleMouseEnter = () => {
    if (toast.pauseOnHover && !toast.isPaused) {
      pausedTimeRef.current += Date.now() - startTimeRef.current
      pauseToast(toast.id)
    }
  }

  const handleMouseLeave = () => {
    if (toast.pauseOnHover && toast.isPaused) {
      startTimeRef.current = Date.now()
      resumeToast(toast.id)
    }
  }

  const handleClick = () => {
    if (toast.pauseOnClick) {
      if (toast.isPaused) {
        startTimeRef.current = Date.now()
        resumeToast(toast.id)
      } else {
        pausedTimeRef.current += Date.now() - startTimeRef.current
        pauseToast(toast.id)
      }
    }
  }

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      removeToast(toast.id)
    }, 300) // Match exit animation duration
  }

  // Position-based animation classes
  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-out'
    
    if (isExiting) {
      if (toast.position.includes('right')) {
        return `${baseClasses} transform translate-x-full opacity-0`
      } else if (toast.position.includes('left')) {
        return `${baseClasses} transform -translate-x-full opacity-0`
      } else {
        return `${baseClasses} transform scale-95 opacity-0`
      }
    }

    if (!isVisible) {
      if (toast.position.includes('right')) {
        return `${baseClasses} transform translate-x-full opacity-0`
      } else if (toast.position.includes('left')) {
        return `${baseClasses} transform -translate-x-full opacity-0`
      } else {
        return `${baseClasses} transform scale-95 opacity-0`
      }
    }

    return `${baseClasses} transform translate-x-0 scale-100 opacity-100`
  }

  return (
    <div
      className={`
        relative max-w-sm w-full rounded-xl shadow-lg overflow-hidden cursor-pointer
        ${toast.color || config.bgColor}
        ${config.textColor}
        ${getAnimationClasses()}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="alert"
      aria-live="polite"
    >
      {/* Main content */}
      <div className="p-4 pr-12">
        <div className="flex items-start gap-3">
          {/* Icon */}
          {IconComponent && (
            <div className="flex-shrink-0 mt-0.5">
              <IconComponent 
                className={`h-5 w-5 ${
                  config.animated && (toast.status === 'loading' || toast.status === 'processing') 
                    ? 'animate-spin' 
                    : ''
                }`} 
              />
            </div>
          )}

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm leading-5">
                {toast.text}
              </p>
              {/* Status indicator */}
              {toast.status && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-medium">
                  {toast.status}
                </span>
              )}
              {/* Progress percentage */}
              {toast.progress !== undefined && toast.showProgress && (
                <span className="text-xs font-mono opacity-75">
                  {Math.round(toast.progress)}%
                </span>
              )}
            </div>
            {toast.subtext && (
              <p className="mt-1 text-xs opacity-90 leading-4">
                {toast.subtext}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Close button */}
      {toast.closable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDismiss()
          }}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Progress bar */}
      {toast.showProgress && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className={`h-full transition-all duration-75 ease-linear ${config.progressColor}`}
            style={{ 
              width: `${toast.progress !== undefined ? toast.progress : progress}%`,
              backgroundColor: toast.progress !== undefined ? (config.progressColor.includes('bg-') ? undefined : config.progressColor) : undefined
            }}
          />
        </div>
      )}

      {/* Pause indicator */}
      {toast.isPaused && (
        <div className="absolute top-2 left-2 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
      )}
    </div>
  )
}

export default Toast
