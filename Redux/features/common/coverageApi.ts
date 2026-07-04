import { baseApi } from '../../api/baseApi'

export interface CoverageSection {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface CoverageSectionResponse {
  success: boolean
  message: string
  data: CoverageSection
}

export interface CoverageCategoryAssessment {
  id: string
  title: string
  image: string
}

export interface CoverageCategory {
  id: string
  name: string
  assessments: CoverageCategoryAssessment[]
}

export interface CoverageCategoriesResponse {
  success: boolean
  statusCode: number
  message: string
  data: CoverageCategory[]
}

export interface StateCoverageCategory {
  id: string
  name: string
}

export interface StateCoverageAvailability {
  id: string
  stateCode: string
  stateName: string
  status: string
  isComingSoon: boolean
  allowedCategories: StateCoverageCategory[]
  restrictedCategories: StateCoverageCategory[]
  createdAt: string
  updatedAt: string
}

export interface CheckAvailabilityParams {
  categoryId?: string
  stateId?: string
}

const coverageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoverageSection: builder.query<CoverageSection, void>({
      query: () => ({
        url: '/website-manage/coverage-section',
        method: 'GET',
      }),
      providesTags: ['CoverageSection'],
      transformResponse: (response: CoverageSectionResponse) => response.data,
    }),
    getCoverageCategories: builder.query<CoverageCategory[], void>({
      query: () => ({
        url: '/patient/categories-names',
        method: 'GET',
      }),
      providesTags: ['Categories'],
      transformResponse: (response: CoverageCategoriesResponse) => response.data,
    }),
    checkStateCoverageAvailability: builder.query<
      StateCoverageAvailability[],
      CheckAvailabilityParams | void
    >({
      query: (params) => ({
        url: '/compliance/state-coverages/check-availability',
        method: 'GET',
        params: {
          ...(params?.categoryId ? { categoryId: params.categoryId } : {}),
          ...(params?.stateId ? { stateId: params.stateId } : {}),
        },
      }),
      providesTags: ['CoverageSection'],
    }),
  }),
})

export const {
  useGetCoverageSectionQuery,
  useGetCoverageCategoriesQuery,
  useCheckStateCoverageAvailabilityQuery,
} = coverageApi
export default coverageApi
