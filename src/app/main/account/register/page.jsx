'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import LoadingSpinner from '@/main/components/loaders/LoadingSpinner'
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader'
import InlineSpinner from '@/main/components/loaders/InlineSpinner'
import { useAuth } from '@/main/hooks/useAuth'
import { useToast } from '@/main/hooks/useToast'
import accountAPI from '@/main/services/apis/accountAPIs'
import GoogleOAuthButton from '@/main/components/auth/GoogleOAuthButton'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'

function RegisterForm() {
  const searchParams = useSearchParams()
  const { checkAuthStatus } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [otpData, setOtpData] = useState({
    otp: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  const getRedirectUrl = () => {
    const returnTo = searchParams.get('returnTo')
    if (returnTo) return returnTo

    if (typeof window !== 'undefined' && document.referrer) {
      const referrer = new URL(document.referrer)
      const currentHost = window.location.host
      // Exclude auth and account auth paths from referrer redirect
      if (referrer.host === currentHost &&
        !referrer.pathname.includes('/account/login') &&
        !referrer.pathname.includes('/account/register')) {
        return referrer.pathname + referrer.search
      }
    }

    return '/'
  }

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

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return false
    }
    return true
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    const result = await accountAPI.register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })

    if (!result.success) {
      if (result.error) {
        const subtext = result.message ? { subtext: result.message } : undefined
        toast.error(result.error, subtext)
      } else if (result.message) {
        toast.error(result.message)
      } else {
        toast.error('Registration failed')
      }
      setLoading(false)
      return
    }

    setShowOtpVerification(true)
    setOtpData(prev => ({ ...prev, email: formData.email }))
    toast.success('Registration successful!', { subtext: 'Please check your email for verification code.' })
    setLoading(false)
  }

  const handleOtpVerification = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await accountAPI.verifyOTP(otpData.email, otpData.otp, 'account_activation_otp')

    if (result.success) {
      toast.success('Registration successful!', { subtext: 'Redirecting...' })
      await checkAuthStatus()
      setTimeout(() => {
        router.push(getRedirectUrl())
      }, 1500)
    } else {
      if (result.error) {
        const subtext = result.message ? { subtext: result.message } : undefined
        toast.error(result.error, subtext)
      } else if (result.message) {
        toast.error(result.message)
      } else {
        toast.error('OTP verification failed')
      }
    }

    setLoading(false)
  }

  const handleResendOtp = async () => {
    setLoading(true)

    const result = await accountAPI.resendOTP(otpData.email, 'account_activation_otp')

    if (result.success) {
      toast.success('New verification code sent to your email')
    } else {
      if (result.error) {
        const subtext = result.message ? { subtext: result.message } : undefined
        toast.error(result.error, subtext)
      } else if (result.message) {
        toast.error(result.message)
      } else {
        toast.error('Failed to resend OTP')
      }
    }

    setLoading(false)
  }

  if (showOtpVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black/95 via-purple-900/10 to-black/95 flex items-center justify-center p-4">

        <div className="relative w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => setShowOtpVerification(false)}
            className="mb-6 flex items-center gap-2 text-white/60 hover:text-purple-400 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Back to registration</span>
          </button>

          {/* Verification Card */}
          <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl md:rounded-3xl shadow-2xl shadow-purple-500/20 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Verify Your Email
              </h1>
              <p className="text-white/60 text-sm leading-relaxed">
                Enter the verification code sent to
                <br />
                <span className="text-purple-400 font-medium">{otpData.email}</span>
              </p>
            </div>

            <form onSubmit={handleOtpVerification} className="space-y-6">
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
                  className="w-full px-4 py-3 md:py-4 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-center text-lg font-mono tracking-widest"
                  placeholder="000000"
                  value={otpData.otp}
                  onChange={handleOtpChange}
                />
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading || otpData.otp.length !== 6}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 md:py-4 px-6 rounded-xl md:rounded-2xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 disabled:shadow-none disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {loading ? (
                    <InlineSpinner color="white" text="Verifying..." />
                  ) : (
                    'Verify Email'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full text-purple-400 hover:text-purple-300 font-medium py-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend verification code
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }



  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black/95 via-purple-900/10 to-black/95 flex items-center justify-center p-4">

        <div className="relative w-full max-w-md">
          {/* Registration Card */}
          <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl md:rounded-3xl shadow-2xl shadow-purple-500/20 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Create Account
              </h1>
              <p className="text-white/60 text-sm">
                Already have an account?{' '}
                <Link
                  href={`/account/login${searchParams.get('returnTo') ? `?returnTo=${encodeURIComponent(searchParams.get('returnTo'))}` : ''}`}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <GoogleOAuthButton returnTo={getRedirectUrl()} />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 text-white/60">Or continue with email</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-white/60" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm md:text-base"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-white/60" />
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

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-white/60" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="w-full pl-10 md:pl-12 pr-12 py-3 md:py-4 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm md:text-base"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-4 md:w-5 h-4 md:h-5" /> : <Eye className="w-4 md:w-5 h-4 md:h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-white/60" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="w-full pl-10 md:pl-12 pr-12 py-3 md:py-4 bg-white/5 border border-white/20 rounded-xl md:rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm md:text-base"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 md:w-5 h-4 md:h-5" /> : <Eye className="w-4 md:w-5 h-4 md:h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 md:py-4 px-6 rounded-xl md:rounded-2xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 disabled:shadow-none disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {loading ? (
                    <InlineSpinner color="white" text="Creating Account..." />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<SkeletonLoader variant="form" count={4} />}>
      <RegisterForm />
    </Suspense>
  )
}
