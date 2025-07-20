// Theme constants following SRP
export const THEME_CONSTANTS = {
  THEMES: {
    LIGHT: 'light' as const,
    DARK: 'dark' as const,
  },
  ICONS: {
    SUN: '☀️',
    MOON: '🌙',
  },
  CSS_CLASSES: {
    DARK_MODE: 'dark',
    LIGHT_MODE: '',
  },
  ACCESSIBILITY: {
    LIGHT_MODE_LABEL: 'Switch to light mode',
    DARK_MODE_LABEL: 'Switch to dark mode',
    THEME_TOGGLE_LABEL: 'Toggle theme',
  },
  STORAGE: {
    THEME_KEY: 'reflection-notes-theme',
  },
  UI_CLASSES: {
    TOGGLE_BUTTON: "px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center min-w-[48px] h-10",
    THEME_INDICATOR: "text-lg",
  }
} as const;

export type ThemeConstants = typeof THEME_CONSTANTS;
export type ThemeType = typeof THEME_CONSTANTS.THEMES[keyof typeof THEME_CONSTANTS.THEMES];
