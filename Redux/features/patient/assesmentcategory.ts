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

export interface Product {
  id: string
  name: string
  description: string
  price: string
  image: string
}

export interface ProductCategoryData {
  categoryId: string
  categoryName: string
  assessments: { id: string; title: string }[]
  products: Product[]
}

export interface ProductsResponse {
  success: boolean
  statusCode: number
  message: string
  data: ProductCategoryData[]
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartProductImage {
  id: string
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
}

export interface CartProductVariant {
  id: string
  size?: string
  price?: string
}

export interface CartProduct {
  id: string
  name: string
  description: string
  variants: CartProductVariant[]
  images: CartProductImage[]
}

export interface CartItem {
  id: string
  quantity: number
  size: string | null
  unitPrice: string
  itemTotal: string
  product: CartProduct
  createdAt: string
  updatedAt: string
}

export interface Cart {
  id: string
  totalItem: number
  totalPrice: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export interface CartResponse {
  success: boolean
  statusCode: number
  message: string
  data: Cart
}

export interface CartSummary {
  subtotal: string
  serviceDuration: string
  serviceFees: string
  shippingCharge: string
  discount: string
  discountMeta: string | null
  total: string
}

export interface CartSummaryResponse {
  success: boolean
  statusCode: number
  message: string
  data: CartSummary
}

export interface AddToCartRequest {
  productId: string
}

export interface UpdateCartItemRequest {
  id: string
  quantity?: number
  size?: string
}

export interface CheckoutRequest {
  submissionId: string
  shippingInfo: {
    fullName: string
    contactNumber: string
    address: string
    city: string
    state: string
    zip: string
  }
  paymentInfo: {
    method: string
    cardHolderName: string
    cardNumber: string
    expiredDate: string
    cvv: string
  }
  complianceConfirmation: {
    agreedToTermsAndPrivacy: boolean
    certifiedInfoAccurate: boolean
    understoodFalseInfoConsequences: boolean
    understoodRecommendationsBasis: boolean
    understoodAdditionalInfoMayBeRequested: boolean
  }
  discountCode?: string
  isRecurring: boolean
  billingCycle: string
}

export interface CheckoutResponse {
  success: boolean
  statusCode: number
  message: string
  data: any
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

export interface AssessmentSubmissionResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    submissionId: string
    submissionCode: string
    status: string
    isEditable: boolean
    assessment: {
      id: string
      title: string
      thumbnail: string | null
      category: string
    }
    reviewedBy: string | null
    doctorNotes: string | null
    questions: any[]
    complianceConfirmation: any
    paymentSummary: any
  }
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
    submitAssessment: builder.mutation<any, any>({
      query: (body) => ({
        url: '/patient/assessment-submissions',
        method: 'POST',
        body,
      }),
    }),
    getProductsByCategoryId: builder.query<ProductsResponse, string>({
      query: (categoryId) => ({
        url: '/patient/products',
        params: { categoryId },
      }),
    }),
    addToCart: builder.mutation<CartResponse, AddToCartRequest>({
      query: (body) => ({
        url: '/patient/cart/add-cart',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    getMyCart: builder.query<CartResponse, void>({
      query: () => '/patient/cart/my-carts',
      providesTags: ['Cart'],
    }),
    getCartSummary: builder.query<CartSummaryResponse, void>({
      query: () => '/patient/cart/summary',
      providesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/patient/cart/remove-cart/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<CartResponse, UpdateCartItemRequest>({
      query: ({ id, ...body }) => ({
        url: `/patient/cart/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    checkout: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: '/patient/payment/checkout',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    getMyAssessmentSubmissionById: builder.query<AssessmentSubmissionResponse, string>({
      query: (id) => `/patient/assessment-submissions/my-assessment/${id}`,
    }),
    editAssessmentSubmission: builder.mutation<any, { id: string; answers: any[] }>({
      query: ({ id, answers }) => ({
        url: `/patient/assessment-submissions/${id}`,
        method: 'PATCH', // Assuming PATCH based on common REST, though user said PUT/PATCH. The user used PUT/PATCH, I'll use PATCH.
        body: { answers },
      }),
    }),
  }),
})

export const {
  useGetCategoriesNamesQuery,
  useGetCategoriesQuery,
  useGetAssessmentByIdQuery,
  useSubmitAssessmentMutation,
  useGetProductsByCategoryIdQuery,
  useAddToCartMutation,
  useGetMyCartQuery,
  useGetCartSummaryQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useCheckoutMutation,
  useGetMyAssessmentSubmissionByIdQuery,
  useEditAssessmentSubmissionMutation,
} = patientApi
export default patientApi
