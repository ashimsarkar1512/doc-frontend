import { baseApi } from './baseApi';

export const aboutUsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAboutUsData: builder.query<any, void>({
      query: () => '/website-manage/about-us',
    }),
  }),
});

export const { useGetAboutUsDataQuery } = aboutUsApi;
