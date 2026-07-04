import { baseApi } from './baseApi';

export interface DynamicPageData {
  hero: any;
  content: any;
  widget: any;
  faqList?: any[];
}

export const dynamicPageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDynamicPageData: builder.query<DynamicPageData, string>({
      async queryFn(pageType, _queryApi, _extraOptions, fetchWithBQ) {
        // We fetch 3 endpoints concurrently using RTK query's fetchWithBQ
        
        let slug = '';
        if (pageType === 'PrivacyPolicy') slug = 'privacy-policy';
        else if (pageType === 'TermsOfService') slug = 'terms-of-service';
        else if (pageType === 'HippaNotice') slug = 'hippa-notice';

        const [heroRes, contentRes, widgetRes, faqRes] = await Promise.all([
          fetchWithBQ(`/hero-section?pageType=${pageType}`),
          fetchWithBQ(`/website-manage/${slug}`),
          fetchWithBQ(`/side-widget?pageType=${pageType}`),
          fetchWithBQ(`/faq-section?pageType=${pageType}`)
        ]);

        const hero = heroRes.data ? (heroRes.data as any).data?.[0] : null;
        const content = contentRes.data ? (contentRes.data as any).data?.content : null;
        const widget = widgetRes.data ? (widgetRes.data as any).data?.[0] : null;

        const faqDataRaw = faqRes.data ? (faqRes.data as any).data : null;
        let faqList = undefined;
        if (faqDataRaw && Array.isArray(faqDataRaw)) {
          faqList = faqDataRaw.map((item: any) => ({
            id: item.id || Math.random().toString(),
            question: item.question,
            answer: item.answer,
          }));
        }

        return {
          data: {
            hero: hero || { title: pageType.replace(/([A-Z])/g, ' $1').trim() },
            content: content || "Content not available.",
            widget: widget,
            faqList
          }
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetDynamicPageDataQuery } = dynamicPageApi;
