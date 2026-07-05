/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from '../../api/baseApi'

// ─── API ───────────────────────────────────────────────────────

export const footerDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get Website Settings
    getWebsiteSettings: builder.query<any, void>({
      query: () => ({
        url: '/public/website-settings',
        method: 'GET',
      }),
      providesTags: ['WebsiteSettings'],
    }),

    // ✅ Subscribe to Newsletter
    subscribeNewsletter: builder.mutation<any, { email: string }>({
      query: (data) => ({
        url: '/public/newsletter',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

// ─── Hooks ─────────────────────────────────────────────────────

export const { useGetWebsiteSettingsQuery, useSubscribeNewsletterMutation } = footerDataApi