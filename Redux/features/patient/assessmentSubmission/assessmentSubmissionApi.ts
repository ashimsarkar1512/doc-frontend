import baseApi from "@/Redux/api/baseApi";

export interface MyAssessmentSubmission {
  id: string;
  submissionCode: string;
  status: string;
  createdAt: string;
  assessment: {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    category: {
      id: string;
      name: string;
    } | null;
  };
  reviewedBy: {
    id: string;
    name: string;
  } | null;
  doctorNotes: string | null;
}

export interface MyAssessmentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  submissions: MyAssessmentSubmission[];
  counts: {
    ACCEPTED?: number;
    PENDING?: number;
    REFIL_REQUESTED?: number;
    REJECTED?: number;
    DRAFT?: number;
    REVIEWED?: number;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const assessmentSubmissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyAssessments: builder.query<MyAssessmentsResponse, { status?: string }>({
      query: (params) => ({
        url: "/patient/assessment-submissions/my-assessment",
        params: params.status && params.status !== "History" ? { status: params.status } : undefined,
      }),
      providesTags: ["Consultations"],
    }),
    getMyAssessmentById: builder.query<any, string>({
      query: (id) => `/patient/assessment-submissions/my-assessment/${id}`,
      providesTags: ["Consultations"],
    }),
  }),
});

export const { useGetMyAssessmentsQuery, useGetMyAssessmentByIdQuery } = assessmentSubmissionApi;
export default assessmentSubmissionApi;
