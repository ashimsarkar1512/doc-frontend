import { baseApi } from '../../api/baseApi'

export type HeroSectionPageType =
  | 'ServiceCategory'
  | 'Blog'
  | 'BlogDetail'
  | 'LabTest'
  | 'MedicalTeam'
  | 'HowItWorks'
  | 'Eligiblity'
  | 'Coverage'
  | 'Faq'
  | 'BillingCancellation'
  | 'ShippingInfo'
  | 'AboutUs'
  | 'ContactUs'
  | 'PrivacyPolicy'
  | 'TermsOfService'
  | 'HippaNotice'
  | 'ReportSideEffect'
  | 'RequestRecord'

export interface HeroSection {
  id: string
  title: string
  description: string
  page: HeroSectionPageType
  createdAt: string
  updatedAt: string
}

export interface HeroSectionsResponse {
  success: boolean
  message: string
  data: HeroSection[]
}

export interface CtaSection {
  id: string
  page: HeroSectionPageType
  categoryId: string | null
  sectionTitle: string
  ctaButtonText: string
  url: string
  openInNewTab: boolean
  createdAt: string
  updatedAt: string
}

export interface CtaSectionsResponse {
  success: boolean
  message: string
  data: CtaSection[]
}

export interface GetCtaSectionsParams {
  pageType: HeroSectionPageType
  categoryId?: string
}

const heroSectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHeroSections: builder.query<HeroSection[], HeroSectionPageType>({
      query: (pageType) => ({
        url: '/hero-section',
        method: 'GET',
        params: { pageType },
      }),
      providesTags: ['HeroSections'],
      transformResponse: (response: HeroSectionsResponse) => response.data,
    }),
    getCtaSections: builder.query<CtaSection[], GetCtaSectionsParams>({
      query: ({ pageType, categoryId }) => ({
        url: '/cta-section',
        method: 'GET',
        params: {
          pageType,
          ...(categoryId ? { categoryId } : {}),
        },
      }),
      providesTags: ['CtaSections'],
      transformResponse: (response: CtaSectionsResponse) => response.data,
    }),
  }),
})

export const { useGetHeroSectionsQuery, useGetCtaSectionsQuery } = heroSectionApi
export default heroSectionApi
