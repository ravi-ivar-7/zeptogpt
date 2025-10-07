import { NextResponse } from 'next/server'
import { tokenService } from '@/main/services/auth/token'
import { sessionService } from '@/main/services/auth/session'
import { db, users } from '@/main/db'
import { eq } from 'drizzle-orm'

// Refresh token
export async function POST(request) {
  try {
    const { refreshToken } = tokenService.extractTokensFromCookies(request)
    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Refresh token not found',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    }

    // Verify refresh token
    let payload
    try {
      payload = tokenService.verifyRefreshToken(refreshToken)
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Invalid refresh token',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'User not found or inactive',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    }

    // Generate new token pair
    const tokens = tokenService.generateTokenPair(user)

    // Update session if exists
    const fingerPrint = tokenService.getDeviceFigerPrint(request)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    
    // Invalidate old session and create new one with new refresh token
    try {
      await sessionService.invalidateSession(refreshToken)
    } catch (error) {
      // Old session might not exist, that's okay
    }
    
    // Create new session with new refresh token
    await sessionService.createSession(user.id, fingerPrint.deviceInfo, fingerPrint.ip, fingerPrint.userAgent, expiresAt, tokens.refreshToken)


    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled
        }
      },
      message: 'Token refreshed successfully',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })

    // Set new tokens in cookies
    tokenService.setTokenCookies(tokens, response)

    return response

  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: null,
        error: error.message || 'Internal server error',
        meta: {
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }
}

// Get current session info
export async function GET(request) {
  try {
    const tokens = tokenService.extractTokensFromCookies(request)
    
    const { accessToken } = tokens
    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Access token not found',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    }

    // Verify access token
    let payload
    try {
      payload = tokenService.verifyAccessToken(accessToken)
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Invalid access token',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'User not found or inactive',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    }

    // Get user's active sessions
    const allSessions = await sessionService.getUserActiveSessions(user.id)
    
    // Filter out the current session (identified by refresh token)
    const { refreshToken } = tokenService.extractTokensFromCookies(request)

    const currentSession = refreshToken ? await sessionService.getSessionByToken(refreshToken) : null

    const otherSessions = allSessions.filter(session => 
      !currentSession || session.id !== currentSession.id
    )
    
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
          ...user
        },
        sessions: otherSessions.map(session => {
          let parsedDeviceInfo = {}
          try {
            parsedDeviceInfo = JSON.parse(session.deviceInfo || '{}')
          } catch (error) {
            console.error('Error parsing deviceInfo:', error)
            parsedDeviceInfo = { deviceId: 'unknown' }
          }
          
          return {
            id: session.id,
            deviceInfo: parsedDeviceInfo,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            lastAccessedAt: session.lastAccessedAt,
            createdAt: session.createdAt
          }
        })
      },
      message: 'Session information retrieved successfully',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Session info error:', error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: null,
        error: error.message || 'Internal server error',
        meta: {
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }
}


// Logout - handles both all-sessions and individual session logout
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const logoutAll = searchParams.get('all') === 'true'
    const { refreshToken } = tokenService.extractTokensFromCookies(request)

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'No active session found',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    }

    let payload
    try {
      payload = tokenService.verifyRefreshToken(refreshToken)
    } catch (error) {
      // Token might be invalid, but we still want to clear cookies
      console.warn('Invalid refresh token during logout:', error.message)
      const response = NextResponse.json({
        success: true,
        data: null,
        message: 'Session cleared (token was invalid)',
        error: null,
        meta: {
          timestamp: new Date().toISOString()
        }
      })
      tokenService.clearTokenCookies(response)
      return response
    }

    let message = ''
    
    if (sessionId) {
      await sessionService.invalidateSessionById(sessionId)
      message = 'Session logged out successfully'
    } else if (logoutAll) {
      await sessionService.invalidateAllUserSessions(payload.userId)
      message = 'Logged out from all devices'
    } else {
      await sessionService.invalidateSession(refreshToken)
      message = 'Logged out from current device'
    }

    const response = NextResponse.json({
      success: true,
      data: null,
      message,
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })

    if (!sessionId || logoutAll) {
      tokenService.clearTokenCookies(response)
    }

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: null,
        error: error.message || 'Internal server error',
        meta: {
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }
}
