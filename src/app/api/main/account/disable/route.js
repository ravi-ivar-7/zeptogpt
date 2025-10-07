import { NextResponse } from 'next/server'
import { withAuth } from '@/main/middleware/authMiddleware'
import { db, users } from '@/main/db'
import { eq } from 'drizzle-orm'

// Disable account (authenticated user)
export const POST = withAuth(async function(request) {
  try {
    // User and session are already validated by middleware
    const { user } = request

    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: null,
          error: 'Account is already disabled',
          meta: {
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Disable the user account
    await db
      .update(users)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id))

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Account temporarily disabled. You can reactivate it by verifying your email.',
      error: null,
      meta: {
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Account disable error:', error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: null,
        error: 'Failed to disable account. Please try again.',
        meta: {
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }
})
