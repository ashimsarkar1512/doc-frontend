import { NextResponse } from 'next/server'

/**
 * GET /api/logout
 * Clears all auth-related cookies (both our own and server-set ones)
 * then redirects to /login. Because this runs server-side, the cookies
 * are expired in the response headers before the browser follows the
 * redirect — so middleware sees no token on the very next request.
 */
export async function GET(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const response = NextResponse.redirect(new URL('/login', appUrl))

  const cookiesToClear = [
    'authToken',   // our own cookie
    'token',       // server-set cookie
    'refreshToken', // server-set refresh cookie
    'accessToken', // fallback name
  ]

  cookiesToClear.forEach((name) => {
    response.cookies.set(name, '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
    })
  })

  return response
}
