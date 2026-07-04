import { baseApi } from '../../api/baseApi'

export interface EligibilityPoint {
  point: string
  status: boolean
}

export interface EligibilityFaq {
  question: string
  answer: string
}

export interface EligibilityContent {
  id: string
  generalTitle: string
  generalPoints: EligibilityPoint[]
  generalBottomDesc: string
  qualificationTitle: string
  qualificationbmi27Text: string
  qualification27Description: string
  qualificationbmi30Text: string
  qualification30Description: string
  weightConditionSecTitle: string
  weightConditions: string[]
  contraindicationsSectionTitle: string
  contraindicationsSectionWrite: string[]
  requiredlabWorkSectionTitle: string
  requiredlabWorkSectionContraindications: string[]
  ongoingMonitoringSectionTitle: string
  ongoingMonitoringSectionContraindication: string[]
  disclaimerSectionTitle: string
  disclaimerSectionDes: string
  faqTitle: string
  faqs: EligibilityFaq[]
  createdAt: string
  updatedAt: string
}

export interface EligibilityResponse {
  success: boolean
  message: string
  data: EligibilityContent
}


const eligiblityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEligibilityContent: builder.query<EligibilityContent, void>({
      query: () => ({
        url: '/website-manage/eligibility',
        method: 'GET',
      }),
      providesTags: ['Eligibility'],
      transformResponse: (response: EligibilityResponse) => response.data,
    }),
  }),
})

export const { useGetEligibilityContentQuery } = eligiblityApi
export default eligiblityApi
