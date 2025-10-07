import { NextResponse } from 'next/server'
import { tokenService } from '@/main/services/auth/token'
import { db, users } from '@/main/db'
import { eq } from 'drizzle-orm'

/**
 * Authentication middleware that validates both JWT token and active session
 * Use this for all protected API endpoints
 */
export function withAuth(handler) {
  return async function(request, ...args) {
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
              timestamp: new Date().toISOString(),
              requiresAuth: true
            }
          },
          { status: 401 }
        )
      }

      let authData
      try {
        authData = await tokenService.verifyAccessTokenWithSession(accessToken, request)
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: null,
            error: error.message.includes('Session') ? 'Session expired or terminated' : 'Invalid access token',
            meta: {
              timestamp: new Date().toISOString(),
              requiresAuth: true,
              sessionInvalid: error.message.includes('Session')
            }
          },
          { status: 401 }
        )
      }

      const { payload, session } = authData

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
            error: 'User not found or account disabled',
            meta: {
              timestamp: new Date().toISOString(),
              requiresAuth: true
            }
          },
          { status: 401 }
        )
      }

      request.user = user
      request.session = session
      request.tokenPayload = payload

      return await handler(request, ...args)
      
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Authentication failed',
          meta: {
            timestamp: new Date().toISOString(),
            details: process.env.NODE_ENV === 'development' ? error.message : 'Auth error'
          }
        },
        { status: 500 }
      )
    }
  }
}

/**
 * Optional auth middleware - doesn't fail if no auth, but validates if present
 */
export function withOptionalAuth(handler) {
  return async function(request, ...args) {
    try {
      const tokens = tokenService.extractTokensFromCookies(request)
      const { accessToken } = tokens
      
      if (accessToken) {
        try {
          const authData = await tokenService.verifyAccessTokenWithSession(accessToken, request)
          const { payload, session } = authData

          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, payload.userId))
            .limit(1)

          if (user && user.isActive) {
            request.user = user
            request.session = session
            request.tokenPayload = payload
          }
        } catch (error) {
          console.log('Optional auth failed:', error.message)
        }
      }

      return await handler(request, ...args)
      
    } catch (error) {
      console.error('Optional auth middleware error:', error)
      return await handler(request, ...args)
    }
  }
}

/**
 * Admin authentication middleware
 * Reuses withAuth for session validation and adds admin role checking
 */
export function withAdminAuth(handler) {
  const adminHandler = async function(request, ...args) {
    const { user } = request
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Admin access required. You do not have permission to access this resource.',
          meta: {
            timestamp: new Date().toISOString(),
            userRole: user.role,
            requiresAdmin: true
          }
        },
        { status: 403 }
      )
    }
    
    request.adminUser = user
    
    return await handler(request, ...args)
  }
  
  return withAuth(adminHandler)
}
