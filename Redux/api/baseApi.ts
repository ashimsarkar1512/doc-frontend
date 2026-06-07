import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pre.weightlossmdcherrycreek.com',
  credentials: 'include',
  prepareHeaders: (headers) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
    }
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery,
  tagTypes: ['Auth', 'User', 'Chat', 'Message', 'Consultation'],
  endpoints: () => ({}),
})

export default baseApi
