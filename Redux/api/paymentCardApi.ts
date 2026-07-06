import { baseApi } from "./baseApi";

export const paymentCardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentCards: builder.query<any, void>({
      query: () => ({
        url: "/payment-cards",
        method: "GET",
      }),
      providesTags: ["PaymentCards"],
    }),
    createPaymentCard: builder.mutation<any, any>({
      query: (data) => ({
        url: "/payment-cards",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PaymentCards"],
    }),
    setDefaultPaymentCard: builder.mutation<any, string>({
      query: (id) => ({
        url: `/payment-cards/${id}/default`,
        method: "PATCH",
      }),
      invalidatesTags: ["PaymentCards"],
    }),
    updatePaymentCard: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/payment-cards/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PaymentCards"],
    }),
    deletePaymentCard: builder.mutation<any, string>({
      query: (id) => ({
        url: `/payment-cards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentCards"],
    }),
  }),
});

export const {
  useGetPaymentCardsQuery,
  useCreatePaymentCardMutation,
  useSetDefaultPaymentCardMutation,
  useUpdatePaymentCardMutation,
  useDeletePaymentCardMutation,
} = paymentCardApi;
