import baseApi from "@/Redux/api/baseApi";

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    TotalDraft: number;
    TotalPending: number;
    TotalReviewed: number;
    TotalApproved: number;
    TotalRefilRequested: number;
    TotalDeclined: number;
    TotalPayment: number;
  };
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
export default dashboardApi;
