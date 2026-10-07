import { create } from 'zustand'
import { type ColorTheme, DEFAULT_COLOR_THEME, isColorTheme } from '@/lib/color-themes'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const COLOR_STORAGE_KEY = 'color-theme'

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore: private mode / storage disabled
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  save(STORAGE_KEY, theme)
}

function applyColorTheme(colorTheme: ColorTheme) {
  document.documentElement.dataset.theme = colorTheme
  save(COLOR_STORAGE_KEY, colorTheme)
}

// index.html sets data-theme before the first paint; anything unknown falls back to the default
function initialColorTheme(): ColorTheme {
  const current = document.documentElement.dataset.theme
  return isColorTheme(current) ? current : DEFAULT_COLOR_THEME
}

interface ThemeState {
  theme: Theme
  colorTheme: ColorTheme
  toggleTheme: () => void
  setColorTheme: (colorTheme: ColorTheme) => void
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  colorTheme: initialColorTheme(),
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    set({ theme: next })
  },
  setColorTheme: (colorTheme) => {
    applyColorTheme(colorTheme)
    set({ colorTheme })
  },
}))
