import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Allow these paths
  const allowedPaths = [
    '/',
    '/coming-soon',
    '/company/about',
    '/_next',
    '/api',
    '/favicon.ico',
  ]
  
  // Check if the path should be allowed
  const isAllowed = allowedPaths.some(path => 
    pathname === path || pathname.startsWith(path)
  )
  
  // If not allowed and not already on coming-soon, redirect
  if (!isAllowed && pathname !== '/coming-soon') {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
