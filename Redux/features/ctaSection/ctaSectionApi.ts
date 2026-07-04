import { baseApi } from "../../api/baseApi";

export interface CtaSectionResponse {
  id: string;
  page: string;
  categoryId: string | null;
  sectionTitle: string;
  ctaButtonText: string;
  url: string;
  openInNewTab: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CtaSectionApiResponse {
  success: boolean;
  message: string;
  data: CtaSectionResponse[];
}

export const ctaSectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCtaSectionByPage: builder.query<CtaSectionResponse | null, string>({
      query: (pageType) => `/cta-section?pageType=${pageType}`,
      transformResponse: (response: CtaSectionApiResponse) => {
        return response.data && response.data.length > 0 ? response.data[0] : null;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetCtaSectionByPageQuery } = ctaSectionApi;
