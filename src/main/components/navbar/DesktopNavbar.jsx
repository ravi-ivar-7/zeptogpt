'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Zap, ChevronDown, Search
} from 'lucide-react'
import { Button } from '@/main/components/ui/button'
import { getNavItems } from './navbarData'
import { Badge } from '@/main/components/ui/badge'
import { renderDropdownItem } from './NavItemRenderer'
import { SearchModal } from './SearchModal'
import { useAuth } from '@/main/hooks/useAuth'

export function DesktopNavbar() {
  const router = useRouter()
  const pathname = usePathname()
  const {user, isAuthenticated, logout} = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navItems = getNavItems(isAuthenticated)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setIsSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const isActive = (item) => {
    // For items with direct href
    if (item.href) {
      if (item.href === '/') return pathname === '/'
      return pathname.startsWith(item.href)
    }
    
    // For dropdown items, check if any dropdown item matches current path
    if (item.hasDropdown && item.dropdownItems) {
      return item.dropdownItems.some(dropdownItem => {
        if (dropdownItem.href === '/') return pathname === '/'
        return pathname.startsWith(dropdownItem.href)
      })
    }
    
    return false
  }

  const renderDropdown = (items) => (
    <div className="absolute top-full left-0 w-[300px] bg-gradient-to-b from-slate-900/98 via-slate-900/95 to-black/98 backdrop-blur-2xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden z-[100]">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5 pointer-events-none" />
      
      <div className="relative p-4">
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 -mr-2">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                router.push(item.href)
                setActiveDropdown(null)
              }}
              className="cursor-pointer transform transition-all duration-200 hover:translate-x-1"
            >
              {renderDropdownItem({
                icon: <span className="text-lg">{item.emoji}</span>,
                title: item.title,
                description: item.description,
                gradient: item.gradient,
                onClick: () => {}
              })}
            </div>
          ))}
        </div>
        
        {/* Scroll fade indicators */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-900/90 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none" />
      </div>
    </div>
  )

  return (  <>
    <nav className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-300 ${
      isScrolled 
        ? 'bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border-b border-purple-500/30' 
        : 'bg-gradient-to-b from-black/90 via-purple-900/15 to-black/90 backdrop-blur-2xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">
                ZepToGPT
              </span>
              <span className="text-[10px] text-white/50 -mt-1">
                Zep to GPT
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item)
              const isDropdownOpen = activeDropdown === item.title
              
              return (
                <div 
                  key={item.title} 
                  className="relative dropdown-container"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.title)}
                  onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 group ${
                        active 
                          ? 'bg-white/10 text-white border border-purple-500/30 shadow-lg shadow-purple-500/20' 
                          : 'text-white/80 hover:text-white hover:bg-white/5 hover:border hover:border-white/20'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                      {item.hasDropdown && (
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.title ? 'rotate-180' : ''
                        }`} />
                      )}
                    </Link>
                  ) : (
                    <button
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 group ${
                        active 
                          ? 'bg-white/10 text-white border border-purple-500/30 shadow-lg shadow-purple-500/20' 
                          : 'text-white/80 hover:text-white hover:bg-white/5 hover:border hover:border-white/20'
                      }`}
                      onClick={() => {
                        if (item.hasDropdown) {
                          setActiveDropdown(isDropdownOpen ? null : item.title)
                        }
                      }}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                      {item.hasDropdown && (
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.title ? 'rotate-180' : ''
                        }`} />
                      )}
                    </button>
                  )}
                  {isDropdownOpen && item.dropdownItems && renderDropdown(item.dropdownItems)}
                </div>
              )
            })}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex text-white/75 hover:text-white hover:bg-gradient-to-br hover:from-white/8 hover:to-white/4 hover:border hover:border-white/25 hover:shadow-md hover:shadow-white/10 rounded-xl transition-all duration-300"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
              <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0.5 bg-white/10 text-white/60 rounded-lg">
                ⌘K
              </Badge>
            </Button>
          </div>
        </div>
      </div>
    </nav>
    
    <SearchModal 
      isOpen={isSearchOpen} 
      onClose={() => setIsSearchOpen(false)} 
      user={user}
      isAuthenticated={isAuthenticated}
    />
  </>
  )
}
