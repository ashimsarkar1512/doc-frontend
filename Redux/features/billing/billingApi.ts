import { baseApi } from '../../api/baseApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BillingTimelineStep {
  step: string;
  description: string;
}

export interface BillingFaqItem {
  question: string;
  answer: string;
}

export interface BillingCancellationData {
  id: string;
  page: string;
  timelineTitle: string;
  timelineSteps: BillingTimelineStep[];
  timelineDisclaimerTitle: string;
  timelineDisclaimerDescription: string;
  cancelTitle: string;
  cancelDescription: string;
  cancelSteps: string[];
  refundEligibleTitle: string;
  refundEligibleConditions: string[];
  refundNotEligibleTitle: string;
  refundNotEligibleConditions: string[];
  faqTitle: string;
  faqs: BillingFaqItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BillingCancellationResponse {
  success: boolean;
  message: string;
  data: BillingCancellationData;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBillingCancellation: builder.query<BillingCancellationData, void>({
      query: () => ({
        url: '/website-manage/billing-cancellation',
        method: 'GET',
      }),
      providesTags: ['BillingCancellation'],
      transformResponse: (response: BillingCancellationResponse) => response.data,
    }),
  }),
});

export const { useGetBillingCancellationQuery } = billingApi;
export default billingApi;
