/**
 * Redux Store - Centralized State Management
 * All Redux exports are available from this file
 */

// Store
export { store } from './store/store'
export type { RootState, AppDispatch } from './store/store'

// Hooks
export { useAppDispatch, useAppSelector } from './store/hooks'

// Auth Slice & Actions
export { default as authReducer } from './features/auth/authSlice'
export {
  setUser,
  setToken,
  clearAuth,
  setLoading,
  setError,
  hydrate,
} from './features/auth/authSlice'

// Base API
export { baseApi } from './api/baseApi'

// Auth API
export {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
} from './api/authApi'
