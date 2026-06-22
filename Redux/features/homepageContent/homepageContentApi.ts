import { baseApi } from '../../api/baseApi'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MediaFile {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  context: string
  uploadedById: string | null
  createdAt: string
  updatedAt: string
}

export interface HowItWorksStep {
  id: string
  homePageContentId: string
  title: string
  description: string | null
  iconId: string | null
  icon: MediaFile | null
  iconUrl: string | null
  order: number
  createdAt: string
  updatedAt: string
}

export interface FAQ {
  id: string
  homePageContentId: string
  question: string
  answer: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface HomepageContent {
  id: string
  heroImageId: string | null
  heroImage: MediaFile | null
  heroImageUrl: string | null
  heroBadgeImageId: string | null
  heroBadgeImage: MediaFile | null
  heroBadgeImageUrl: string | null
  heroBadgeText: string | null
  heroBadgeLink: string | null
  heroTitle: string | null
  heroDescription: string | null
  heroButtonText: string | null
  heroButtonLink: string | null
  heroButtonNewTab: boolean
  bannerTitle: string | null
  bannerDescription: string | null
  aboutSubtitle: string | null
  aboutTitle: string | null
  aboutDescription: string | null
  aboutPrimaryButtonText: string | null
  aboutPrimaryButtonLink: string | null
  aboutPrimaryButtonNewTab: boolean
  aboutSecondaryButtonText: string | null
  aboutSecondaryButtonLink: string | null
  aboutSecondaryButtonNewTab: boolean
  aboutBullets: string[]
  productTitle: string | null
  productButtonLink: string | null
  productButtonNewTab: boolean
  howItWorksTitle: string | null
  howItWorksSteps: HowItWorksStep[]
  testimonialTitle: string | null
  testimonialSubtitle: string | null
  testimonialDescription: string | null
  testimonialButtonLink: string | null
  testimonialButtonNewTab: boolean
  pricingTitle: string | null
  pricingSubtitle: string | null
  pricingDescription: string | null
  pricingButtonLink: string | null
  pricingButtonNewTab: boolean
  faqs: FAQ[]
  createdAt: string
  updatedAt: string
}

export interface HomepageContentResponse {
  success: boolean
  statusCode: number
  message: string
  data: HomepageContent
}

// ─── API ──────────────────────────────────────────────────────────────────────

const homepageContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomepageContent: builder.query<HomepageContent, void>({
      query: () => '/admin/homepage-content',
      providesTags: ['HomepageContent'],
      transformResponse: (response: HomepageContentResponse | HomepageContent) => {
        if ('data' in response && response.data && typeof response.data === 'object') {
          return (response as HomepageContentResponse).data
        }
        return response as HomepageContent
      },
    }),
  }),
})

export const { useGetHomepageContentQuery } = homepageContentApi
export default homepageContentApi
