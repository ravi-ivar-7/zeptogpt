'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import accountAPI from '@/main/services/apis/accountAPIs'

const AuthContext = createContext({})

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [lastAuthCheck, setLastAuthCheck] = useState(0)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    checkAuthStatus()
    
    // Handle OAuth success - check for oauth_success parameter
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('oauth_success')) {
      // Remove the oauth_success parameter from URL for cleaner URLs
      urlParams.delete('oauth_success')
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '')
      window.history.replaceState({}, '', newUrl)
      
      // Single delayed check for OAuth success
      setTimeout(() => checkAuthStatus(), 1000)
    }
    
    // Debounced focus handler - only check auth if it's been more than 30 seconds
    const handleFocus = () => {
      const now = Date.now()
      if (!loading && !isChecking && (now - lastAuthCheck > 30000)) {
        checkAuthStatus()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const checkAuthStatus = async () => {
    if (isChecking) return
    
    setIsChecking(true)
    setLastAuthCheck(Date.now())
    
    try {
      const result = await accountAPI.getSession()
      if (result.success && result.data?.user) {
        setUser(result.data.user)
        setIsAuthenticated(true)
      } else {
        // Try to refresh token if access token is invalid/expired
        if (result.error === 'Invalid access token' || result.error === 'Access token not found') {
          console.log('Access token expired, attempting refresh...')
          const refreshResult = await accountAPI.refreshToken()
          
          if (refreshResult.success && refreshResult.data?.user) {
            setUser(refreshResult.data.user)
            setIsAuthenticated(true)
            console.log('Token refreshed successfully')
          } else {
            console.log('Token refresh failed, logging out')
            setUser(null)
            setIsAuthenticated(false)
          }
        } else {
          // Only log as error if it's not the expected token cases
          if (result.error && result.error !== 'Access token not found') {
            console.error('checkAuthStatus: Auth check failed:', result.error)
          }
          setUser(null)
          setIsAuthenticated(false)
        }
      }
    } catch (error) {
      console.error('checkAuthStatus: Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
      setIsChecking(false)
    }
  }

  const getCurrentUser = () => {
    return isAuthenticated ? user : null
  }

  const refreshTokens = async () => {
    try {
      const result = await accountAPI.refreshToken()
      if (result.success && result.data?.user) {
        setUser(result.data.user)
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    checkAuthStatus,
    getCurrentUser,
    refreshTokens,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
