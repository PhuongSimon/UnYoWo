import { create } from 'zustand'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  emailVerified: boolean
  hasPassword: boolean
}

export type AuthStatus = 'loading' | 'authenticated' | 'guest'

interface AuthState {
  // Access token lives in memory only (not localStorage) so an XSS script cannot read it.
  // On reload it is gone and the app restores the session via /auth/refresh (httpOnly cookie).
  accessToken: string | null
  user: AuthUser | null
  status: AuthStatus
  setAuth: (accessToken: string, user: AuthUser) => void
  setAccessToken: (accessToken: string) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  user: null,
  status: 'loading',
  setAuth: (accessToken, user) => set({ accessToken, user, status: 'authenticated' }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clear: () => set({ accessToken: null, user: null, status: 'guest' }),
}))
