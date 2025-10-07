import { NextResponse } from 'next/server'
import { db, users } from '@/main/db'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { generateAndSendOTP } from '@/main/services/auth/otp'

export async function POST(request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Email, password, and name are required',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Invalid email format',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Password must be at least 8 characters long',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'User with this email already exists',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const [user] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        isActive: false,
        emailVerified: null,
        twoFactorEnabled: false,
        role: 'user',
        locale: 'en',
        timezone: 'UTC',
        passwordChangedAt: new Date()
      })
      .returning()

    const deviceInfo = { ip: request.headers.get('x-forwarded-for') || 'unknown' }
    const result = await generateAndSendOTP(email, 'account_activation_otp', deviceInfo.ip)
    
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
        userId: user.id
      },
      message: 'Registration successful. Please check your email for verification code.',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
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
