import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED_PREFIXES = ['/patient', '/doctor']

// Auth routes — logged-in users should not access these
const AUTH_ROUTES = ['/login', '/receive-otp', '/verify', '/forgot-password', '/reset-password']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token =
    request.cookies.get('authToken')?.value ??
    request.cookies.get('token')?.value ??
    request.cookies.get('accessToken')?.value

  const userRole = request.cookies.get('userRole')?.value?.toUpperCase()

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Helper to build absolute URLs that respect reverse proxies
  const buildRedirectUrl = (targetPath: string) => {
    const url = request.nextUrl.clone()
    url.pathname = targetPath
    
    // Fix for Nginx/Proxies that don't pass the Host header correctly
    const forwardedHost = request.headers.get('x-forwarded-host')
    if (forwardedHost) {
      url.host = forwardedHost
      if (!forwardedHost.includes(':')) {
        url.port = '' // Clear port only if the forwarded host doesn't specify one
      }
    }
    const forwardedProto = request.headers.get('x-forwarded-proto')
    if (forwardedProto) {
      url.protocol = `${forwardedProto}:`
    }
    
    return url
  }

  // Not logged in → trying to access protected route → redirect to login
  if (isProtected && !token) {
    const loginUrl = buildRedirectUrl('/login')
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based access control
  if (token && userRole) {
    const isPatientRoute = pathname.startsWith('/patient')
    const isDoctorRoute = pathname.startsWith('/doctor')

    if (isDoctorRoute && userRole === 'PATIENT') {
      return NextResponse.redirect(buildRedirectUrl('/patient'))
    }

    if (isPatientRoute && (userRole === 'DOCTOR' || userRole === 'PROVIDER')) {
      return NextResponse.redirect(buildRedirectUrl('/doctor'))
    }
  }

  // Already logged in → trying to access auth pages → redirect to appropriate dashboard
  if (isAuthRoute && token) {
    const dashboardPath = (userRole === 'DOCTOR' || userRole === 'PROVIDER') ? '/doctor' : '/patient'
    return NextResponse.redirect(buildRedirectUrl(dashboardPath))
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
