import { baseApi } from '@/Redux/api/baseApi';

export interface RequestRecordItem {
  id: string;
  widgetId: string;
  text: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RequestRecordWidget {
  id: string;
  title: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  items: RequestRecordItem[];
}

export interface RequestRecordsResponse {
  success: boolean;
  message: string;
  data: RequestRecordWidget[];
}

export interface RequestRecordPayload {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  requestType: string;
  additionalNotes: string;
  consent: boolean;
  status?: string;
}

export const recordsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequestRecordsContent: builder.query<RequestRecordsResponse, void>({
      query: () => ({
        url: "/website-manage/request-records",
        method: "GET",
      }),
    }),
    submitRecordRequest: builder.mutation<any, RequestRecordPayload>({
      query: (data) => ({
        url: "/public/request-records",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetRequestRecordsContentQuery, useSubmitRecordRequestMutation } = recordsApi;
