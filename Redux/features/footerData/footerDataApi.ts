/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from '../../api/baseApi'

// ─── API ───────────────────────────────────────────────────────

export const footerDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get Website Settings
    getWebsiteSettings: builder.query<any, void>({
      query: () => ({
        url: '/admin/website-settings',
        method: 'GET',
      }),
      providesTags: ['WebsiteSettings'],
    }),
  }),

  
})

// ─── Hooks ─────────────────────────────────────────────────────

export const { useGetWebsiteSettingsQuery } = footerDataApi