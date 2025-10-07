/**
 * Toast State Manager - Simple state management without Zustand
 */

let toastId = 0
const generateToastId = () => ++toastId

// Global toast state
let toastState = {
  toasts: []
}

// State change listeners
let listeners = new Set()

// Subscribe to state changes
export const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Notify all listeners of state changes
const notifyListeners = () => {
  listeners.forEach(listener => listener(toastState))
}

// Get current state
export const getState = () => ({ ...toastState })

// Update state
export const setState = (updates) => {
  if (typeof updates === 'function') {
    toastState = { ...toastState, ...updates(toastState) }
  } else {
    toastState = { ...toastState, ...updates }
  }
  notifyListeners()
}

// Toast operations
export const toastOperations = {
  addToast: (toast) => {
    const id = generateToastId()
    const newToast = {
      id,
      text: toast.text || 'Notification',
      subtext: toast.subtext || null,
      type: toast.type || 'info', // success, error, warning, info
      position: toast.position || 'top-right',
      duration: toast.duration || 4000,
      icon: toast.icon || null,
      color: toast.color || null,
      closable: toast.closable !== false,
      pauseOnHover: toast.pauseOnHover !== false,
      pauseOnClick: toast.pauseOnClick !== false,
      showProgress: toast.showProgress !== false,
      createdAt: Date.now(),
      isPaused: false,
      timeRemaining: toast.duration || 4000,
      ...toast
    }

    setState(state => ({
      toasts: [...state.toasts, newToast]
    }))

    return id
  },

  removeToast: (id) => {
    setState(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }))
  },

  pauseToast: (id) => {
    setState(state => ({
      toasts: state.toasts.map(toast =>
        toast.id === id ? { ...toast, isPaused: true } : toast
      )
    }))
  },

  resumeToast: (id) => {
    setState(state => ({
      toasts: state.toasts.map(toast =>
        toast.id === id ? { ...toast, isPaused: false } : toast
      )
    }))
  },

  updateToast: (id, updates) => {
    setState(state => ({
      toasts: state.toasts.map(toast => {
        if (toast.id === id) {
          const updatedToast = { ...toast, ...updates }
          
          // If updating with new duration, reset timing
          if (updates.duration && updates.duration !== toast.duration) {
            updatedToast.timeRemaining = updates.duration
            updatedToast.createdAt = Date.now()
          }
          
          // If updating text/type, keep toast visible longer
          if ((updates.text && updates.text !== toast.text) || 
              (updates.type && updates.type !== toast.type)) {
            updatedToast.createdAt = Date.now()
            updatedToast.timeRemaining = updatedToast.duration
          }
          
          return updatedToast
        }
        return toast
      })
    }))
  },

  // Live update with progress tracking
  updateToastProgress: (id, progress, text = null) => {
    const updates = {
      progress: Math.max(0, Math.min(100, progress)),
      showProgress: true
    }
    
    if (text) {
      updates.text = text
      updates.createdAt = Date.now() // Reset timer for new content
    }
    
    toastOperations.updateToast(id, updates)
  },

  // Update toast status (useful for async operations)
  updateToastStatus: (id, status, text = null, type = null) => {
    const updates = { status }
    
    if (text) updates.text = text
    if (type) updates.type = type
    
    // For completed statuses, auto-dismiss after showing result
    if (status === 'completed' || status === 'success') {
      updates.duration = 3000
      updates.createdAt = Date.now()
    } else if (status === 'error' || status === 'failed') {
      updates.duration = 5000
      updates.createdAt = Date.now()
      updates.type = 'error'
    } else if (status === 'loading' || status === 'processing') {
      updates.duration = 0 // Don't auto-dismiss while processing
    }
    
    toastOperations.updateToast(id, updates)
  },

  // Batch update multiple toasts
  updateMultipleToasts: (updates) => {
    setState(state => ({
      toasts: state.toasts.map(toast => {
        const update = updates.find(u => u.id === toast.id)
        return update ? { ...toast, ...update.updates } : toast
      })
    }))
  },

  clearToasts: () => {
    setState({ toasts: [] })
  },

  getToasts: () => {
    return toastState.toasts
  }
}
