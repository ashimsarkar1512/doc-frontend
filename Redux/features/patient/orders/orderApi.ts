import baseApi from "@/Redux/api/baseApi";
import { MyOrdersResponse, OrderStatus, OrderDateRange } from "@/types/orderTypes";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<MyOrdersResponse, { status?: string; dateRange?: string }>({
      query: (params) => ({
        url: "/my-orders",
        params: {
          ...(params.status && params.status !== "ALL" ? { status: params.status } : {}),
          ...(params.dateRange && params.dateRange !== "ALL" ? { dateRange: params.dateRange } : {}),
        },
      }),
      providesTags: ["Orders"],
    }),
    getMyOrderById: builder.query<any, string>({
      query: (id) => `/my-orders/${id}`,
      providesTags: ["Orders"],
    }),
  }),
});

export const { useGetMyOrdersQuery, useGetMyOrderByIdQuery } = orderApi;
export default orderApi;
