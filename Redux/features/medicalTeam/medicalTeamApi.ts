import { baseApi } from "../../api/baseApi";

export interface MedicalTeamSectionResponse {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalTeamSectionApiResponse {
  success: boolean;
  message: string;
  data: MedicalTeamSectionResponse;
}

export const medicalTeamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMedicalTeamSection: builder.query<MedicalTeamSectionResponse, void>({
      query: () => '/website-manage/medical-team-section',
      transformResponse: (response: MedicalTeamSectionApiResponse) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const { useGetMedicalTeamSectionQuery } = medicalTeamApi;
