'use client'

import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/Redux/store/store'
import { tokenStorage, hydrateToken } from '@/Redux/features/auth/authSlice'

/**
 * Runs once on the client after mount.
 * Reads the token from localStorage and puts it into Redux state
 * without causing a server/client hydration mismatch.
 */
function AuthHydrator() {
  useEffect(() => {
    const token = tokenStorage.get()
    if (token) {
      store.dispatch(hydrateToken(token))
    }
  }, [])

  return null
}

interface ReduxProviderProps {
  children: React.ReactNode
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  )
}
