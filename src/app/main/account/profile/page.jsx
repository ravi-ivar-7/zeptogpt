'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LoadingSpinner from '@/main/components/loaders/LoadingSpinner'
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader'
import InlineSpinner from '@/main/components/loaders/InlineSpinner'
import { useAuth } from '@/main/hooks/useAuth'
import { useToast } from '@/main/hooks/useToast'
import accountAPI from '@/main/services/apis/accountAPIs'

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const KeyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
)

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

function ProfilePageContent() {
  const {isAuthenticated, loading: authLoading} = useAuth()
  const toast = useToast()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    twoFactorEnabled: false
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  // Helper function to check if user has password (not OAuth user)
  const hasPassword = (user) => {
    return user && user.passwordChangedAt !== null && user.passwordChangedAt !== undefined
  }

  // Helper function to format password change date
  const formatPasswordChangeDate = (passwordChangedAt) => {
    if (!passwordChangedAt) {
      return 'Never changed'
    }
    
    const changeDate = new Date(passwordChangedAt)
    const now = new Date()
    const diffTime = Math.abs(now - changeDate)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Changed today'
    } else if (diffDays === 1) {
      return 'Changed yesterday'
    } else if (diffDays < 30) {
      return `Changed ${diffDays} days ago`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `Changed ${months} month${months > 1 ? 's' : ''} ago`
    } else {
      const years = Math.floor(diffDays / 365)
      return `Changed ${years} year${years > 1 ? 's' : ''} ago`
    }
  }

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/main/account/login')
      return
    }
    
    if (isAuthenticated) {
      fetchProfile()
    }
  }, [isAuthenticated, authLoading, router])

  const fetchProfile = async () => {
    const result = await accountAPI.getProfile()
    
    if (!result.success) {
      toast.error(result.error || 'Failed to fetch profile')
      setLoading(false)
      return
    }
    
    const userData = result.data.user
    setUser(userData)
    setFormData({
      name: userData.name || '',
      image: userData.image || '',
      locale: userData.locale || 'en',
      timezone: userData.timezone || 'UTC',
      twoFactorEnabled: userData.twoFactorEnabled || false
    })
    setLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const result = await accountAPI.updateProfile(formData)
      
      if (!result.success) {
        toast.error(result.error || 'Failed to update profile')
        setUpdating(false)
        return
      }
      
      const userData = result.data.user
      setUser(userData)
      toast.success('Profile updated successfully!')
      setUpdating(false)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setChangingPassword(true)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      setChangingPassword(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long')
      setChangingPassword(false)
      return
    }

    try {
      // For OAuth users setting first password, don't send current password
      const result = hasPassword(user) 
        ? await accountAPI.changePassword(passwordData.currentPassword, passwordData.newPassword)
        : await accountAPI.changePassword('', passwordData.newPassword)
      
      if (!result.success) {
        toast.error(result.error || 'Failed to change password')
        setChangingPassword(false)
        return
      }
      
      toast.success(hasPassword(user) ? 'Password changed successfully!' : 'Password set successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswordForm(false)
      setChangingPassword(false)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setChangingPassword(false)
    }
  }

  const handleDisableAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to temporarily disable your account? You can reactivate it later by verifying your email.'
    )
    
    if (!confirmed) return

    try {
      const result = await accountAPI.disableAccount()
      
      if (!result.success) {
        toast.error(result.error || 'Failed to disable account')
        return
      }
      
      toast.success('Account temporarily disabled. Check your email for reactivation instructions.')
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/account/login')
      }, 2000)
      
    } catch (error) {
      toast.error('Failed to disable account. Please try again.')
    }
  }

  if (loading) {
    return (
      <LoadingSpinner 
        fullScreen={true} 
        text="Loading your profile..." 
        animationType="particles"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/95 via-purple-900/10 to-black/95">
 

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-white/60">Manage your profile and account preferences</p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl md:rounded-3xl p-6 shadow-2xl shadow-purple-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <UserIcon />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                  <p className="text-white/60 text-sm">Update your personal details</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Profile Image Preview */}
                {formData.image && (
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <img 
                        src={formData.image} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-purple-500/30"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 placeholder-white/60 text-white rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-white/80 mb-2">
                      Profile Image URL
                    </label>
                    <input
                      id="image"
                      name="image"
                      type="url"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 placeholder-white/60 text-white rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.image}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <ShieldIcon />
                      </div>
                      <div>
                        <div className="text-white font-medium">Two-Factor Authentication</div>
                        <div className="text-white/60 text-sm">Add an extra layer of security</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="twoFactorEnabled"
                        name="twoFactorEnabled"
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.twoFactorEnabled}
                        onChange={handleInputChange}
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {updating ? (
                    <InlineSpinner color="white" text="Updating..." />
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </form>
            </div>

            {/* Password Section */}
            <div className="bg-gradient-to-b from-black/95 via-orange-900/20 to-black/95 backdrop-blur-2xl border border-orange-500/30 rounded-2xl md:rounded-3xl p-6 shadow-2xl shadow-orange-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                  <KeyIcon />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Security</h2>
                  <p className="text-white/60 text-sm">Manage your password and security settings</p>
                </div>
              </div>

              {hasPassword(user) ? (
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-white font-medium">Password</div>
                    <div className="text-white/60 text-sm">{formatPasswordChangeDate(user?.passwordChangedAt)}</div>
                  </div>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-orange-400 hover:text-orange-300 rounded-lg md:rounded-xl transition-all text-sm font-medium border border-white/20"
                  >
                    {showPasswordForm ? 'Cancel' : 'Change Password'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-white font-medium">Password</div>
                    <div className="text-white/60 text-sm">Signed in with Google - Add password for additional security</div>
                  </div>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg md:rounded-xl transition-all text-sm font-medium border border-blue-500/30"
                  >
                    {showPasswordForm ? 'Cancel' : 'Set Password'}
                  </button>
                </div>
              )}

              {showPasswordForm && (
                <form onSubmit={handleChangePassword} className="space-y-6 border-t border-white/10 pt-6">
                  {hasPassword(user) && (
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-white/80 mb-2">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 placeholder-white/60 text-white rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-white/80 mb-2">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 placeholder-white/60 text-white rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                      placeholder="Min 8 characters"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 placeholder-white/60 text-white rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {changingPassword ? (
                      <InlineSpinner color="white" text="Changing..." />
                    ) : (
                      hasPassword(user) ? 'Change Password' : 'Set Password'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:w-96">
            {/* Account Information */}
            <div className="bg-gradient-to-b from-black/95 via-blue-900/20 to-black/95 backdrop-blur-2xl border border-blue-500/30 rounded-2xl md:rounded-3xl p-6 shadow-2xl shadow-blue-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <EmailIcon />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Account Info</h2>
                  <p className="text-white/60 text-sm">Your account details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <EmailIcon />
                    <span className="text-white/60">Email</span>
                  </div>
                  <span className="text-white font-medium">{user?.email}</span>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <CheckIcon />
                    <span className="text-white/60">Verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${user?.emailVerified ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className={user?.emailVerified ? 'text-green-400' : 'text-red-400'}>
                      {user?.emailVerified ? `Yes (${new Date(user.emailVerified).toLocaleDateString()})` : 'No'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <ShieldIcon />
                    <span className="text-white/60">2FA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${user?.twoFactorEnabled ? 'bg-green-400' : 'bg-white/40'}`}></div>
                    <span className={user?.twoFactorEnabled ? 'text-green-400' : 'text-white/60'}>
                      {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon />
                    <span className="text-white/60">Member Since</span>
                  </div>
                  <span className="text-white font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-b from-black/95 via-green-900/20 to-black/95 backdrop-blur-2xl border border-green-500/30 rounded-2xl md:rounded-3xl p-6 shadow-2xl shadow-green-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href="/account/sessions" 
                  className="flex items-center space-x-3 p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all group border border-white/10"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium group-hover:text-purple-300 transition-colors">Manage Sessions</div>
                    <div className="text-white/60 text-sm">View active devices</div>
                  </div>
                </Link>

                <button 
                  onClick={handleDisableAccount}
                  className="flex items-center space-x-3 p-3 md:p-4 bg-red-500/10 hover:bg-red-500/20 rounded-xl md:rounded-2xl transition-all group border border-red-500/30 w-full text-left"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-red-400 font-medium group-hover:text-red-300 transition-colors">Disable Account</div>
                    <div className="text-red-400/60 text-sm">Temporarily disable account access</div>
                  </div>
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<SkeletonLoader variant="form" count={6} />}>
      <ProfilePageContent />
    </Suspense>
  )
}
