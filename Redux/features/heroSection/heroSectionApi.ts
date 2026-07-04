import { baseApi } from '../../api/baseApi';


export interface HeroSection {
  id: string;
  title: string;
  description: string;
  page: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSectionApiResponse {
  success: boolean;
  message: string;
  data: HeroSection[];
}

export const heroSectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHeroSectionByPage: builder.query<HeroSection | null, string>({
      query: (pageType) => `/hero-section?pageType=${pageType}`,
      providesTags: ['HeroSection'],
      transformResponse: (response: HeroSectionApiResponse) => {
        if (response.data && response.data.length > 0) {
          return response.data[0];
        }
        return null;
      },
    }),
  }),
});

export const { useGetHeroSectionByPageQuery } = heroSectionApi;
