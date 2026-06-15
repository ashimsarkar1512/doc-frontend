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
  inputType: string | null
  subQuestions: Question[]
}

export interface Question {
  id: string
  type: 'INFORMATION_ONLY' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'INPUT'
  heading: string
  media: string
  questionText: string
  description: string | null
  contentAlignment: 'LEFT' | 'CENTER' | 'RIGHT'
  isRequired: boolean
  options: QuestionOption[]
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
    getAssessmentById: builder.query<{ success: boolean; data: AssessmentDetail }, string>({
      query: (id) => `/admin/assessments/${id}`,
    }),
  }),
})

export const { useGetCategoriesNamesQuery, useGetCategoriesQuery, useGetAssessmentByIdQuery } = patientApi
export default patientApi
