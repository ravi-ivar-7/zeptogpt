'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowLeft, Shield, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/main/components/ui/button'
import InlineSpinner from '@/main/components/loaders/InlineSpinner'
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader'
import { useToast } from '@/main/hooks/useToast'
import accountAPI from '@/main/services/apis/accountAPIs'

export default function PasswordResetPage() {
  const [step, setStep] = useState('request') // 'request' or 'reset'
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const toast = useToast()
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await accountAPI.requestPasswordReset(formData.email)

    if (!result.success) {
      if (result.error) {
        const subtext = result.message ? { subtext: result.message } : undefined
        toast.error(result.error, subtext)
      } else if (result.message) {
        toast.error(result.message)
      } else {
        toast.error('Failed to request password reset')
      }
      setLoading(false)
      return
    }

    setStep('reset')
    toast.success('Password reset code sent to your email')
    setLoading(false)
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    const result = await accountAPI.resetPasswordWithOTP(formData.email, formData.otp, formData.newPassword)

    if (!result.success) {
      if (result.error) {
        const subtext = result.message ? { subtext: result.message } : undefined
        toast.error(result.error, subtext)
      } else if (result.message) {
        toast.error(result.message)
      } else {
        toast.error('Failed to reset password')
      }
      setLoading(false)
      return
    }

    toast.success('Password reset successfully!', { subtext: 'Redirecting to login...' })
    setTimeout(() => {
      router.push('/account/login')
    }, 2000)
    setLoading(false)
  }

  const handleResendCode = async () => {
    setLoading(true)

    const result = await accountAPI.requestPasswordReset(formData.email)

    if (!result.success) {
      if (result.error) {
        const subtext = result.message ? { subtext: result.message } : undefined
        toast.error(result.error, subtext)
      } else if (result.message) {
        toast.error(result.message)
      } else {
        toast.error('Failed to resend reset code')
      }
    } else {
      toast.success('New reset code sent to your email')
    }
    
    setLoading(false)
  }

  if (step === 'reset') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Reset Your Password
            </h1>
            <p className="text-white/60">
              Enter the verification code sent to <span className="text-purple-400">{formData.email}</span>
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 p-6">

            <form onSubmit={handlePasswordReset} className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    name="otp"
                    required
                    maxLength={6}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* New Password Input */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="Enter new password (min 8 characters)"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <InlineSpinner variant="gradient" color="white" text="Resetting Password..." />
                ) : (
                  'Reset Password'
                )}
              </Button>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-purple-400 hover:text-purple-300 hover:bg-white/5"
                >
                  Resend verification code
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('request')}
                  className="text-white/60 hover:text-white hover:bg-white/5 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to email entry</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Reset Your Password
          </h1>
          <p className="text-white/60">
            Enter your email address and we'll send you a verification code
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 p-6">

          <form onSubmit={handleRequestReset} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </Button>

            {/* Back to Login */}
            <div className="pt-4">
              <Link 
                href="/account/login" 
                className="flex items-center justify-center space-x-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
