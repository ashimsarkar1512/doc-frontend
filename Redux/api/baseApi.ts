import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store/store'

// ─── Base query ───────────────────────────────────────────────────────────────

const getBaseUrl = () => {
  let envUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://prod.weightlossmdcherrycreek.com";
  envUrl = envUrl.replace(/\/$/, "");
  if (!envUrl.includes("/api/v1")) {
    envUrl = `${envUrl}/api/v1`;
  }
  return envUrl;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
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
  tagTypes: ['Auth', 'User', 'Chat', 'Message', 'Consultation', 'ContactLead','Categories','Products','DoctorDashboard','Consultations','Patient', 
    'Dashboard','Orders','Cart','HomepageContent','WebsiteSettings','Notifications','Doctors', 'Testimonials', 'Discounts', 'HeroSections', 'CtaSections', 'CoverageSection', 'Faq', 'Eligibility', 'ShippingInfo', 'BillingCancellation'],
  endpoints: () => ({}),
})

export default baseApi
