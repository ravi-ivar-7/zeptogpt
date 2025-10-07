'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import InlineSpinner from '@/main/components/loaders/InlineSpinner'
import { useAuth } from '@/main/hooks/useAuth'
import { useToast } from '@/main/hooks/useToast'
import accountAPI from '@/main/services/apis/accountAPIs'
import GoogleOAuthButton from '@/main/components/auth/GoogleOAuthButton'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Shield } from 'lucide-react'
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { checkAuthStatus } = useAuth()
  const toast = useToast()

  const getRedirectUrl = () => {
    const returnTo = searchParams.get('returnTo')
    if (returnTo) return returnTo

    if (typeof window !== 'undefined' && document.referrer) {
      const referrer = new URL(document.referrer)
      const currentHost = window.location.host
      if (referrer.host === currentHost && 
          !referrer.pathname.includes('/account/login') &&
          !referrer.pathname.includes('/account/register')) {
        return referrer.pathname + referrer.search
      }
    }

    return '/'
  }

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [otpData, setOtpData] = useState({
    otp: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false)
  const [requiresAccountActivation, setRequiresAccountActivation] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('/')

  useEffect(() => {
    setRedirectUrl(getRedirectUrl())
    // Handle OAuth error and message parameters
    const errorParam = searchParams.get('error')
    const messageParam = searchParams.get('message')
    
    if (errorParam) {
      const errorMessages = {
        'oauth_error': 'OAuth authentication failed',
        'missing_code': 'OAuth authentication incomplete',
        'invalid_state': 'OAuth authentication failed',
        'token_exchange_failed': 'Failed to exchange OAuth token',
        'user_info_failed': 'Failed to retrieve user information',
        'oauth_callback_failed': 'OAuth authentication failed',
        'account_disabled': 'Account temporarily disabled'
      }
      
      const errorMessage = errorMessages[errorParam] || 'Authentication failed'
      const subtext = messageParam ? decodeURIComponent(messageParam) : 'Please try again.'
      
      toast.error(errorMessage, { subtext })
      
      // Clear URL parameters to prevent duplicate toasts on re-renders
      const url = new URL(window.location)
      url.searchParams.delete('error')
      url.searchParams.delete('message')
      window.history.replaceState({}, '', url)
    }
  }, [searchParams, toast])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleOtpChange = (e) => {
    const { name, value } = e.target
    setOtpData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await accountAPI.login(formData)
      
      if (!result.success) {
        if (result.error) {
          const subtext = result.message ? { subtext: result.message } : undefined
          toast.error(result.error, subtext)
        } else if (result.message) {
          toast.error(result.message)
        } else {
          toast.error('Login failed')
        }
        setLoading(false)
        return
      }

      if (result.data?.requiresTwoFactor) {
        setRequiresTwoFactor(true)
        setOtpData(prev => ({ ...prev, email: formData.email }))
        toast.info(result.message || 'Please check your email for the verification code')
        setLoading(false)
        return
      }

      if (result.data?.requiresAccountActivation) {
        setRequiresAccountActivation(true)
        setOtpData(prev => ({ ...prev, email: formData.email }))
        toast.info(result.message || 'Please check your email for the activation code')
        setLoading(false)
        return
      }

      await checkAuthStatus()
      toast.success('Login successful!')
      
      setTimeout(() => {
        router.push(redirectUrl)
      }, 1000)

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerification = async (e) => {
    e.preventDefault()
    setLoading(true)

    const intent = requiresTwoFactor ? '2fa_otp' : 'account_activation_otp'
    const result = await accountAPI.verifyOTP(otpData.email, otpData.otp, intent)

    if (!result.success) {
      toast.error(result.error || 'OTP verification failed')
      setLoading(false)
      return
    }

    toast.success('Login successful! Redirecting...')
    
    await checkAuthStatus()
    
    const finalRedirectUrl = redirectUrl || '/'
    
    setTimeout(() => {
      router.push(finalRedirectUrl)
    }, 1500)
    
    setLoading(false)
  }

  const handleResendOtp = async () => {
    setLoading(true)

    const intent = requiresTwoFactor ? '2fa_otp' : 'account_activation_otp'
    const result = await accountAPI.resendOTP(otpData.email, intent)

    if (!result.success) {
      toast.error(result.error || 'Failed to resend OTP')
    } else {
      toast.success('New verification code sent to your email')
    }
    
    setLoading(false)
  }

  if (requiresTwoFactor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black/95 via-purple-900/10 to-black/95 flex items-center justify-center p-4">

        <div className="relative w-full max-w-md">
          {/* SearchModal-style Card */}
          <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl md:rounded-3xl shadow-2xl shadow-purple-500/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl mb-4 shadow-lg shadow-emerald-500/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Two-Factor Authentication
              </h2>
              <p className="text-white/60 text-sm">
                Enter the verification code sent to your email
              </p>
            </div>

            <form onSubmit={handleOtpVerification} className="space-y-6">
              {/* OTP Input */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-white/80 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-center text-lg font-mono tracking-widest"
                  placeholder="000000"
                  value={otpData.otp}
                  onChange={handleOtpChange}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-800 to-orange-800 hover:from-amber-700 hover:to-orange-700 text-amber-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30"
                >
                  {loading ? (
                    <InlineSpinner color="white" text="Verifying..." />
                  ) : (
                    <>
                      Verify Code
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full text-amber-400 hover:text-amber-300 font-medium py-2 transition-colors duration-200"
                >
                  Resend verification code
                </button>

                <button
                  type="button"
                  onClick={() => setRequiresTwoFactor(false)}
                  className="w-full text-zinc-400 hover:text-zinc-300 font-medium py-2 transition-colors duration-200"
                >
                  ← Back to login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Account Activation UI (similar to 2FA)
  if (requiresAccountActivation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black/95 via-purple-900/10 to-black/95 flex items-center justify-center p-4">

        <div className="relative w-full max-w-md">
          {/* SearchModal-style Card */}
          <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl md:rounded-3xl shadow-2xl shadow-purple-500/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Account Activation
              </h2>
              <p className="text-white/60 text-sm">
                Enter the activation code sent to your email to activate your account
              </p>
            </div>

            <form onSubmit={handleOtpVerification} className="space-y-6">
              {/* OTP Input */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-white/80 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-center text-lg font-mono tracking-widest"
                  placeholder="000000"
                  value={otpData.otp}
                  onChange={handleOtpChange}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || otpData.otp.length !== 6}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 md:py-4 px-6 rounded-xl md:rounded-2xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:shadow-none disabled:cursor-not-allowed text-sm md:text-base"
              >
                {loading ? (
                  <InlineSpinner color="white" text="Verifying..." />
                ) : (
                  'Activate Account'
                )}
              </button>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full text-blue-400 hover:text-blue-300 font-medium py-2 transition-colors duration-200"
                >
                  Resend verification code
                </button>

                <button
                  type="button"
                  onClick={() => setRequiresAccountActivation(false)}
                  className="w-full text-zinc-400 hover:text-zinc-300 font-medium py-2 transition-colors duration-200"
                >
                  ← Back to login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/95 via-purple-900/10 to-black/95 flex items-center justify-center p-4">

      <div className="relative w-full max-w-md">
        {/* SearchModal-style Card */}
        <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl md:rounded-3xl shadow-2xl shadow-purple-500/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-white/60 text-sm">
              Sign in to continue to {process.env.NEXT_PUBLIC_APP_NAME || 'NEXTJS'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            <GoogleOAuthButton />
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 text-white/60">Or continue with email</span>
              </div>
            </div>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 md:h-5 w-4 md:w-5 text-white/60" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm md:text-base"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 md:h-5 w-4 md:w-5 text-white/60" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 md:pl-12 pr-12 py-3 md:py-4 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm md:text-base"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 md:h-5 w-4 md:w-5 text-white/60 hover:text-white/80" />
                  ) : (
                    <Eye className="h-4 md:h-5 w-4 md:w-5 text-white/60 hover:text-white/80" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href="/account/password" className="text-sm text-purple-400 hover:text-purple-300">
                Forgot your password?
              </Link>
            </div>


            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 md:py-4 px-6 rounded-xl md:rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 text-sm md:text-base"
            >
              {loading ? (
                <InlineSpinner color="white" text="Signing in..." />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-white/20">
            <p className="text-white/60 text-sm">
              Don't have an account?{' '}
              <Link
                href={`/account/register${searchParams.get('returnTo') ? `?returnTo=${encodeURIComponent(searchParams.get('returnTo'))}` : ''}`}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <Suspense fallback={<SkeletonLoader variant="form" count={4} />}>
      <LoginForm />
    </Suspense>
  )
}
