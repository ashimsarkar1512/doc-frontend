import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  phone: string | null
  status: string
  emailVerifiedAt: string | null
  phoneVerifiedAt: string | null
  mfaEnabled: boolean
  lastLoginAt: string | null
  roles: string[]
}

/** Stored during the OTP flow so all three pages share the same context */
export interface OtpPendingData {
  userId: string
  challengeId: string | null
  method: 'EMAIL' | 'PHONE'
  purpose: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  /** Populated after step-1 (login) and step-2 (send-otp) */
  otpPending: OtpPendingData | null
}

// ─── Token persistence ────────────────────────────────────────────────────────

const TOKEN_KEY = 'authToken'

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  },

  set: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_KEY, token)
    // Cookie for middleware (server-side) to read — 7 days
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
  },

  remove: (): void => {
    if (typeof window === 'undefined') return
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
    // Clear all auth cookies (both ours and server-set)
    const cookiesToClear = ['authToken', 'token', 'refreshToken', 'accessToken']
    cookiesToClear.forEach((name) => {
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
    })
  },
}

// ─── Initial state ────────────────────────────────────────────────────────────
// token starts null on both server and client — hydrated via useEffect in provider
// This prevents SSR/client mismatch (hydration error)

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  otpPending: null,
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Client-side hydration only — restores token from localStorage after page refresh.
     * User object stays null until /auth/me is called.
     */
    hydrateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.isAuthenticated = true
    },

    /**
     * Step 1 — login succeeded, OTP is required.
     * Stores userId so the next page can call send-otp.
     */
    setOtpPending: (state, action: PayloadAction<OtpPendingData>) => {
      state.otpPending = action.payload
    },

    /**
     * Step 3 — OTP verified. Store user + token, clear pending OTP data.
     */
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user
      state.token = action.payload.accessToken
      state.isAuthenticated = true
      state.otpPending = null
      tokenStorage.set(action.payload.accessToken)
    },

    /**
     * Clears ALL auth state (logout / 401 interceptor).
     */
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.otpPending = null
      tokenStorage.remove()
    },

    /**
     * Partial user update (e.g. after a profile edit).
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

export const { hydrateToken, setOtpPending, setCredentials, clearAuth, updateUser } =
  authSlice.actions
export default authSlice.reducer
