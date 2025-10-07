'use client'

import React from 'react'
import { Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center px-4">
        {/* 404 */}
        <div className="mb-8">
          <span className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h1>

        <p className="text-lg text-white/70 mb-8">
          The page you're looking for doesn't exist.
        </p>

        {/* Home button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30"
        >
          <Home className="w-5 h-5" />
          <span>Go Home</span>
        </Link>

        {/* Contact info */}
        <p className="text-white/50 text-sm mt-8">
          Need help?{' '}
          <a 
            href="mailto:contact@zeptogpt.com" 
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
          >
            contact@zeptogpt.com
          </a>
        </p>
      </div>
    </div>
  )
}
