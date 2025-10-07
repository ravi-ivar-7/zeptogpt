'use client'

import React, { useState, useEffect } from 'react'
import { Search, Home, ArrowLeft, Compass, Zap, Star, User, Database, Settings, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/main/components/ui/button'

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('')
  const [floatingElements, setFloatingElements] = useState([])

  // Generate floating elements
  useEffect(() => {
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }))
    setFloatingElements(elements)
  }, [])

  const popularPages = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'About', path: '/main/company/about', icon: '📋' },
    { name: 'Login', path: '/auth/login', icon: '🔐' },
    { name: 'Register', path: '/auth/register', icon: '📝' },
    { name: 'Profile', path: '/main/account/profile', icon: '👤' },
    { name: 'Sessions', path: '/main/account/sessions', icon: '🔒' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Redirect to home with search query
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/95 via-purple-900/10 to-black/95 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 404 Animation */}
        <div className="mb-6 sm:mb-8">
          <span className="text-6xl sm:text-8xl lg:text-9xl font-black text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-600 bg-clip-text leading-none">
            404
          </span>
        </div>

        {/* Main content */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Page Not Found
          </h1>

          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
            The page you're looking for doesn't exist. Let's get you back on track.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Link>

            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="bg-white/5 border border-white/20 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </Button>
          </div>

          {/* Popular pages */}
          <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {popularPages.map((page, index) => (
                <Link
                  key={index}
                  href={page.path}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300 hover:border-purple-400/50 group"
                >
                  <div className="text-2xl mb-2">{page.icon}</div>
                  <h4 className="text-white font-medium text-sm group-hover:text-purple-400 transition-colors">
                    {page.name}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
