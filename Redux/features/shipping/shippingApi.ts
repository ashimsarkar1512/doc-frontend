import { baseApi } from '../../api/baseApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShippingLogoMedia {
  id: string;
  url: string;
}

export interface ShippingPartner {
  id: string;
  sectionId: string;
  name: string;
  address: string;
  logoId: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  logo: ShippingLogoMedia | null;
}

export interface PartnerPharmacySection {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  partners: ShippingPartner[];
}

export interface ShippingTimelineStep {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingTimelineSection {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  steps: ShippingTimelineStep[];
}

export interface ShippingPolicy {
  id: string;
  sectionId: string;
  text: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingPolicySection {
  id: string;
  title: string;
  description: string;
  disclaimerTitle: string;
  disclaimerDescription: string;
  createdAt: string;
  updatedAt: string;
  policies: ShippingPolicy[];
}

export interface ShippingInfoData {
  partnerPharmacySection: PartnerPharmacySection;
  shippingTimelineSection: ShippingTimelineSection;
  shippingPolicySection: ShippingPolicySection;
}

export interface ShippingInfoResponse {
  success: boolean;
  message: string;
  data: ShippingInfoData;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const shippingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippingInfo: builder.query<ShippingInfoData, void>({
      query: () => ({
        url: '/website-manage/shipping-info',
        method: 'GET',
      }),
      providesTags: ['ShippingInfo'],
      transformResponse: (response: ShippingInfoResponse) => response.data,
    }),
  }),
});

export const { useGetShippingInfoQuery } = shippingApi;
export default shippingApi;
