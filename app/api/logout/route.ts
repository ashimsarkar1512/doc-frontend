import { NextResponse } from 'next/server'

/**
 * GET /api/logout
 * Clears all auth-related cookies (both our own and server-set ones)
 * then redirects to /login. Because this runs server-side, the cookies
 * are expired in the response headers before the browser follows the
 * redirect — so middleware sees no token on the very next request.
 */
export async function POST(request: Request) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })

  const cookiesToClear = [
    'authToken',   // our own cookie
    'token',       // server-set cookie
    'refreshToken', // server-set refresh cookie
    'accessToken', // server-set access cookie
    'userRole'     // role cookie
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

export async function GET(request: Request) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })

  const cookiesToClear = [
    'authToken',
    'token',
    'refreshToken',
    'accessToken',
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
