import { baseApi } from '../../api/baseApi'

// ─── API ───────────────────────────────────────────────────────

export const navbarServicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all category names
    getCategoryNames: builder.query({
      query: () => '/patient/categories-names',
      providesTags: ['Categories'],
    }),

    // ✅ Get products by categoryId
    getProductsByCategory: builder.query({
      query: (categoryId) =>
        `/patient/products-names?categoryId=${categoryId}`,
      providesTags: ['Products'],
    }),
  }),

  overrideExisting: false,
})

// ─── Hooks ─────────────────────────────────────────────────────

export const {
  useGetCategoryNamesQuery,
  useGetProductsByCategoryQuery,
} = navbarServicesApi