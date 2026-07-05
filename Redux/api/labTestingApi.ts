import { baseApi } from './baseApi';

export interface LabTestingData {
  hero: any;
  section: any;
  cta: any;
}

export const labTestingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLabTestingData: builder.query<LabTestingData, void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const [heroRes, sectionRes, ctaRes] = await Promise.all([
          fetchWithBQ('/website-manage/lab-testing/hero'),
          fetchWithBQ('/website-manage/lab-testing/section'),
          fetchWithBQ('/cta-section?pageType=LabTest')
        ]);

        const hero = heroRes.data ? (heroRes.data as any).data : null;
        const section = sectionRes.data ? (sectionRes.data as any).data : null;
        const ctaList = ctaRes.data ? (ctaRes.data as any).data : null;
        const cta = ctaList && ctaList.length > 0 ? ctaList[0] : null;

        return {
          data: {
            hero,
            section,
            cta
          }
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetLabTestingDataQuery } = labTestingApi;
