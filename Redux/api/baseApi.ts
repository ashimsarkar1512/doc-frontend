import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store/store'

// ─── Base query ───────────────────────────────────────────────────────────────

const rawBaseQuery = fetchBaseQuery({
  // baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  baseUrl: "https://prod.weightlossmdcherrycreek.com/api/v1",
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // Read the token directly from Redux state instead of localStorage
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// ─── Base query with re-auth ───────────────────────────────────────────────────
// Intercepts 401 responses. Extend this to handle token refresh if needed.

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    // Token is expired or invalid — clear auth state
    const { clearAuth } = await import('../features/auth/authSlice')
    api.dispatch(clearAuth())
  }

  return result
}

// ─── Base API ─────────────────────────────────────────────────────────────────

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Chat', 'Message', 'Consultation', 'ContactLead','Categories','Products','DoctorDashboard','Consultations','Patient', 'Dashboard','Orders','Cart','HomepageContent','WebsiteSettings','Notifications'],
  endpoints: () => ({}),
})

export default baseApi
