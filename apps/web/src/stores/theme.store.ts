import { create } from 'zustand'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // ignore: private mode / storage disabled
  }
}

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    set({ theme: next })
  },
}))
