import { baseApi } from './baseApi';

export interface RegisterPublicKeyRequest {
  publicKey: string;
}

export interface GetPublicKeyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    userId: string;
    publicKey: string;
  };
}

export interface Conversation {
  id: string;
  serviceID: string;
  patientId: string;
  providerId: string;
  createdAt: string;
  patient: {
    id: string;
    name: string;
    avatar: string | null;
  };
  provider: {
    id: string;
    name: string;
    title: string;
    avatar: string | null;
  };
  service: {
    id: string;
    name: string;
  };
  submission: {
    id: string;
    submissionCode: string;
    status: string;
    assessment: {
      id: string;
      title: string;
    };
  } | null;
  isPatientOnline: boolean;
  isProviderOnline: boolean;
  messages: Array<{
    id: string;
    createdAt: string;
    messageType: string;
    senderId: string;
  }>;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderCopy: string;
  recipientCopy: string;
  iv: string;
  encryptedKey: string;
  messageType: 'TEXT' | 'ATTACHMENT' | 'PROPOSAL';
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
  proposals: Array<{
    id: string;
    title: string;
    description: string;
    fee: string;
    proposalDate: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    updatedAt: string;
  }>;
  attachments: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }>;
}

export interface GetMessagesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    conversation: Conversation;
    messages: Message[];
  };
}

export interface ServiceInfoResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
}

export interface ConversationFilesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
}

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerPublicKey: builder.mutation<{ success: boolean }, RegisterPublicKeyRequest>({
      query: (body) => ({
        url: '/message/keys/register',
        method: 'POST',
        body,
      }),
    }),
    getPublicKey: builder.query<GetPublicKeyResponse, string>({
      query: (userId) => `/message/keys/${userId}`,
    }),
    createConversation: builder.mutation<any, { serviceID: string; patientId: string; providerId: string }>({
      query: (body) => ({
        url: '/message/conversation',
        method: 'POST',
        body,
      }),
    }),
    getConversations: builder.query<{ success: boolean; data: Conversation[] }, { search?: string }>({
      query: (params) => ({
        url: '/message/conversations',
        params,
      }),
    }),
    getMessageHistory: builder.query<GetMessagesResponse, { conversationId: string; cursor?: string }>({
      query: ({ conversationId, cursor }) => ({
        url: `/message/conversations/${conversationId}/messages`,
        params: { cursor },
      }),
    }),
    uploadMessageAttachment: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/attachments/upload',
        method: 'POST',
        body: formData,
        // FormData is automatically handled by fetch
      }),
    }),
    getServiceInfo: builder.query<ServiceInfoResponse, string>({
      query: (conversationId) => `/message/conversations/${conversationId}/service-info`,
      providesTags: ['Message'],
    }),
    cancelSubscription: builder.mutation<{ success: boolean; message: string }, string>({
      query: (conversationId) => ({
        url: `/message/conversations/${conversationId}/cancel-subscription`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Message', 'Chat'],
    }),
    getConversationFiles: builder.query<ConversationFilesResponse, string>({
      query: (conversationId) => `/message/conversations/${conversationId}/files`,
      providesTags: ['Message'],
    }),
    acceptProposal: builder.mutation<{ success: boolean; message: string }, { proposalId: string; paymentData: any }>({
      query: ({ proposalId, paymentData }) => ({
        url: `/proposal/${proposalId}/accept`,
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Message'],
    }),
    rejectProposal: builder.mutation<{ success: boolean; message: string }, string>({
      query: (proposalId) => ({
        url: `/proposal/${proposalId}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Message'],
    }),
    getPatientSubscriptions: builder.query<any, void>({
      query: () => '/patient/subscriptions',
      providesTags: ['Subscriptions'] as any, // Cast to any because Subscriptions might not be in the global tag list of baseApi yet
    }),
    toggleSubscriptionRecurring: builder.mutation<any, { id: string; isRecurring: boolean }>({
      query: ({ id, isRecurring }) => ({
        url: `/patient/subscriptions/${id}/toggle-recurring`,
        method: 'PATCH',
        body: { isRecurring },
      }),
      invalidatesTags: ['Subscriptions'] as any,
    }),
  }),
});

export const {
  useRegisterPublicKeyMutation,
  useGetPublicKeyQuery,
  useCreateConversationMutation,
  useGetConversationsQuery,
  useGetMessageHistoryQuery,
  useUploadMessageAttachmentMutation,
  useGetServiceInfoQuery,
  useCancelSubscriptionMutation,
  useGetConversationFilesQuery,
  useAcceptProposalMutation,
  useRejectProposalMutation,
  useGetPatientSubscriptionsQuery,
  useToggleSubscriptionRecurringMutation,
} = messageApi;
