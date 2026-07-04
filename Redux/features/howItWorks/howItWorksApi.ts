import { baseApi } from "../../api/baseApi";

export interface HowItWorksStep {
  id?: string;
  title: string;
  timeline: string;
  description: string;
}

export interface HowItWorksFaq {
  id?: string;
  question: string;
  answer: string;
}

export interface HowItWorksResponse {
  id: string;
  sectionTitle: string;
  sectionDescription: string;
  steps: HowItWorksStep[];
  disclaimerTitle: string;
  disclaimerDescription: string;
  faqSectionTitle: string;
  faqs: HowItWorksFaq[];
  createdAt: string;
  updatedAt: string;
}

export interface HowItWorksApiResponse {
  success: boolean;
  message: string;
  data: HowItWorksResponse;
}

export const howItWorksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHowItWorksContent: builder.query<HowItWorksResponse, void>({
      query: () => '/website-manage/how-it-works',
      transformResponse: (response: HowItWorksApiResponse) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const { useGetHowItWorksContentQuery } = howItWorksApi;
