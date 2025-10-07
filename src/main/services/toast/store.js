/**
 * Toast Store - Simple toast management without Zustand
 */

import { toastOperations, subscribe, getState } from './toastState'
import { useState, useEffect } from 'react'

// React hook for toast state
export const useToastStore = () => {
  const [state, setState] = useState(() => getState())

  useEffect(() => {
    const unsubscribe = subscribe((newState) => {
      setState(newState)
    })
    return unsubscribe
  }, [])

  return {
    toasts: state.toasts,
    addToast: toastOperations.addToast,
    removeToast: toastOperations.removeToast,
    pauseToast: toastOperations.pauseToast,
    resumeToast: toastOperations.resumeToast,
    updateToast: toastOperations.updateToast,
    updateToastProgress: toastOperations.updateToastProgress,
    updateToastStatus: toastOperations.updateToastStatus,
    updateMultipleToasts: toastOperations.updateMultipleToasts,
    clearToasts: toastOperations.clearToasts,
    getToastsByPosition: () => {
      const toasts = state.toasts
      const grouped = {}
      
      toasts.forEach(toast => {
        if (!grouped[toast.position]) {
          grouped[toast.position] = []
        }
        grouped[toast.position].push(toast)
      })

      return grouped
    }
  }
}

// Global toast functions for easy usage
export const toast = {
  success: (text, options = {}) => {
    return toastOperations.addToast({
      text,
      type: 'success',
      ...options
    })
  },

  error: (text, options = {}) => {
    return toastOperations.addToast({
      text,
      type: 'error',
      duration: 6000, // Longer duration for errors
      ...options
    })
  },

  warning: (text, options = {}) => {
    return toastOperations.addToast({
      text,
      type: 'warning',
      ...options
    })
  },

  info: (text, options = {}) => {
    return toastOperations.addToast({
      text,
      type: 'info',
      ...options
    })
  },

  // Live update functions
  update: (id, updates) => {
    return toastOperations.updateToast(id, updates)
  },

  updateProgress: (id, progress, text = null) => {
    return toastOperations.updateToastProgress(id, progress, text)
  },

  updateStatus: (id, status, text = null, type = null) => {
    return toastOperations.updateToastStatus(id, status, text, type)
  },

  // Convenience methods for common live update patterns
  loading: (text, options = {}) => {
    return toastOperations.addToast({
      text,
      type: 'info',
      status: 'loading',
      duration: 0, // Don't auto-dismiss
      showProgress: false,
      ...options
    })
  },

  progress: (text, initialProgress = 0, options = {}) => {
    return toastOperations.addToast({
      text,
      type: 'info',
      status: 'processing',
      progress: initialProgress,
      showProgress: true,
      duration: 0, // Don't auto-dismiss
      ...options
    })
  },

  custom: (options) => {
    return toastOperations.addToast(options)
  },

  dismiss: (id) => {
    toastOperations.removeToast(id)
  },

  clear: () => {
    toastOperations.clearToasts()
  }
}
