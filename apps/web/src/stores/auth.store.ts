import { create } from 'zustand'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
}

interface AuthState {
  // Access token chỉ nằm trong RAM (không localStorage) → script độc hại (XSS) khó đánh cắp.
  // F5 là mất → app gọi /auth/refresh (dùng cookie httpOnly) để lấy lại.
  accessToken: string | null
  user: AuthUser | null
  setAuth: (accessToken: string, user: AuthUser) => void
  setAccessToken: (accessToken: string) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clear: () => set({ accessToken: null, user: null }),
}))
