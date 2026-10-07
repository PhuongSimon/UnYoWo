/** Mirrors COLOR_THEMES in apps/web/src/lib/color-themes.ts; add a theme in both places. */
export const COLOR_THEMES = ['warm', 'violet', 'lime', 'cobalt', 'neon', 'navy'] as const;

export type ColorTheme = (typeof COLOR_THEMES)[number];
