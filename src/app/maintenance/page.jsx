'use client'

import Link from 'next/link'
import { ArrowLeft, Wrench } from 'lucide-react'

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black/95 via-purple-900/10 to-black/95 relative overflow-hidden flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-red-500/20 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-b from-black/95 via-orange-900/20 to-black/95 backdrop-blur-2xl border border-orange-500/30 rounded-full px-4 py-2 mb-6 sm:mb-8 shadow-lg shadow-orange-500/20">
            <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            <span className="text-white font-medium text-sm sm:text-base">Maintenance Mode</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Under
            <span className="block bg-gradient-to-r from-orange-400 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              Maintenance
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto">
            We're performing scheduled maintenance. We'll be back online shortly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

            <Link
              href="/"
              className="bg-white/5 border border-white/20 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
