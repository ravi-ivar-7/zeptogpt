'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  User, Plus, Search, Bell, Settings, LogOut, Crown, ChevronUp
} from 'lucide-react'
import { Button } from '@/main/components/ui/button'

import { renderDropdownItem } from './NavItemRenderer'
import { getNavItems } from './navbarData'
import { useAuth } from '@/main/hooks/useAuth'

export function MobileNavbar() {
  const router = useRouter()
  const pathname = usePathname()
  const {user, isAuthenticated, logout} = useAuth()
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [showDropdownOverlay, setShowDropdownOverlay] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navItems = getNavItems(isAuthenticated)

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

  const handleNavItemClick = (item) => {
    if (item.hasDropdown) {
      setActiveDropdown(activeDropdown === item.title ? null : item.title)
      setShowDropdownOverlay(activeDropdown !== item.title)
    } else {
      router.push(item.href)
      setActiveDropdown(null)
      setShowDropdownOverlay(false)
    }
  }

  const handleDropdownItemClick = (item) => {
    router.push(item.href)
    setActiveDropdown(null)
    setShowDropdownOverlay(false)
  }



  const renderMobileDropdown = (items) => (
    <div className="fixed bottom-16 left-1 right-1 z-40 bg-gradient-to-b from-slate-900/98 via-slate-900/95 to-black/98 backdrop-blur-2xl border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/8 via-transparent to-blue-600/8 pointer-events-none" />
      
      <div className="relative">
        {/* Handle indicator */}
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-10 h-1.5 bg-gradient-to-r from-purple-400/60 to-pink-400/60 rounded-full shadow-lg shadow-purple-500/20"></div>
        </div>
        
        <div className="border-b border-white/10 mx-3 mb-2" />
        
        <div className="p-3 space-y-1 max-h-80 overflow-y-auto pr-1 -mr-1 scrollbar-thin">
          
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleDropdownItemClick(item)}
              className="cursor-pointer transition-all duration-300 hover:bg-white/8 hover:translate-x-0.5 rounded-xl px-2 py-1 active:bg-white/12"
            >
              {renderDropdownItem({
                icon: <span className="text-lg">{item.emoji}</span>,
                title: item.title,
                description: item.description,
                gradient: item.gradient,
                onClick: () => { }
              })}
            </div>
          ))}
        </div>
        
        {/* Scroll fade indicators for mobile */}
        <div className="absolute top-12 left-0 right-0 h-4 bg-gradient-to-b from-slate-900/95 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-slate-900/95 to-transparent pointer-events-none" />
      </div>
    </div>
  )

  return (
    <> 
      {showDropdownOverlay && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-30"
          onClick={() => {
            setActiveDropdown(null)
            setShowDropdownOverlay(false)
          }}
        />
      )}

      {activeDropdown && navItems.find(item => item.title === activeDropdown)?.dropdownItems &&
        renderMobileDropdown(navItems.find(item => item.title === activeDropdown).dropdownItems)
      }

      <nav className="fixed bottom-0 pb-2 left-0 right-0 z-[200] bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border-t border-purple-500/30">
        <div className="safe-area-bottom">
          <div className="flex items-center justify-around px-2 ">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item)
              const isDropdownOpen = activeDropdown === item.title

              return (
                <button
                  key={item.title}
                  onClick={() => handleNavItemClick(item)}
                  className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-300 min-w-[60px] text-white/70 hover:text-white hover:bg-gradient-to-br hover:from-white/8 hover:to-white/4 hover:border hover:border-white/20 hover:shadow-md hover:shadow-white/10`}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mb-1" />
                    {item.hasDropdown && (
                      <ChevronUp className={`w-3 h-3 ml-1 mb-1 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''
                        }`} />
                    )}
                  </div>
                  <span className={`text-xs font-medium relative ${active || isDropdownOpen ? 'text-white' : ''}`}>
                    {item.title}
                    {(active || isDropdownOpen) && (
                      <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                    )}
                  </span>
                </button>
              )
            })}

            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex flex-col items-center justify-center p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 hover:border hover:border-white/20 transition-all duration-200 min-w-[60px]"
            >
              <Search className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Search</span>
            </button>

          </div>
        </div>
      </nav>
    </>
  )
}
