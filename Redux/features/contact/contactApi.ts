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
          url: "/admin/contact-leads",
          method: "POST",
          body: formData,
          // Let the browser set Content-Type with the multipart boundary
          formData: true,
        };
      },
      invalidatesTags: ["ContactLead"],
    }),
  }),
  overrideExisting: false,
});

export const { useSubmitContactLeadMutation } = contactApi;
