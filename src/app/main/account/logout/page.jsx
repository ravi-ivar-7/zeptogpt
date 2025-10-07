'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/main/hooks/useAuth'
import accountAPI from '@/main/services/apis/accountAPIs'
import { Loader2, LogOut, Home, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/main/components/ui/button'
import InlineSpinner from '@/main/components/loaders/InlineSpinner'
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader'

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(true)
  const [logoutSuccess, setLogoutSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { checkAuthStatus } = useAuth()

  useEffect(() => {
    handleLogout()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setError('')
    
    const result = await accountAPI.revokeCurrentSession()
    
    if (!result.success) {
      setError(result.error || 'Failed to logout properly')
      setIsLoggingOut(false)
      return
    }
    
    await checkAuthStatus()
    
    setLogoutSuccess(true)
    setIsLoggingOut(false)
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleGoToLogin = () => {
    router.push('/account/login')
  }

  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white/5 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-8 text-center">
            <InlineSpinner variant="gradient" size="xl" text="Logging Out..." />
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-white mb-4">Logging Out...</h1>
            </div>
            <p className="text-white/70">
              Clearing your session and removing authentication tokens.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/5 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-8 text-center">
          {logoutSuccess ? (
            <>
              <div className="mb-6">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Successfully Logged Out</h1>
              <p className="text-white/70 mb-8">
                You have been logged out from this device. Your session has been cleared and authentication tokens have been removed.
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Logout Error</h1>
              <p className="text-red-300 mb-8">
                {error || 'An error occurred during logout'}
              </p>
            </>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleGoToLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              Sign In Again
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30 font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Home
            </Button>

            <div className="pt-4 border-t border-white/10">
              <p className="text-white/50 text-sm mb-3">Quick Links</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link
                  href="/"
                  className="text-xs text-purple-300 hover:text-purple-200 underline transition-colors"
                >
                  Home
                </Link>
                <span className="text-white/30 text-xs">•</span>
                <Link
                  href="/account/register"
                  className="text-xs text-purple-300 hover:text-purple-200 underline transition-colors"
                >
                  Create Account
                </Link>
                <span className="text-white/30 text-xs">•</span>
                <Link
                  href="/account/login?action=reset"
                  className="text-xs text-purple-300 hover:text-purple-200 underline transition-colors"
                >
                  Reset Password
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/40 text-sm">
            Thank you for using {process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}. Come back anytime!
          </p>
        </div>
      </div>
    </div>
  )
}