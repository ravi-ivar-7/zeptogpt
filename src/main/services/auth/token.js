import jwt from 'jsonwebtoken'
import crypto from 'crypto'


export class TokenService {
  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'your-access-secret'
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret'
    this.accessTokenExpiry = '15m' // 15 minutes
    this.refreshTokenExpiry = '7d' // 7 days
  }

  // Generate access token (short-lived)
  generateAccessToken(payload) {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: `${process.env.NEXT_PUBLIC_APP_NAME || 'nextjs'}-ai`,
      audience: `${process.env.NEXT_PUBLIC_APP_NAME || 'nextjs'}-ai-users`
    })
  }

  // Generate refresh token (long-lived)
  generateRefreshToken(payload) {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: `${process.env.NEXT_PUBLIC_APP_NAME || 'nextjs'}-ai`,
      audience: `${process.env.NEXT_PUBLIC_APP_NAME || 'nextjs'}-ai-users`
    })
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret, {
        issuer: `${process.env.NEXT_PUBLIC_APP_NAME || 'nextjs'}-ai`,
        audience: `${process.env.NEXT_PUBLIC_APP_NAME || 'nextjs'}-ai-users`
      })
    } catch (error) {
      throw new Error('Invalid access token')
    }
  }

  // Verify access token and validate session
  async verifyAccessTokenWithSession(token, request) {
    try {
      // First verify the JWT token
      const payload = this.verifyAccessToken(token)
      
      // Then check if the session is still active
      const { refreshToken } = this.extractTokensFromCookies(request)
      if (!refreshToken) {
        throw new Error('No refresh token found')
      }
      
      // Import sessionService dynamically to avoid circular imports
      const { sessionService } = await import('@/main/services/auth/session')
      const session = await sessionService.getSessionByToken(refreshToken)
      
      if (!session) {
        throw new Error('Session not found or expired')
      }
      
      // Update last accessed time
      await sessionService.updateSessionAccess(refreshToken)
      
      return { payload, session }
    } catch (error) {
      throw new Error(`Token validation failed: ${error.message}`)
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret, {
        issuer: `${process.env.NEXT_PUBLIC_APP_NAME || 'nextjs'}-ai`,
        audience: `${process.env.NEXT_PUBLIC_APP_NAME || 'nextjs'}-ai-users`
      })
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
  }

  // Generate token pair
  generateTokenPair(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role || 'user'
    }

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    }
  }

  // Extract token from Authorization header
  extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7)
  }

  // Get device info from request
  getDeviceFigerPrint(req) {
    const userAgent = req.headers.get('user-agent') || 'Unknown Browser'
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || req.ip || 'Unknown IP'
    
    // Parse browser info from user agent
    const browserInfo = this.parseBrowserInfo(userAgent)
    const deviceId = crypto.createHash('md5').update(userAgent + ip).digest('hex')
    
    return {
      userAgent,
      ip,
      deviceInfo: { 
        deviceId,
        browser: browserInfo.browser,
        os: browserInfo.os,
        device: browserInfo.device
      }
    }
  }

  // Parse browser information from user agent
  parseBrowserInfo(userAgent) {
    const ua = userAgent.toLowerCase()
    
    // Browser detection
    let browser = 'Unknown Browser'
    if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome'
    else if (ua.includes('firefox')) browser = 'Firefox'
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari'
    else if (ua.includes('edg')) browser = 'Edge'
    else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera'
    
    // OS detection - check mobile OS first
    let os = 'Unknown OS'
    if (ua.includes('android')) os = 'Android'
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS'
    else if (ua.includes('windows')) os = 'Windows'
    else if (ua.includes('mac')) os = 'macOS'
    else if (ua.includes('linux')) os = 'Linux'
    
    // Device type detection
    let device = 'Desktop'
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) device = 'Mobile'
    else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet'
    
    return { browser, os, device }
  }

  // Create secure cookie options
  getCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }
  }

  // Set tokens in cookies
  setTokenCookies(tokens, response) {
    // Set access token
    response.cookies.set('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    })

    // Set refresh token
    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return response
  }



  // Clear token cookies
  clearTokenCookies(response) {
    // Clear access token
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    // Clear refresh token
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  }

  // Helper to serialize cookie options
  serializeCookieOptions(options) {
    const parts = []

    if (options.httpOnly) parts.push('HttpOnly')
    if (options.secure) parts.push('Secure')
    if (options.sameSite) parts.push(`SameSite=${options.sameSite}`)
    if (options.path) parts.push(`Path=${options.path}`)
    if (options.maxAge) parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`)

    return parts.join('; ')
  }

  // Extract tokens from cookies
  extractTokensFromCookies(req) {
    // For Next.js App Router, use cookies() from next/headers
    let cookieString = ''

    if (req.headers && req.headers.cookie) {
      cookieString = req.headers.cookie
    } else if (req.cookies) {
      // Handle NextRequest cookies
      const accessToken = req.cookies.get('accessToken')?.value
      const refreshToken = req.cookies.get('refreshToken')?.value
      return {
        accessToken: accessToken || null,
        refreshToken: refreshToken || null
      }
    }

    const cookies = this.parseCookies(cookieString)

    return {
      accessToken: cookies.accessToken || null,
      refreshToken: cookies.refreshToken || null
    }
  }

  // Parse cookie string
  parseCookies(cookieString) {
    const cookies = {}

    cookieString.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=')
      if (name && value) {
        cookies[name] = decodeURIComponent(value)
      }
    })

    return cookies
  }
}

// Export singleton instance
export const tokenService = new TokenService()
