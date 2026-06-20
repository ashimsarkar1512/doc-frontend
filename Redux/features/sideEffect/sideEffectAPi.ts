import baseApi from "@/Redux/api/baseApi";

// ─── Shared Types ────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
}

export interface Doctor {
  id: string;
  fullName: string;
  status: string;
  roleTitle?: string;
  email?: string;
  thumbnail?: string | null;
}

export interface AttachmentData {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

// ─── Side Effect Types ───────────────────────────────────────────────────────

export interface SideEffectReportPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  serviceId?: string;
  providerId?: string;
  severity: "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING";
  description: string;
  status: "PENDING";
  attachmentIds: string[];
}

export interface SideEffectReportResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  severity: "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING";
  status: "PENDING" | "RESOLVED" | "IN_REVIEW";
  description: string;
  serviceId: string;
  service: { id: string; name: string };
  providerId: string;
  provider: { id: string; name: string };
  attachments: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    context: string;
    uploadedById: object;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Doctors API commonly wraps list in data.data
export interface DoctorsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: Doctor[];
    meta?: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const sideEffectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Categories / Services
    getCategoriesNames: builder.query<{ data: Category[] }, void>({
      query: () => ({
        url: "/patient/categories-names",
        method: "GET",
      }),
    }),

    // Active Providers / Doctors
    getActiveProviders: builder.query<
      DoctorsApiResponse,
      { status?: "ACTIVE" | "INACTIVE"; page?: number; limit?: number }
    >({
      query: ({ status = "ACTIVE", page = 1, limit = 100 } = {}) => ({
        url: "/admin/doctors",
        method: "GET",
        params: { status, page, limit },
      }),
    }),

    // Upload Attachment
    uploadAttachment: builder.mutation<{ data: AttachmentData }, FormData>({
      query: (formData) => ({
        url: "/attachments/upload",
        method: "POST",
        body: formData,
      }),
    }),

    // Submit Side Effect Report
    submitSideEffectReport: builder.mutation<
      SideEffectReportResponse,
      SideEffectReportPayload
    >({
      query: (data) => ({
        url: "/compliance/side-effect-reports",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCategoriesNamesQuery,
  useGetActiveProvidersQuery,
  useUploadAttachmentMutation,
  useSubmitSideEffectReportMutation,
} = sideEffectApi;