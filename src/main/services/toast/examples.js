/**
 * Live-Updating Toast Examples
 * 
 * This file demonstrates how to use the enhanced toast system
 * with live updates, progress tracking, and status changes.
 */

import { toast } from './store'

// Example 1: File Upload with Progress
export const fileUploadExample = async (file) => {
  // Start with a loading toast
  const toastId = toast.progress('Uploading file...', 0, {
    subtext: file.name,
    duration: 0 // Don't auto-dismiss
  })

  try {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Update progress and text
      toast.updateProgress(toastId, progress, `Uploading file... ${progress}%`)
      
      if (progress === 50) {
        toast.update(toastId, { subtext: 'Processing file...' })
      }
    }

    // Success - update to success state
    toast.updateStatus(toastId, 'completed', 'File uploaded successfully!', 'success')
    
  } catch (error) {
    // Error - update to error state
    toast.updateStatus(toastId, 'failed', 'Upload failed', 'error')
  }
}

// Example 2: Canvas Save Operation
export const canvasSaveExample = async (canvasData) => {
  const toastId = toast.loading('Saving canvas...', {
    subtext: canvasData.name
  })

  try {
    // Update status to processing
    toast.updateStatus(toastId, 'processing', 'Validating canvas data...')
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update with different status
    toast.updateStatus(toastId, 'processing', 'Uploading to server...')
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Final success
    toast.updateStatus(toastId, 'success', 'Canvas saved successfully!', 'success')
    
  } catch (error) {
    toast.updateStatus(toastId, 'error', `Save failed: ${error.message}`, 'error')
  }
}

// Example 3: Real-time Data Processing
export const dataProcessingExample = async (items) => {
  const toastId = toast.progress('Processing data...', 0, {
    subtext: `0 of ${items.length} items processed`
  })

  try {
    for (let i = 0; i < items.length; i++) {
      // Process item
      await processItem(items[i])
      
      const progress = ((i + 1) / items.length) * 100
      const processed = i + 1
      
      // Update progress and text
      toast.updateProgress(
        toastId, 
        progress, 
        `Processing data... ${Math.round(progress)}%`
      )
      
      toast.update(toastId, {
        subtext: `${processed} of ${items.length} items processed`
      })
    }

    // Complete
    toast.updateStatus(toastId, 'completed', 'Data processing complete!', 'success')
    
  } catch (error) {
    toast.updateStatus(toastId, 'failed', 'Processing failed', 'error')
  }
}

// Example 4: Multi-step Operation
export const multiStepExample = async () => {
  const toastId = toast.loading('Starting operation...', {
    status: 'initializing'
  })

  const steps = [
    { name: 'Validating input', duration: 1000 },
    { name: 'Connecting to server', duration: 1500 },
    { name: 'Processing request', duration: 2000 },
    { name: 'Finalizing', duration: 800 }
  ]

  try {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      const progress = (i / steps.length) * 100
      
      // Update current step
      toast.updateProgress(toastId, progress, step.name)
      toast.update(toastId, {
        status: 'processing',
        subtext: `Step ${i + 1} of ${steps.length}`
      })
      
      // Simulate step duration
      await new Promise(resolve => setTimeout(resolve, step.duration))
    }

    // Complete all steps
    toast.updateStatus(toastId, 'completed', 'Operation completed successfully!', 'success')
    
  } catch (error) {
    toast.updateStatus(toastId, 'failed', 'Operation failed', 'error')
  }
}

// Example 5: Batch Update Multiple Toasts
export const batchUpdateExample = () => {
  // Create multiple toasts
  const toast1 = toast.loading('Task 1 starting...')
  const toast2 = toast.loading('Task 2 starting...')
  const toast3 = toast.loading('Task 3 starting...')

  // Batch update all at once
  setTimeout(() => {
    toast.updateMultipleToasts([
      {
        id: toast1,
        updates: { text: 'Task 1 in progress...', status: 'processing' }
      },
      {
        id: toast2,
        updates: { text: 'Task 2 in progress...', status: 'processing' }
      },
      {
        id: toast3,
        updates: { text: 'Task 3 in progress...', status: 'processing' }
      }
    ])
  }, 1000)

  // Complete them one by one
  setTimeout(() => {
    toast.updateStatus(toast1, 'completed', 'Task 1 completed!', 'success')
  }, 3000)

  setTimeout(() => {
    toast.updateStatus(toast2, 'completed', 'Task 2 completed!', 'success')
  }, 4000)

  setTimeout(() => {
    toast.updateStatus(toast3, 'completed', 'Task 3 completed!', 'success')
  }, 5000)
}

// Helper function for demo
const processItem = (item) => {
  return new Promise(resolve => setTimeout(resolve, 100))
}

// Usage in React components:
/*
import { fileUploadExample, canvasSaveExample } from '@/lib/toast/examples'

// In your component
const handleFileUpload = (file) => {
  fileUploadExample(file)
}

const handleCanvasSave = (canvasData) => {
  canvasSaveExample(canvasData)
}
*/
