import { baseApi } from '../../api/baseApi'

export interface Testimonial {
  id: string
  clientName?: string
  author?: string // depending on backend naming
  createdAt: string
  date?: string
  rating: number
  content?: string
  text?: string
  feedback?:string
}

export interface TestimonialMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface TestimonialsResponse {
  data: Testimonial[]
  meta: TestimonialMeta
}

const testimonialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<TestimonialsResponse, void>({
      query: () => '/admin/testimonials',
      providesTags: ['Testimonials'],
    }),
  }),
})

export const { useGetTestimonialsQuery } = testimonialsApi
export default testimonialsApi
