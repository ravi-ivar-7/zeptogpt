'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Home, Building2, FileText } from 'lucide-react'
import { Button } from '@/main/components/ui/button'

const quickLinks = [
  {
    icon: Home,
    title: 'Home',
    description: 'Back to homepage',
    href: '/',
    gradient: 'from-purple-600 to-blue-600'
  },
  {
    icon: Building2,
    title: 'About Us',
    description: 'Learn about ZepToGPT',
    href: '/company/about',
    gradient: 'from-blue-600 to-indigo-600'
  },
  {
    icon: FileText,
    title: 'Privacy Policy',
    description: 'How we protect your data',
    href: '/company/privacy',
    gradient: 'from-green-600 to-emerald-600'
  },
  {
    icon: FileText,
    title: 'Terms of Service',
    description: 'Our terms and conditions',
    href: '/company/terms',
    gradient: 'from-amber-600 to-orange-600'
  }
]

export function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleLinkClick = (href) => {
    router.push(href)
    onClose()
  }

  const filteredLinks = searchQuery
    ? quickLinks.filter(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : quickLinks

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[2vh] md:pt-[8vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-2 md:mx-4 bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl md:rounded-3xl shadow-2xl shadow-purple-500/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-3 md:p-6 border-b border-white/10">
          <div className="relative flex-1">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-white/60" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm md:text-base"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="ml-2 md:ml-4 text-white/60 hover:text-white hover:bg-white/10 rounded-lg md:rounded-xl p-2"
          >
            <X className="w-4 md:w-5 h-4 md:h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] md:max-h-[60vh] overflow-y-auto p-3 md:p-6">
          {filteredLinks.length > 0 ? (
            <div className="space-y-2">
              {filteredLinks.map((link, index) => {
                const Icon = link.icon
                return (
                  <button
                    key={index}
                    onClick={() => handleLinkClick(link.href)}
                    className="w-full flex items-center space-x-3 md:space-x-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className={`w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r ${link.gradient} rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 md:w-6 h-5 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium group-hover:text-purple-300 transition-colors text-sm md:text-base">
                        {link.title}
                      </div>
                      <div className="text-white/60 text-xs md:text-sm">{link.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-white/60 text-sm">No pages found matching "{searchQuery}"</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 hidden md:block">
          <div className="flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center space-x-4">
              <span>Press <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> to close</span>
              <span>Press <kbd className="px-2 py-1 bg-white/10 rounded">⌘K</kbd> to search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
