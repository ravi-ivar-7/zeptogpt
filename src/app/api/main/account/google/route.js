import { NextResponse } from 'next/server'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const NEXT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const GOOGLE_REDIRECT_URI = `${NEXT_BASE_URL}/api/main/account/google/callback`

// Initiate Google OAuth
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'login'
    const returnTo = searchParams.get('returnTo')
    console.log(returnTo, 'return')
    
    const stateData = {
      action,
      returnTo,
      timestamp: Date.now()
    }
    
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID)
    googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope', 'openid email profile')
    googleAuthUrl.searchParams.set('state', JSON.stringify(stateData))
    googleAuthUrl.searchParams.set('access_type', 'offline')
    googleAuthUrl.searchParams.set('prompt', 'consent')

    return NextResponse.redirect(googleAuthUrl.toString())
  } catch (error) {
    console.error('Google OAuth initiation error:', error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: null,
        error: 'Failed to initiate Google OAuth',
        meta: {
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }
}
