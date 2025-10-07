import { NextResponse } from 'next/server'
import { withAuth } from '@/main/middleware/authMiddleware'
import { db, users } from '@/main/db'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { generateAndSendOTP, verifyOTP } from '@/main/services/auth/otp'

// Change password (authenticated user)
export const PUT = withAuth(async function(request) {
  try {
    // User and session are already validated by middleware
    const { user } = request
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Current password and new password are required',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'New password must be at least 8 characters long',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Verify current password (skip for OAuth users setting first password)
    if (user.password && !(await bcrypt.compare(currentPassword, user.password))) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Current password is incorrect',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Hash new password and update

    
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)
    await db
      .update(users)
      .set({
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id))

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Password changed successfully',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Password change error:', error)
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
})

// Request password reset otp
export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Email is required',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        data: null,
        message: 'If an account with this email exists, you will receive a password reset code.',
        error: null,
        meta: {
          timestamp: new Date().toISOString()
        }
      })
    }

    // Send password reset OTP
    const deviceInfo = { ip: request.headers.get('x-forwarded-for') || 'unknown' }
    const result = await generateAndSendOTP(email, 'password_reset_otp', deviceInfo.ip)

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
      message: 'Password reset code sent to your email',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Password reset request error:', error)
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

// Reset password with OTP
export async function PATCH(request) {
  try {
    const { email, otp, newPassword } = await request.json()

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Email, OTP, and new password are required',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'New password must be at least 8 characters long',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Verify OTP
    const isValid = await verifyOTP(email, otp, 'password_reset_otp')
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

    // Get user
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

    // Hash new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)
    await db
      .update(users)
      .set({
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id))

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Password reset successfully',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Password reset error:', error)
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
