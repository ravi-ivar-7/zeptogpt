import { db } from '@/main/db'
import { sessions } from '@/main/schemas/authSchema'
import { eq, and, gt, desc } from 'drizzle-orm'
import crypto from 'crypto'

export class SessionService {
  // Create new session
  async createSession(userId, deviceInfo, ip, userAgent,  expiresAt, refreshToken) {
    try {
      if(!userId || !refreshToken){
        throw new Error('Missing userid and token')
      }
      const sessionToken = refreshToken 
      
      const [newSession] = await db.insert(sessions).values({
        id: crypto.randomUUID(),
        userId,
        sessionToken,
        expiresAt,
        deviceInfo: JSON.stringify(deviceInfo),
        ipAddress: ip,
        userAgent: userAgent,
        isActive: true,
        lastAccessedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning()

      return newSession
    } catch (error) {
      console.error('Error creating session:', error)
      throw error
    }
  }

  // Get session by token
  async getSessionByToken(sessionToken) {
    try {
      const [session] = await db
        .select()
        .from(sessions)
        .where(and(
          eq(sessions.sessionToken, sessionToken),
          eq(sessions.isActive, true),
          gt(sessions.expiresAt, new Date())
        ))
        .limit(1)

      return session || null
    } catch (error) {
      console.error('Error getting session by token:', error)
      throw error
    }
  }

  // Update session last accessed time
  async updateSessionAccess(sessionToken) {
    try {
      await db
        .update(sessions)
        .set({
          lastAccessedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(sessions.sessionToken, sessionToken))
    } catch (error) {
      console.error('Error updating session access:', error)
      throw error
    }
  }

  // Invalidate session
  async invalidateSession(sessionToken) {
    try {
      await db
        .update(sessions)
        .set({
          isActive: false,
          updatedAt: new Date()
        })
        .where(eq(sessions.sessionToken, sessionToken))
    } catch (error) {
      console.error('Error invalidating session:', error)
      throw error
    }
  }

  // Invalidate all user sessions
  async invalidateAllUserSessions(userId) {
    try {
      await db
        .update(sessions)
        .set({
          isActive: false,
          updatedAt: new Date()
        })
        .where(eq(sessions.userId, userId))
    } catch (error) {
      console.error('Error invalidating all user sessions:', error)
      throw error
    }
  }

  // Get user's active sessions
  async getUserActiveSessions(userId) {
    try {
      const activeSessions = await db
        .select()
        .from(sessions)
        .where(and(
          eq(sessions.userId, userId),
          eq(sessions.isActive, true),
          gt(sessions.expiresAt, new Date())
        ))
        .orderBy(desc(sessions.lastAccessedAt))

      return activeSessions
    } catch (error) {
      console.error('Error getting user active sessions:', error)
      throw error
    }
  }

  // Get session by ID
  async getSessionById(sessionId) {
    try {
      const session = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, sessionId))
        .limit(1)

      return session[0] || null
    } catch (error) {
      console.error('Error getting session by ID:', error)
      throw error
    }
  }

  // Invalidate session by ID
  async invalidateSessionById(sessionId) {
    try {
      await db
        .update(sessions)
        .set({
          isActive: false,
          updatedAt: new Date()
        })
        .where(eq(sessions.id, sessionId))
    } catch (error) {
      console.error('Error invalidating session by ID:', error)
      throw error
    }
  }

  // Clean up expired sessions
  async cleanupExpiredSessions() {
    try {
      await db
        .update(sessions)
        .set({
          isActive: false,
          updatedAt: new Date()
        })
        .where(and(
          eq(sessions.isActive, true),
          gt(new Date(), sessions.expiresAt)
        ))
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error)
      throw error
    }
  }

  // Extend session expiry
  async extendSession(sessionToken, newExpiresAt) {
    try {
      await db
        .update(sessions)
        .set({
          expiresAt: newExpiresAt,
          lastAccessedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(sessions.sessionToken, sessionToken))
    } catch (error) {
      console.error('Error extending session:', error)
      throw error
    }
  }

  // Validate session and return user info
  async validateSession(sessionToken) {
    try {
      const session = await this.getSessionByToken(sessionToken)
      if (!session) return null

      // Update last accessed time
      await this.updateSessionAccess(sessionToken)

      return session
    } catch (error) {
      console.error('Error validating session:', error)
      throw error
    }
  }
}

// Export singleton instance
export const sessionService = new SessionService()
