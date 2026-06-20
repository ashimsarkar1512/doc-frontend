import { baseApi } from '../../api/baseApi'

export interface Assessment {
  id: string
  title: string
  thumbnail: string | null
  description: string | null
  status: string
  paymentPlan?: {
    price: string
    billingCycle: string
  } | null
}

export interface QuestionOption {
  id: string
  label: string
  placeholder: string | null
  inputType: 'text' | 'number' | 'file' | string | null
  subQuestions?: Question[]
}

export interface Question {
  id: string;
  assessmentId: string;
  type: 'INFORMATION_ONLY' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'INPUT'
  heading: string | null;
  media: string | null;
  questionText: string | null;
  description: string | null
  contentAlignment: 'LEFT' | 'CENTER' | 'RIGHT'
  isRequired: boolean
  options: QuestionOption[]
  parentOptionId: string | null;
  createdAt?: string
  updatedAt?: string
}

export interface AssessmentDetail {
  id: string
  title: string
  thumbnail: string | null
  description: string | null
  status: string
  category: { id: string; name: string }
  questions: Question[]
  totalQuestions: number
}

interface AssessmentDetailResponse {
  success?: boolean
  data?: AssessmentDetail
}

export interface Category {
  id: string
  name: string
  description: string | null
  paymentPlan: {
    id: string
    price: string
    billingCycle: string
    categoryId: string
    createdAt: string
    updatedAt: string
  } | null
  assessments: Assessment[]
}

export interface CategoriesResponse {
  success: boolean
  data: Category[]
}

export interface CategoryNamesResponse {
  success: boolean
  data: { id: string; name: string }[]
}

const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategoriesNames: builder.query<CategoryNamesResponse, void>({
      query: () => '/patient/categories-names',
    }),
    getCategories: builder.query<CategoriesResponse, string | undefined>({
      query: (name) => ({
        url: '/patient/categories',
        params: name ? { name } : undefined,
      }),
    }),
    getAssessmentById: builder.query<AssessmentDetail, string>({
      query: (id) => `/admin/assessments/${id}`,
      transformResponse: (response: AssessmentDetail | AssessmentDetailResponse) =>
        'data' in response && response.data ? response.data : response as AssessmentDetail,
    }),
  }),
})

export const { useGetCategoriesNamesQuery, useGetCategoriesQuery, useGetAssessmentByIdQuery } = patientApi
export default patientApi
