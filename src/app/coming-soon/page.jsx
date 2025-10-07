'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ComingSoon() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('type', 'email_subscription')
      formData.append('email', email)
      formData.append('message', 'User subscribed to email notifications for launch updates')

      const response = await fetch('/api/main/company/submissions', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (data.success) {
        setIsSubmitted(true)
        setEmail('')
      }
    } catch (error) {
      console.error('Error submitting email:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/95 via-purple-900/10 to-black/95 relative overflow-hidden flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="text-center">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Coming
            <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Soon
            </span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto">
            We're working on something amazing. Get notified when we launch.
          </p>

          {/* Email Form */}
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl md:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-500/20">
              {isSubmitted ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Thank You!</h3>
                  <p className="text-green-400 text-sm sm:text-base">We'll notify you when we're ready to launch.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-white/5 border border-white/20 placeholder-white/50 text-white rounded-xl md:rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-xl md:rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg shadow-purple-500/30"
                  >
                    {isLoading ? 'Submitting...' : 'Notify Me'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-8 sm:mt-12">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-white/60 hover:text-white/80 transition-colors group text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
