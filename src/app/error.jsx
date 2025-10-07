'use client'

import React, { useState } from 'react'
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Mail, Bug, X, Send, User, MessageSquare, Code, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/main/components/ui/button'

export default function ErrorBoundary({ error, reset }) {
  const [isReporting, setIsReporting] = useState(false)
  const [reportSent, setReportSent] = useState(false)

  const errorCode = error?.digest || `ERR_${Date.now().toString(36).toUpperCase()}`

  const handleQuickReport = async () => {
    setIsReporting(true)
    
    try {
      const submissionFormData = new FormData()
      submissionFormData.append('type', 'bug_report')
      submissionFormData.append('email', 'system@error.report')
      submissionFormData.append('name', 'System Error Report')
      submissionFormData.append('subject', `Automatic Error Report - ${errorCode}`)
      submissionFormData.append('message', `An error occurred in the application. Error details are included in metadata.`)
      submissionFormData.append('metadata', JSON.stringify({
        errorCode,
        errorMessage: error?.message,
        errorStack: error?.stack,
        url: typeof window !== 'undefined' ? window.location.href : '',
        browserInfo: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        timestamp: new Date().toISOString(),
        automatic: true
      }))

      const response = await fetch('/api/main/company/submissions', {
        method: 'POST',
        body: submissionFormData,
      })

      const data = await response.json()
      
      if (data.success) {
        setReportSent(true)
      }
    } catch (err) {
      console.error('Failed to send error report:', err)
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900/20 via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Oops! Something went wrong
          </h1>
          
          <p className="text-white/70 text-lg mb-2">
            We encountered an unexpected error while processing your request.
          </p>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400 font-mono text-sm">
              Error Code: <span className="font-bold">{errorCode}</span>
            </p>
            {error?.message && (
              <p className="text-red-300/80 text-sm mt-2">
                {error.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={reset}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </Button>
            
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </Button>
            </Link>
          </div>

          {/* Error Reporting Section */}
          <div className="bg-gradient-to-br from-orange-600/10 to-red-600/10 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
              <Bug className="w-5 h-5 text-orange-400" />
              <span>Help us fix this</span>
            </h3>
            
            {reportSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-green-400 font-semibold">Error report sent successfully!</p>
                <p className="text-white/60 text-sm mt-1">Thank you for helping us improve.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-white/80 text-sm">
                  Send us an automatic error report to help us fix this issue faster.
                </p>
                
                <Button
                  onClick={handleQuickReport}
                  disabled={isReporting}
                  className={`w-full font-bold py-3 rounded-xl transition-all duration-300 text-sm ${
                    isReporting 
                      ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-105 shadow-lg'
                  }`}
                >
                  {isReporting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Send Error Report</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
