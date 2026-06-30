import { useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { clearAuth } from '../features/auth/authSlice'
import { baseApi } from '../api/baseApi'
import { useRouter } from 'next/navigation'

export function useLogout() {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const logout = async () => {
    setIsLoading(true)
    try {
      // Call the real logout API — fire and forget, don't block on failure
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${
              typeof window !== 'undefined'
                ? localStorage.getItem('authToken') ?? ''
                : ''
            }`,
          },
        }
      )
    } catch (error) {
      // API failure should never block logout
    } finally {
      // 1. Clear Redux state + localStorage + document cookies
      dispatch(clearAuth())
      // 2. Reset all RTK Query cache
      dispatch(baseApi.util.resetApiState())
      // 3. Hit the server-side route which clears HttpOnly/server cookies
      await fetch('/api/logout', { method: 'POST' })
      //    and redirects to /login — this guarantees middleware sees no token
      router.push('/login')
    }
  }

  return { logout, isLoading }
}
