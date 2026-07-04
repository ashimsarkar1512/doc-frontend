import { baseApi } from "../../api/baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactLeadRequest {
  fullName: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  attachments?: File | null;
}

export interface ContactLeadResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  read: boolean;
  responded: boolean;
  attachments: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSideWidgetResponse {
  id: string;
  title: string;
  opening: string;
  offDay: string;
  phone: string;
  email: string;
  imageId: string | null;
  createdAt: string;
  updatedAt: string;
  image: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    context: string;
  } | null;
}

export interface ContactSideWidgetApiResponse {
  success: boolean;
  message: string;
  data: ContactSideWidgetResponse;
}

export interface ContactPartner {
  id: string;
  sectionId: string;
  imageId: string;
  createdAt: string;
  updatedAt: string;
  image: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    context: string;
  } | null;
}

export interface ContactPartnerSectionResponse {
  id: string;
  sectionTitle: string;
  createdAt: string;
  updatedAt: string;
  partners: ContactPartner[];
}

export interface ContactPartnerSectionApiResponse {
  success: boolean;
  message: string;
  data: ContactPartnerSectionResponse;
}

// ─── Contact API ──────────────────────────────────────────────────────────────

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitContactLead: builder.mutation<
      ContactLeadResponse,
      ContactLeadRequest
    >({
      query: (data) => {
        // Build FormData so the backend receives multipart/form-data
        // (required because the `attachments` field is a binary file upload)
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        if (data.phone) formData.append("phone", data.phone);
        if (data.service) formData.append("service", data.service);
        if (data.message) formData.append("message", data.message);
        if (data.attachments) formData.append("attachments", data.attachments);

        return {
          url: "/public/contact-leads",
          method: "POST",
          body: formData,
          // Let the browser set Content-Type with the multipart boundary
          formData: true,
        };
      },
      invalidatesTags: ["ContactLead"],
    }),
    getContactSideWidget: builder.query<ContactSideWidgetResponse, void>({
      query: () => '/website-manage/contact-side-widget',
      transformResponse: (response: ContactSideWidgetApiResponse) => response.data,
    }),
    getContactPartnerSection: builder.query<ContactPartnerSectionResponse, void>({
      query: () => '/website-manage/contact-partner-section',
      transformResponse: (response: ContactPartnerSectionApiResponse) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const { useSubmitContactLeadMutation, useGetContactSideWidgetQuery, useGetContactPartnerSectionQuery } = contactApi;
