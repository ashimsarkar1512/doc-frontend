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

export interface FeaturedService {
  id: string
  name: string
  slug: string
}

export interface HomepageContent {
  id: string
  heroMediaId: string | null
  heroMedia: MediaFile | null
  heroBadgeImageId: string | null
  heroBadgeImage: MediaFile | null
  heroBadgeText: string | null
  heroBadgeLink: string | null
  heroTitle: string | null
  heroDescription: string | null
  heroButtonText: string | null
  heroButtonLink: string | null
  heroButtonNewTab: boolean

  assessmentTitle: string | null
  assessmentDescription: string | null

  aboutTitle: string | null
  aboutDescription: string | null
  aboutFeaturedService1Id: string | null
  aboutFeaturedService1: FeaturedService | null
  aboutFeaturedService2Id: string | null
  aboutFeaturedService2: FeaturedService | null
  aboutFeaturedService3Id: string | null
  aboutFeaturedService3: FeaturedService | null
  aboutButtonText: string | null
  aboutButtonLink: string | null
  aboutButtonNewTab: boolean
  aboutMediaId: string | null
  aboutMedia: MediaFile | null

  providersTitle: string | null
  providersButtonText: string | null
  providersButtonLink: string | null
  providersButtonNewTab: boolean

  howItWorksTitle: string | null
  howItWorksStep1Title: string | null
  howItWorksStep1Description: string | null
  howItWorksStep2Title: string | null
  howItWorksStep2Description: string | null
  howItWorksStep3Title: string | null
  howItWorksStep3Description: string | null
  howItWorksStep4Title: string | null
  howItWorksStep4Description: string | null

  testimonialTitle: string | null
  testimonialCardTitle: string | null
  testimonialCardDescription: string | null
  testimonialButtonText: string | null
  testimonialButtonLink: string | null
  testimonialButtonNewTab: boolean

  faqTitle: string | null
  faqCardTitle: string | null
  faqCardDescription: string | null
  faqButtonText: string | null
  faqButtonLink: string | null
  faqButtonNewTab: boolean
  faqCardMediaId: string | null
  faqCardMedia: MediaFile | null
  faqQuestion1: string | null
  faqAnswer1: string | null
  faqQuestion2: string | null
  faqAnswer2: string | null
  faqQuestion3: string | null
  faqAnswer3: string | null
  faqQuestion4: string | null
  faqAnswer4: string | null
  faqQuestion5: string | null
  faqAnswer5: string | null
  faqQuestion6: string | null
  faqAnswer6: string | null

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
