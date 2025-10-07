import { NextResponse } from 'next/server'
import { db, users, accounts } from '@/main/db'
import { eq, and } from 'drizzle-orm'
import { tokenService } from '@/main/services/auth/token'
import { sessionService } from '@/main/services/auth/session'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const NEXT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

const GOOGLE_REDIRECT_URI = `${NEXT_BASE_URL}/api/main/account/google/callback`

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(`${NEXT_BASE_URL}/account/login?error=oauth_error`)
    }

    if (!code) {
      return NextResponse.redirect(`${NEXT_BASE_URL}/account/login?error=missing_code`)
    }

    // Verify state parameter
    let stateData
    try {
      stateData = JSON.parse(state || '{}')
    } catch (error) {
      console.error('Invalid state parameter:', error)
      return NextResponse.redirect(`${NEXT_BASE_URL}/account/login?error=invalid_state`)
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      return NextResponse.redirect(`${NEXT_BASE_URL}/account/login?error=token_exchange_failed`)
    }

    const tokens = await tokenResponse.json()

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error('Failed to get user info from Google')
      return NextResponse.redirect(`${NEXT_BASE_URL}/account/login?error=user_info_failed`)
    }

    const googleUser = await userResponse.json()

    // Check if user exists
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, googleUser.email.toLowerCase()))
      .limit(1)

    if (!user) {
      // Create new user
      [user] = await db
        .insert(users)
        .values({
          email: googleUser.email.toLowerCase(),
          name: googleUser.name,
          image: googleUser.picture,
          emailVerified: new Date(),
          isActive: true, 
          twoFactorEnabled: false,
          role: 'user',
          locale: 'en',
          timezone: 'UTC'
        })
        .returning()
    } else {
      // Check if account is inactive
      if (!user.isActive) {
        return NextResponse.redirect(`${NEXT_BASE_URL}/account/login?error=account_disabled&message=Your account has been temporarily disabled. Please use email login to reactivate your account.`)
      }
      
      // Update user info with Google data if needed
      if (!user.image && googleUser.picture) {
        await db
          .update(users)
          .set({
            image: googleUser.picture,
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id))
        user.image = googleUser.picture
      }
    }

    const appTokens = tokenService.generateTokenPair(user)

    // Link user and Google account if not already linked
    const [existingAccount] = await db
      .select()
      .from(accounts)
      .where(and(
        eq(accounts.userId, user.id),
        eq(accounts.provider, 'google'),
        eq(accounts.providerId, googleUser.id)
      ))
      .limit(1)

    if (!existingAccount) {
      await db
        .insert(accounts)
        .values({
          userId: user.id,
          provider: 'google',
          providerId: googleUser.id,
          providerAccountId: googleUser.id,
          metadata: {
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            verified_email: googleUser.verified_email
          }
        })
    }

    // Create session
    const fingerPrint = tokenService.getDeviceFigerPrint(request)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    await sessionService.createSession(
      user.id,
      fingerPrint.deviceInfo,
      fingerPrint.ip,
      fingerPrint.userAgent,
      expiresAt,
      appTokens.refreshToken
    )

    let returnTo = stateData?.returnTo || '/'
    
    if (!returnTo.startsWith('/')) {
      returnTo = '/'
    }
    
    if (returnTo.includes('//') || returnTo.startsWith('http')) {
      returnTo = '/'
    }
    
    // Add oauth_success parameter to trigger auth state update
    const separator = returnTo.includes('?') ? '&' : '?'
    const redirectUrl = `${NEXT_BASE_URL}${returnTo}${separator}oauth_success=true`
    const response = NextResponse.redirect(redirectUrl)

    tokenService.setTokenCookies(appTokens, response)
    return response

  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(`${NEXT_BASE_URL}/account/login?error=oauth_callback_failed`)
  }
}
