'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SkeletonLoader from '@/main/components/loaders/SkeletonLoader'
import InlineSpinner from '@/main/components/loaders/InlineSpinner'
import LoadingSpinner from '@/main/components/loaders/LoadingSpinner'
import { useAuth } from '@/main/hooks/useAuth'
import { useToast } from '@/main/hooks/useToast'
import accountAPI from '@/main/services/apis/accountAPIs'
import { Smartphone, Monitor, Globe, Users, Shield, Calendar, Clock, LogOut, ArrowLeft, Tablet, User } from 'lucide-react'

function SessionPageContent() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [user, setUser] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState(null)
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/main/account/login')
      return
    }
    
    if (isAuthenticated) {
      fetchSessionInfo()
    }
  }, [isAuthenticated, authLoading, router])

  const fetchSessionInfo = async () => {
    const result = await accountAPI.getSession()

    if (!result.success) {
      toast.error(result.error || 'Failed to fetch session info')
      setLoading(false)
      return
    }

    setUser(result.data.user)
    setSessions(result.data.sessions)
    setLoading(false)
  }

  const revokeAllSessions = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to logout from all devices? You will need to sign in again on all your devices.'
    )
    
    if (!confirmed) return

    setRevoking('all')
    const result = await accountAPI.revokeAllSessions()

    if (!result.success) {
      toast.error(result.error || 'Failed to revoke all sessions')
      setRevoking(null)
      return
    }

    toast.success(result.message || 'All sessions revoked successfully')
    setTimeout(() => {
      router.push('/account/login')
    }, 1500)
  }

  const revokeSession = async (sessionId) => {
    setRevoking(sessionId)
    const result = await accountAPI.revokeSession(sessionId)
    
    if (!result.success) {
      toast.error(result.error || 'Failed to revoke session')
      setRevoking(null)
      return
    }
    
    toast.success(result.message || 'Session revoked successfully')
    setRevoking(null)
    await fetchSessionInfo()
  }

  const revokeCurrentSession = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to logout from this device?'
    )
    
    if (!confirmed) return

    setRevoking('current')
    const result = await accountAPI.revokeCurrentSession()

    if (!result.success) {
      toast.error(result.error || 'Failed to revoke current session')
      setRevoking(null)
      return
    }

    toast.success(result.message || 'Current session revoked successfully')
    setTimeout(() => {
      router.push('/account/logout')
    }, 1000)
  }

  const getDeviceIcon = (deviceInfo) => {
    try {
      const info = typeof deviceInfo === 'string' ? JSON.parse(deviceInfo) : deviceInfo
      
      if (info.device === 'Mobile') return <Smartphone className="w-5 h-5" />
      if (info.device === 'Tablet') return <Tablet className="w-5 h-5" />
      return <Monitor className="w-5 h-5" />
    } catch {
      return <Globe className="w-5 h-5" />
    }
  }

  const formatDeviceInfo = (deviceInfo) => {
    try {
      const info = typeof deviceInfo === 'string' ? JSON.parse(deviceInfo) : deviceInfo
      
      return { 
        type: `${info.device || 'Unknown'} (${info.os || 'Unknown OS'})`, 
        browser: info.browser || 'Unknown Browser'
      }
    } catch {
      return { type: 'Unknown Device', browser: 'Unknown Browser' }
    }
  }


  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <LoadingSpinner 
        fullScreen={true} 
        text="Loading session information..." 
        animationType="particles"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/95 via-purple-900/10 to-black/95">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href="/account/profile"
              className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Profile</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Session Management</h1>
          <p className="text-white/60">Manage your active sessions and security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Actions */}
            <div className="bg-gradient-to-b from-black/95 via-red-900/20 to-black/95 backdrop-blur-2xl border border-red-500/30 rounded-2xl md:rounded-3xl p-6 shadow-2xl shadow-red-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Security Actions</h2>
                  <p className="text-white/60 text-sm">Manage your active sessions</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={revokeCurrentSession}
                  disabled={revoking === 'current'}
                  className="w-full flex items-center justify-center px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {revoking === 'current' ? (
                    <InlineSpinner color="white" text="Logging out..." />
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Logout from this device</span>
                      <span className="sm:hidden">Logout current</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={revokeAllSessions}
                  disabled={revoking === 'all'}
                  className="w-full flex items-center justify-center px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {revoking === 'all' ? (
                    <InlineSpinner color="white" text="Logging out all..." />
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Logout from all devices</span>
                      <span className="sm:hidden">Logout all</span>
                    </>
                  )}
                </button>

              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl md:rounded-3xl p-6 shadow-2xl shadow-purple-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Active Sessions</h2>
                  <p className="text-white/60 text-sm">{sessions.length} other device{sessions.length !== 1 ? 's' : ''} signed in</p>
                </div>
              </div>

              {sessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-medium mb-2">All secure!</h3>
                  <p className="text-white/60 text-sm">No other active sessions found. You're only signed in on this device.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => {
                    const deviceInfo = formatDeviceInfo(session.deviceInfo)
                    return (
                      <div key={session.id} className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                                  {getDeviceIcon(session.deviceInfo)}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="text-white font-medium text-sm sm:text-base truncate">{deviceInfo.type}</h3>
                                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                                  <span className="text-green-400 text-xs font-medium flex-shrink-0">Active</span>
                                </div>
                                <p className="text-white/60 text-xs sm:text-sm mb-2 truncate">{deviceInfo.browser} • {session.ipAddress || 'Unknown IP'}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-white/40">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">Created: {formatDate(session.createdAt)}</span>
                                  </div>
                                  {session.lastAccessedAt && (
                                    <div className="flex items-center space-x-1">
                                      <Globe className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Last: {formatDate(session.lastAccessedAt)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0 self-end sm:self-auto">
                            <button
                              onClick={() => revokeSession(session.id)}
                              disabled={revoking === session.id}
                              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Logout this session"
                            >
                              {revoking === session.id ? (
                                <InlineSpinner color="white" size="sm" />
                              ) : (
                                <>
                                  <LogOut className="w-4 h-4 mr-2" />
                                  Logout
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current User Info */}
            {user && (
              <div className="bg-gradient-to-b from-black/95 via-blue-900/20 to-black/95 backdrop-blur-2xl border border-blue-500/30 rounded-2xl md:rounded-3xl p-6 shadow-2xl shadow-blue-500/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Current Session</h2>
                    <p className="text-white/60 text-sm">Your account details</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    {user.image && (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-blue-500/30 self-center sm:self-auto"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                    <div className="text-center sm:text-left">
                      <h3 className="text-white font-medium text-base sm:text-lg">{user.name}</h3>
                      <p className="text-white/60 text-sm break-all">{user.email}</p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                      <span className="text-white/60 text-sm">Email Verified</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className={`text-sm ${user.emailVerified ? 'text-green-400' : 'text-red-400'}`}>
                          {user.emailVerified ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                      <span className="text-white/60 text-sm">2FA Enabled</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${user.twoFactorEnabled ? 'bg-green-400' : 'bg-white/40'}`}></div>
                        <span className={`text-sm ${user.twoFactorEnabled ? 'text-green-400' : 'text-white/60'}`}>
                          {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-4">
                    <Link href="/main/account/profile">
                      <button className="w-full flex items-center justify-center px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl transition-all duration-200 text-sm sm:text-base">
                        <User className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Go to Profile</span>
                        <span className="sm:hidden">Profile</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-gradient-to-b from-black/95 via-orange-900/20 to-black/95 backdrop-blur-2xl border border-orange-500/30 rounded-2xl md:rounded-3xl p-6 shadow-2xl shadow-orange-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Security Notice</h3>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                If you notice any suspicious activity or unrecognized sessions, 
                logout from all devices immediately and change your password.
              </p>
              <div className="mt-4">
                <Link 
                  href="/account/profile"
                  className="inline-flex items-center text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                >
                  Change Password →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SessionPage() {
  return (
    <Suspense fallback={<SkeletonLoader variant="form" count={4} />}>
      <SessionPageContent />
    </Suspense>
  )
}
