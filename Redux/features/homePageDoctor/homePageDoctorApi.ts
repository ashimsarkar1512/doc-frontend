/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from '../../api/baseApi'

// ─── API ───────────────────────────────────────────────────────
export interface Doctor {
  id: string;
  fullName: string;
  title: string;
  shortBio: string;
  officeLocation: string;
  featured: boolean;
  thumbnail: string;
}

export interface DoctorsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Doctor[];
}
export const homePageDoctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFeaturesDoctor: builder.query<DoctorsResponse, void>({
      query: () => ({
        url: '/public/doctors',
        method: 'GET',
      }),

      // ✅ meaningful tag
      providesTags: ['Doctors'],
    }),
  }),
});
// ─── Hooks ─────────────────────────────────────────────────────

export const { useGetAllFeaturesDoctorQuery, } = homePageDoctorApi