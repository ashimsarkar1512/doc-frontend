import { baseApi } from '../../api/baseApi'
import type { Discount, DiscountsResponse } from '@/types/discountTypes'

// ─── API ──────────────────────────────────────────────────────────────────────

const discountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDiscounts: builder.query<DiscountsResponse, void>({
      query: () => '/admin/discounts',
      providesTags: ['Discounts'],
    }),
  }),
})

export const { useGetDiscountsQuery } = discountsApi
export default discountsApi
