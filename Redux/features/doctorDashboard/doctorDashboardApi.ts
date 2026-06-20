import { baseApi } from "@/Redux/api/baseApi";

const doctorDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET DASHBOARD STATS
    getDoctorDashboardStats: builder.query({
      query: () => ({
        url: "/doctor/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["DoctorDashboard"],
    }),

    // ✅ GET MY CONSULTATIONS (with params)
    getMyConsultations: builder.query({
      query: (params) => ({
        url: "/doctor/my-consultation",
        method: "GET",
        params, // { tab, page, limit }
      }),
      providesTags: ["Consultations"],
    }),

    // ✅ GET SINGLE CONSULTATION BY ID
    getConsultationById: builder.query({
      query: (id) => ({
        url: `/doctor/my-consultation/${id}`,
        method: "GET",
      }),
      providesTags: ["Consultations"],
    }),

    // ✅ UPDATE CONSULTATION STATUS
    updateConsultationStatus: builder.mutation({
      query: ({ id, body }) => ({
        url: `/doctor/my-consultation/status/${id}`,
        method: "PATCH",
        body, // { status, doctorNotes }
      }),
      invalidatesTags: ["Consultations", "DoctorDashboard"],
    }),
  }),
});

export const {
  useGetDoctorDashboardStatsQuery,
  useGetMyConsultationsQuery,
  useGetConsultationByIdQuery,
  useUpdateConsultationStatusMutation,
} = doctorDashboardApi;
