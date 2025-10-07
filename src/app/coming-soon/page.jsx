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
      formData.append('message', 'User subscribed to email notifications for launch updates of zeptogpt')

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
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Enhanced Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main content */}
        <div className="text-center animate-fade-in-up">
          {/* Logo/Brand */}
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl shadow-purple-500/50 mb-4 animate-float">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl animate-fade-in">
              Coming Soon
            </span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-3 sm:mb-4 leading-relaxed max-w-2xl mx-auto font-light animate-fade-in delay-300">
            World's fastest AI workflow marketplace
          </p>
          
          <p className="text-sm sm:text-base lg:text-lg text-white/60 mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto animate-fade-in delay-300">
            Get notified when <span className="text-purple-400 font-semibold">ZepToGPT</span> launches
          </p>

          {/* Email Form - Priority Position */}
          <div className="max-w-lg mx-auto mb-8 sm:mb-12 animate-fade-in delay-300">
            <div className="relative bg-gradient-to-br from-purple-900/40 via-black/60 to-black/60 backdrop-blur-2xl border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-500">
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-purple-600/30 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-blue-600/30 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                {isSubmitted ? (
                  <div className="text-center animate-fade-in py-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-green-500/50 animate-float">
                      <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Thank You!</h3>
                    <p className="text-green-400 text-sm sm:text-base font-semibold mb-1">You're on the list! 🎉</p>
                    <p className="text-white/60 text-xs sm:text-sm">We'll notify you when ZepToGPT launches.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400 group-focus-within:text-purple-300 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full bg-white/5 border-2 border-white/20 placeholder-white/40 text-white rounded-2xl pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/70 transition-all hover:bg-white/10 hover:border-white/30"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group w-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-2xl hover:scale-105 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 hover:-translate-y-1"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          Notify Me When We Launch
                          <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 max-w-4xl mx-auto animate-fade-in delay-300">
            <div className="group p-6 bg-gradient-to-br from-purple-900/30 via-black/40 to-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/30">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Execution</h3>
              <p className="text-sm text-white/60">Execute workflows in &lt;2 seconds</p>
            </div>
            <div className="group p-6 bg-gradient-to-br from-blue-900/30 via-black/40 to-black/40 backdrop-blur-xl border border-blue-500/30 rounded-2xl hover:border-blue-400/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/30">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-lg font-bold text-white mb-2">Premium Workflows</h3>
              <p className="text-sm text-white/60">10,000+ curated workflows</p>
            </div>
            <div className="group p-6 bg-gradient-to-br from-green-900/30 via-black/40 to-black/40 backdrop-blur-xl border border-green-500/30 rounded-2xl hover:border-green-400/60 transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/30">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-white mb-2">Earn Money</h3>
              <p className="text-sm text-white/60">Sell your best workflows</p>
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
