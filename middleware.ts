import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED_PREFIXES = ['/patient', '/doctor']

// Auth routes — logged-in users should not access these
const AUTH_ROUTES = ['/login', '/receive-otp', '/verify', '/forgot-password', '/reset-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token =
    request.cookies.get('authToken')?.value ??
    request.cookies.get('token')?.value ??
    request.cookies.get('accessToken')?.value

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Not logged in → trying to access protected route → redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in → trying to access auth pages → redirect to patient dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/patient', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/patient/:path*',
    '/doctor/:path*',
    '/login',
    '/receive-otp',
    '/verify',
    '/forgot-password',
    '/reset-password',
  ],
}
