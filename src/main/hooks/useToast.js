import { toast } from '../services/toast/store'

// Custom hook for easier toast usage with additional utilities
export const useToast = () => {
  return {
    // Basic toast methods
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
    custom: toast.custom,
    dismiss: toast.dismiss,
    clear: toast.clear,

    // Convenience methods with common patterns
    loading: (text, options = {}) => {
      return toast.custom({
        text,
        type: 'info',
        duration: 0, // Persistent until dismissed
        icon: null,
        subtext: 'Please wait...',
        closable: false,
        showProgress: false,
        ...options
      })
    },

    promise: async (promise, options = {}) => {
      const {
        loading: loadingText = 'Loading...',
        success: successText = 'Success!',
        error: errorText = 'Something went wrong'
      } = options

      // Show loading toast
      const loadingId = toast.custom({
        text: loadingText,
        type: 'info',
        duration: 0,
        closable: false,
        showProgress: false,
        ...options.loading
      })

      try {
        const result = await promise
        
        // Dismiss loading and show success
        toast.dismiss(loadingId)
        toast.success(
          typeof successText === 'function' ? successText(result) : successText,
          options.success
        )
        
        return result
      } catch (error) {
        // Dismiss loading and show error
        toast.dismiss(loadingId)
        toast.error(
          typeof errorText === 'function' ? errorText(error) : errorText,
          options.error
        )
        
        throw error
      }
    },

    // Position-specific shortcuts
    topLeft: (text, options = {}) => toast.info(text, { position: 'top-left', ...options }),
    topRight: (text, options = {}) => toast.info(text, { position: 'top-right', ...options }),
    topCenter: (text, options = {}) => toast.info(text, { position: 'top-center', ...options }),
    bottomLeft: (text, options = {}) => toast.info(text, { position: 'bottom-left', ...options }),
    bottomRight: (text, options = {}) => toast.info(text, { position: 'bottom-right', ...options }),
    bottomCenter: (text, options = {}) => toast.info(text, { position: 'bottom-center', ...options }),

    // Duration shortcuts
    quick: (text, options = {}) => toast.info(text, { duration: 2000, ...options }),
    long: (text, options = {}) => toast.info(text, { duration: 8000, ...options }),
    persistent: (text, options = {}) => toast.info(text, { duration: 0, ...options })
  }
}
