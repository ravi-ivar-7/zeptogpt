import { NextResponse } from 'next/server'
import { db, users, accounts } from '@/main/db'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { tokenService } from '@/main/services/auth/token'
import { sessionService } from '@/main/services/auth/session'
import { generateAndSendOTP } from '@/main/services/auth/otp'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Email and password are required',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Get user by email
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
          error: 'Invalid email or password',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    }

    // Only check for OAuth if user has NO password at all
    if (!user.password) {
      const linkedAccounts = await db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, user.id))

      if (linkedAccounts.length > 0) {
        const providers = linkedAccounts.map(account => 
          account.provider.charAt(0).toUpperCase() + account.provider.slice(1)
        )
        
        const providerList = providers.length === 1 
          ? providers[0]
          : providers.length === 2
          ? `${providers[0]} or ${providers[1]}`
          : `${providers.slice(0, -1).join(', ')}, or ${providers[providers.length - 1]}`

        return NextResponse.json(
          {
            success: false,
            data: null,
            message: `Please use ${providerList} to sign in.`,
            error: `This email is linked to OAuth`,
            meta: {
              timestamp: new Date().toISOString()
            }
          },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: null,
            error: 'Invalid email or password',
            meta: {
              timestamp: new Date().toISOString()
            }
          },
          { status: 401 }
        )
      }
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Invalid email or password',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      )
    }

    if (user.twoFactorEnabled) {
      const fingerPrint = tokenService.getDeviceFigerPrint(request)
      const result = await generateAndSendOTP(email, '2fa_otp', fingerPrint.ip)
      
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
        data: {
          requiresTwoFactor: true
        },
        message: 'Please check your email for the verification code',
        error: null,
        meta: {
          timestamp: new Date().toISOString()
        }
      })
    }

    if (!user.isActive) {
      const fingerPrint = tokenService.getDeviceFigerPrint(request)
      const result = await generateAndSendOTP(email, 'account_activation_otp', fingerPrint.ip)
      
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
        data: {
          requiresAccountActivation: true
        },
        message: 'Please check your email for the account activation code',
        error: null,
        meta: {
          timestamp: new Date().toISOString()
        }
      })
    }

    // Update last sign in
    await db
      .update(users)
      .set({
        lastSignIn: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id))
    const tokens = tokenService.generateTokenPair(user)
    const fingerPrint = tokenService.getDeviceFigerPrint(request)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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
          isActive: user.isActive,
          twoFactorEnabled: user.twoFactorEnabled
        }
      },
      message: 'Login successful',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })
    tokenService.setTokenCookies(tokens, response)
    return response

  } catch (error) {
    console.error('Login error:', error)
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
