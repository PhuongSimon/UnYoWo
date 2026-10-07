// Palettes live in index.css (warm) and themes.css (the rest); these ids match <html data-theme>.
// Swatches are the colors the user chose each theme by, shown in the picker.
export const COLOR_THEMES = [
  { id: 'warm', swatch: ['#e17346', '#f8f4ef'] },
  { id: 'violet', swatch: ['#3d007a', '#e8ecf1'] },
  { id: 'lime', swatch: ['#cfff74', '#2f3a1d'] },
  { id: 'cobalt', swatch: ['#0038ff', '#ffd8b8'] },
  { id: 'neon', swatch: ['#c8ff00', '#06110d'] },
  { id: 'navy', swatch: ['#0b1f33', '#c6a15b', '#f7f3ea'] },
] as const

export type ColorTheme = (typeof COLOR_THEMES)[number]['id']

export const DEFAULT_COLOR_THEME: ColorTheme = 'warm'

export function isColorTheme(value: unknown): value is ColorTheme {
  return COLOR_THEMES.some((theme) => theme.id === value)
}
