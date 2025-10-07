'use client'
import { useState } from 'react'
import { toast } from '../../main/lib/toast/store'

const ToastDemo = () => {
  const [activeToasts, setActiveToasts] = useState([])

  const demoFileUpload = async () => {
    const toastId = toast.progress('Uploading file...', 0, {
      subtext: 'document.pdf',
      duration: 0
    })
    
    setActiveToasts(prev => [...prev, toastId])

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 300))
        
        toast.updateProgress(toastId, progress, `Uploading file... ${progress}%`)
        
        if (progress === 50) {
          toast.update(toastId, { subtext: 'Processing file...' })
        }
      }

      // Success
      toast.updateStatus(toastId, 'completed', 'File uploaded successfully!', 'success')
      
    } catch (error) {
      toast.updateStatus(toastId, 'failed', 'Upload failed', 'error')
    }
  }

  const demoCanvasSave = async () => {
    const toastId = toast.loading('Saving canvas...', {
      subtext: 'My Awesome Canvas'
    })
    
    setActiveToasts(prev => [...prev, toastId])

    try {
      toast.updateStatus(toastId, 'processing', 'Validating canvas data...')
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.updateStatus(toastId, 'processing', 'Uploading to server...')
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.updateStatus(toastId, 'success', 'Canvas saved successfully!', 'success')
      
    } catch (error) {
      toast.updateStatus(toastId, 'error', 'Save failed', 'error')
    }
  }

  const demoMultiStep = async () => {
    const toastId = toast.loading('Starting operation...', {
      status: 'initializing'
    })
    
    setActiveToasts(prev => [...prev, toastId])

    const steps = [
      { name: 'Validating input', duration: 800 },
      { name: 'Connecting to server', duration: 1200 },
      { name: 'Processing request', duration: 1500 },
      { name: 'Finalizing', duration: 600 }
    ]

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        const progress = (i / steps.length) * 100
        
        toast.updateProgress(toastId, progress, step.name)
        toast.update(toastId, {
          status: 'processing',
          subtext: `Step ${i + 1} of ${steps.length}`
        })
        
        await new Promise(resolve => setTimeout(resolve, step.duration))
      }

      toast.updateStatus(toastId, 'completed', 'Operation completed!', 'success')
      
    } catch (error) {
      toast.updateStatus(toastId, 'failed', 'Operation failed', 'error')
    }
  }

  const demoRealTimeUpdates = async () => {
    const toastId = toast.info('Monitoring system status...', {
      duration: 0,
      status: 'monitoring'
    })
    
    setActiveToasts(prev => [...prev, toastId])

    const statuses = [
      { text: 'System online', type: 'success', status: 'healthy' },
      { text: 'High CPU usage detected', type: 'warning', status: 'warning' },
      { text: 'Memory usage normal', type: 'info', status: 'monitoring' },
      { text: 'All systems optimal', type: 'success', status: 'healthy' }
    ]

    for (let i = 0; i < statuses.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const status = statuses[i]
      
      toast.update(toastId, {
        text: status.text,
        type: status.type,
        status: status.status,
        subtext: `Update ${i + 1} of ${statuses.length}`
      })
    }

    // Final update
    setTimeout(() => {
      toast.updateStatus(toastId, 'completed', 'Monitoring session ended', 'info')
    }, 2000)
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Live Toast Demos</h2>
      
      <div className="space-y-3">
        <button
          onClick={demoFileUpload}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Demo File Upload Progress
        </button>
        
        <button
          onClick={demoCanvasSave}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Demo Canvas Save
        </button>
        
        <button
          onClick={demoMultiStep}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Demo Multi-Step Process
        </button>
        
        <button
          onClick={demoRealTimeUpdates}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Demo Real-Time Updates
        </button>
        
        <div className="pt-4 border-t">
          <button
            onClick={() => {
              toast.success('Static success message')
              toast.error('Static error message')
              toast.warning('Static warning message')
              toast.info('Static info message')
            }}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Show Static Toasts
          </button>
        </div>
      </div>
      
      {activeToasts.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            Active live toasts: {activeToasts.length}
          </p>
        </div>
      )}
    </div>
  )
}

export default ToastDemo
