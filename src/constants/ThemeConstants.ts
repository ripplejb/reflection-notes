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
  },
  
  // Common theme class combinations
  BACKGROUNDS: {
    PRIMARY: {
      LIGHT: 'bg-white',
      DARK: 'bg-gray-800'
    },
    SECONDARY: {
      LIGHT: 'bg-gray-50',
      DARK: 'bg-gray-900'
    },
    MODAL: {
      LIGHT: 'bg-white',
      DARK: 'bg-gray-800'
    }
  },
  
  BORDERS: {
    PRIMARY: {
      LIGHT: 'border-gray-200',
      DARK: 'border-gray-700'
    },
    SECONDARY: {
      LIGHT: 'border-gray-300',
      DARK: 'border-gray-600'
    },
    ACCENT: {
      LIGHT: 'border-gray-400',
      DARK: 'border-gray-500'
    }
  },
  
  TEXT: {
    PRIMARY: {
      LIGHT: 'text-gray-900',
      DARK: 'text-gray-100'
    },
    SECONDARY: {
      LIGHT: 'text-gray-600',
      DARK: 'text-gray-300'
    },
    MUTED: {
      LIGHT: 'text-gray-500',
      DARK: 'text-gray-400'
    }
  },
  
  BUTTON: {
    PRIMARY: {
      LIGHT: 'text-blue-600 border-gray-300 hover:border-gray-400',
      DARK: 'text-blue-400 border-gray-600 hover:border-gray-500'
    },
    DANGER: {
      LIGHT: 'text-red-600 border-gray-300 hover:border-gray-400',
      DARK: 'text-red-400 border-gray-600 hover:border-gray-500'
    },
    WARNING: {
      LIGHT: 'text-orange-600 border-orange-200 hover:border-orange-300',
      DARK: 'text-orange-600 border-orange-400 hover:border-orange-300'
    }
  }
} as const;

export type ThemeConstants = typeof THEME_CONSTANTS;
export type ThemeType = typeof THEME_CONSTANTS.THEMES[keyof typeof THEME_CONSTANTS.THEMES];
