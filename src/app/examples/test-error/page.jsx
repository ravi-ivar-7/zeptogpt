'use client'

import { useState } from 'react'
import { Button } from '@/main/components/ui/button'

export default function TestError() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    // This will trigger the error boundary
    throw new Error('Test error for error boundary - This is a simulated error to test the automatic reporting system')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Test Error Boundary</h1>
        <p className="text-white/70 mb-6">
          Click the button below to trigger an error and test the error boundary reporting system.
        </p>
        
        <Button
          onClick={() => setShouldError(true)}
          className="bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all duration-300"
        >
          Trigger Test Error
        </Button>
        
        <p className="text-white/50 text-sm mt-4">
          This will show the error boundary page with automatic reporting.
        </p>
      </div>
    </div>
  )
}
