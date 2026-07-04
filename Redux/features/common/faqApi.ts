import { baseApi } from '../../api/baseApi'
import type { HeroSectionPageType } from './heroSectionApi'

export interface FaqItem {
  id: string
  faqId: string
  question: string
  answer: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface FaqSection {
  id: string
  sectionTitle: string
  pageType: HeroSectionPageType
  createdAt: string
  updatedAt: string
  faqs: FaqItem[]
}

export interface FaqResponse {
  success: boolean
  message: string
  data: FaqSection
}

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqByPageType: builder.query<FaqSection, HeroSectionPageType>({
      query: (pageType) => ({
        url: '/faq',
        method: 'GET',
        params: { pageType },
      }),
      providesTags: ['Faq'],
      transformResponse: (response: FaqResponse) => ({
        ...response.data,
        faqs: [...response.data.faqs].sort((a, b) => a.order - b.order),
      }),
    }),
  }),
})

export const { useGetFaqByPageTypeQuery } = faqApi
export default faqApi
