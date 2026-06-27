import type { User } from '../features/auth/authSlice'
import { baseApi } from './baseApi'

// ─── Request / Response Types ─────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

/** Step-1 response: credentials ok, OTP required */
export interface LoginResponse {
  success: boolean
  message: string
  data: {
    userId: string
    status: 'OTP_REQUIRED' | 'ACTIVE'
    phone?: string
    email?: string
    accessToken?: string
    tokenType?: string
    user?: User
  }
}

export interface SendOtpRequest {
  userId: string
  purpose: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD' | 'FORGOT_PASSWORD'
  method: 'EMAIL' | 'PHONE'
}

export interface SendOtpResponse {
  success: boolean
  message: string
  data: {
    challengeId: string
    userId: string
    purpose: string
    method: string
    expiresAt: string
  }
}

export interface VerifyOtpRequest {
  challengeId: string
  otp: string
}

export interface ResendOtpRequest {
  challengeId: string
  userId: string
  purpose: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD' | 'FORGOT_PASSWORD'
}

export interface ResendOtpResponse {
  success: boolean
  message: string
  data: {
    challengeId: string
    userId: string
    purpose: string
    method: string
    expiresAt: string
  }
}

export interface VerifyOtpResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    tokenType: string
    user: User
  }
}

// ─── Register ─────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    userId: string
    status: string
  }
}

// ─── Profile Types ────────────────────────────────────────────────────────────

export interface UpdateProfileRequest {
  avatarId?: string
  name?: string
  bio?: string
  title?: string
  specialty?: string
  officeLocation?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface UpdateProfileResponse {
  success: boolean
  statusCode: number
  message: string
  data: User
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordResponse {
  success: boolean
  statusCode: number
  message: string
}

export interface ToggleMfaResponse {
  success: boolean
  statusCode: number
  message: string
  data: { mfaEnabled: boolean }
}

export interface CommunicationPreferences {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
}

export interface CommunicationPreferencesResponse {
  success: boolean
  statusCode: number
  message: string
  data: CommunicationPreferences & { id?: string; userId?: string; createdAt?: string; updatedAt?: string }
}

export interface Session {
  sessionId: string
  isCurrentSession: boolean
  lastLogin: string
  ipAddress: string
  sessionDue: string
}

export interface DeviceSession {
  deviceName: string
  isActiveNow: boolean
  sessionCount: number
  sessions: Session[]
}

export interface SessionsResponse {
  success: boolean
  statusCode: number
  message: string
  data: DeviceSession[]
}

export interface UploadAttachmentResponse {
  success: boolean
  statusCode: number
  message: string
  data: { id: string; fileUrl: string; fileName: string; fileType: string; fileSize: number }
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * POST /auth/register
     * Registers a new user. On success returns userId + PENDING_VERIFICATION status.
     */
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (payload) => ({
        url: '/auth/register',
        method: 'POST',
        body: payload,
      }),
    }),

    /**
     * Step 1 — POST /auth/login
     * Validates email + password.
     * On success the API returns { userId, status: "OTP_REQUIRED" }.
     */
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    /**
     * Step 2 — POST /auth/send-otp
     * Sends an OTP to the user's email or phone.
     * Returns a challengeId used in step 3.
     */
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (payload) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: payload,
      }),
    }),

    /**
     * Step 3 — POST /auth/verify-otp
     * Verifies the OTP. On success returns accessToken + user object.
     */
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (payload) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: payload,
      }),
    }),

    /**
     * POST /auth/resend-otp
     * Resends OTP using existing challengeId.
     */
    resendOtp: builder.mutation<ResendOtpResponse, ResendOtpRequest>({
      query: (payload) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body: payload,
      }),
    }),

    /**
     * POST /auth/forgot-password
     * Checks if account exists. Returns userId to proceed with OTP.
     */
    forgotPassword: builder.mutation<
      { success: boolean; message: string; data: { userId: string; phone?: string; email?: string } },
      { email: string }
    >({
      query: (payload) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: payload,
      }),
    }),

    /**
     * POST /auth/reset-password
     */
    resetPassword: builder.mutation<
      { success: boolean; message: string },
      { challengeId: string; newPassword: string; confirmPassword: string }
    >({
      query: (payload) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: payload,
      }),
    }),

    /**
     * GET /auth/me — fetch current authenticated user.
     */
    getCurrentUser: builder.query<{ data: User }, void>({
      query: () => '/auth/me',
      providesTags: ['Auth', 'User'],
    }),

    /**
     * POST /auth/logout
     */
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    /**
     * PATCH /auth/me — update current user's profile
     */
    updateProfile: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: (payload) => ({
        url: '/auth/me',
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    /**
     * POST /attachments/upload — upload profile image
     */
    uploadAttachment: builder.mutation<UploadAttachmentResponse, FormData>({
      query: (formData) => ({
        url: '/attachments/upload',
        method: 'POST',
        body: formData,
      }),
    }),

    /**
     * POST /auth/me/change-password — change current user's password
     */
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (payload) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: payload,
      }),
    }),

    /**
     * POST /auth/me/toggle-mfa — toggle MFA on/off
     */
    toggleMfa: builder.mutation<ToggleMfaResponse, void>({
      query: () => ({
        url: '/auth/me/toggle-mfa',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    /**
     * GET /auth/me/preferences — get communication preferences
     */
    getCommunicationPreferences: builder.query<CommunicationPreferencesResponse, void>({
      query: () => '/auth/me/preferences',
      providesTags: ['Auth'],
    }),

    /**
     * PATCH /auth/me/preferences — update communication preferences
     */
    updateCommunicationPreferences: builder.mutation<CommunicationPreferencesResponse, Partial<CommunicationPreferences>>({
      query: (payload) => ({
        url: '/auth/me/preferences',
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Auth'],
    }),

    /**
     * GET /auth/sessions — get active sessions
     */
    getSessions: builder.query<SessionsResponse, void>({
      query: () => '/auth/sessions',
      providesTags: ['Auth'],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
  useUploadAttachmentMutation,
  useChangePasswordMutation,
  useToggleMfaMutation,
  useGetCommunicationPreferencesQuery,
  useUpdateCommunicationPreferencesMutation,
  useGetSessionsQuery,
} = authApi

export default authApi
