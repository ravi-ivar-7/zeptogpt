import { NextResponse } from 'next/server'
import { verifyOTP, generateAndSendOTP } from '@/main/services/auth/otp'
import { db } from '@/main/db'
import { users } from '@/main/schemas/authSchema'
import { eq } from 'drizzle-orm'
import { tokenService } from '@/main/services/auth/token'
import { sessionService } from '@/main/services/auth/session'

// Verify OTP
export async function POST(request) {
  try {
    const { email, otp, intent } = await request.json()

    if (!email || !otp || !intent) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Email, OTP, and intent are required',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Verify OTP
    const isValid = await verifyOTP(email, otp, intent)
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Invalid or expired OTP',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    switch (intent) {

      case 'account_activation_otp':
        await db
          .update(users)
          .set({
            isActive: true,
            emailVerified: new Date(),
            updatedAt: new Date()
          })
          .where(eq(users.email, email))

        const [activatedUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)
        const activationTokens = tokenService.generateTokenPair(activatedUser)

        const activationFingerPrint = tokenService.getDeviceFigerPrint(request)
        const activationExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        await sessionService.createSession(activatedUser.id, activationFingerPrint.deviceInfo, activationFingerPrint.ip, activationFingerPrint.userAgent, activationExpiresAt, activationTokens.refreshToken)

        let activationResponse = NextResponse.json({
          success: true,
          data: {
            user: {
              id: activatedUser.id,
              email: activatedUser.email,
              name: activatedUser.name,
              image: activatedUser.image,
              emailVerified: activatedUser.emailVerified,
              isActive: true,
              twoFactorEnabled: activatedUser.twoFactorEnabled
            }
          },
          message: 'Account activated successfully',
          error: null,
          meta: {
            timestamp: new Date().toISOString()
          }
        })

        tokenService.setTokenCookies(activationTokens, activationResponse)
        return activationResponse

      case '2fa_otp':
        const [userFor2FA] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)
        const tokens2FA = tokenService.generateTokenPair(userFor2FA)

        const fingerPrint2FA = tokenService.getDeviceFigerPrint(request)
        const expiresAt2FA = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        await sessionService.createSession(userFor2FA.id, fingerPrint2FA.deviceInfo, fingerPrint2FA.ip, fingerPrint2FA.userAgent, expiresAt2FA, tokens2FA.refreshToken)


        const response2FA = NextResponse.json({
          success: true,
          data: {
            user: {
              id: userFor2FA.id,
              email: userFor2FA.email,
              name: userFor2FA.name,
              image: userFor2FA.image,
              emailVerified: userFor2FA.emailVerified,
              isActive: userFor2FA.isActive,
              twoFactorEnabled: userFor2FA.twoFactorEnabled
            }
          },
          message: '2FA verification successful',
          error: null,
          meta: {
            timestamp: new Date().toISOString()
          }
        })

        tokenService.setTokenCookies(tokens2FA, response2FA)
        return response2FA

      default:
        const [defaultUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)
        const tokensDefault = tokenService.generateTokenPair(defaultUser)

        const fingerPrintDefault = tokenService.getDeviceFigerPrint(request)
        const expiresAtDefault = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        await sessionService.createSession(defaultUser.id, fingerPrintDefault.deviceInfo, fingerPrintDefault.ip, fingerPrintDefault.userAgent, expiresAtDefault, tokensDefault.refreshToken)

        const responseDefault = NextResponse.json({
          success: true,
          data: {
            user: {
              id: defaultUser.id,
              email: defaultUser.email,
              name: defaultUser.name,
              image: defaultUser.image,
              emailVerified: defaultUser.emailVerified,
              isActive: defaultUser.isActive,
              twoFactorEnabled: defaultUser.twoFactorEnabled
            }
          },
          message: 'OTP verification successful',
          error: null,
          meta: {
            timestamp: new Date().toISOString()
          }
        })

        tokenService.setTokenCookies(tokensDefault, responseDefault)
        return responseDefault

    }

  } catch (error) {
    console.error('OTP verification error:', error)
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

// Request new OTP
export async function PUT(request) {
  try {
    const { email, intent } = await request.json()

    if (!email || !intent) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Email and intent are required',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    if (intent === 'account_activation_otp' || intent === '2fa_otp' || intent === 'email_verification_otp' || intent === 'password_reset_otp') {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: null,
            error: 'User not found',
            meta: {
              timestamp: new Date().toISOString()
            }
          },
          { status: 404 }
        )
      }
    }

    const deviceInfo = { ip: request.headers.get('x-forwarded-for') || 'unknown' }
    const result = await generateAndSendOTP(email, intent, deviceInfo.ip)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          data: null,
          message: null,
          error: result.error,
          meta: {
            timestamp: new Date().toISOString(),
            rateLimited: result.rateLimited || false,
            timeLeft: result.timeLeft || null,
            timeLeftFormatted: result.timeLeftFormatted || null
          }
        },
        { status: result.rateLimited ? 429 : 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: 'New OTP sent to your email',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('OTP request error:', error)
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
