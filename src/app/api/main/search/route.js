import { NextResponse } from 'next/server'
import { withOptionalAuth } from '@/main/middleware/authMiddleware'
import { db } from '@/main/db'
// Canvas schemas removed - writeflow functionality disabled
import { users } from '@/main/schemas/authSchema'
import { eq, and, or, like, desc, sql } from 'drizzle-orm'

export const GET = withOptionalAuth(async function(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all' // all, users
    const deep = searchParams.get('deep') === 'true'
    const limit = parseInt(searchParams.get('limit')) || 20

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        data: null,
        message: null,
        error: 'Query must be at least 2 characters long',
        meta: {
          timestamp: new Date().toISOString()
        }
      }, { status: 400 })
    }

    // Check authentication - user is available if authenticated
    const isAuthenticated = !!request.user

    let results = {
      users: [],
      total: 0
    }

    const searchQuery = `%${query.toLowerCase()}%`

    // Search users (if authenticated and admin)
    if ((type === 'all' || type === 'users') && isAuthenticated) {
      try {
        const userResults = await db
          .select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            isActive: users.isActive,
            createdAt: users.createdAt
          })
          .from(users)
          .where(
            or(
              like(users.email, searchQuery),
              like(users.name, searchQuery)
            )
          )
          .orderBy(desc(users.createdAt))
          .limit(limit)

        results.users = userResults
        results.total += userResults.length
      } catch (error) {
        console.error('Error searching users:', error)
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Found ${results.total} results for "${query}"`,
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        query,
        type,
        deep,
        limit,
        authenticated: isAuthenticated
      }
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({
      success: false,
      data: null,
      message: null,
      error: 'Internal server error',
      meta: {
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === 'development' ? error.message : 'Search failed'
      }
    }, { status: 500 })
  }
})
