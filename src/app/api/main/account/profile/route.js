import { NextResponse } from 'next/server'
import { withAuth } from '@/main/middleware/authMiddleware'
import { db, users } from '@/main/db'
import { eq } from 'drizzle-orm'

// Get user profile
export const GET = withAuth(async function(request) {
  try {
    // User and session are already validated by middleware
    const { user } = request

    if (!user) {
      return NextResponse.json({
        success: false,
        data: null,
        message: null,
        error: 'User not found in request context',
        meta: {
          timestamp: new Date().toISOString()
        }
      }, { status: 500 })
    }

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
          role: user.role,
          locale: user.locale,
          timezone: user.timezone,
          lastSignIn: user.lastSignIn,
          passwordChangedAt: user.passwordChangedAt,
          createdAt: user.createdAt
        }
      },
      message: 'Profile retrieved successfully',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Profile get error:', error)
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

// Update user profile
export const PUT = withAuth(async function(request) {
  try {
    // User and session are already validated by middleware
    const { user } = request
    const { name, image, locale, timezone, twoFactorEnabled } = await request.json()

    // Validate input
    const updates = {}
    if (name !== undefined) updates.name = name
    if (image !== undefined) updates.image = image
    if (locale !== undefined) updates.locale = locale
    if (timezone !== undefined) updates.timezone = timezone
    if (twoFactorEnabled !== undefined) updates.twoFactorEnabled = twoFactorEnabled

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'No valid fields to update',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Update user profile
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id))
      .returning()

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          image: updatedUser.image,
          emailVerified: updatedUser.emailVerified,
          twoFactorEnabled: updatedUser.twoFactorEnabled,
          role: updatedUser.role,
          locale: updatedUser.locale,
          timezone: updatedUser.timezone
        }
      },
      message: 'Profile updated successfully',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Profile update error:', error)
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
