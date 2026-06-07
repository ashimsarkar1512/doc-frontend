import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id?: string
  email?: string
  name?: string
  role?: 'doctor' | 'patient' | 'admin'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload)
      }
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    hydrate: (state, action: PayloadAction<AuthState>) => {
      return action.payload
    },
  },
})

export const { setUser, setToken, clearAuth, setLoading, setError, hydrate } = authSlice.actions
export default authSlice.reducer
