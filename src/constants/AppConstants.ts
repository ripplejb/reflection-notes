// Application constants following Single Responsibility Principle
export const APP_CONSTANTS = {
  DEFAULT_USER: "DEFAULT",
  NEW_DATE_TEMP_ID: "new",
  TIMEZONE_DETECTION_OPTIONS: {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 60000
  },
  UI_MESSAGES: {
    DELETE_DATE_CONFIRMATION: "Are you sure you want to delete this date and all its contents?",
    DELETE_CONTENT_CONFIRMATION: "Are you sure you want to delete this content?",
    UNSAVED_CHANGES_WARNING: "You have unsaved changes. Are you sure you want to leave?",
    NO_DATES_IN_RANGE: "No dates found in selected range",
    NO_CONTENTS_FOR_DATE: "No contents for this date.",
    NO_DATE_SELECTED: "Select a date to view contents.",
    FILE_SYSTEM_NOT_SUPPORTED: "File System Access API is not supported in this browser."
  },
  DATE_FORMAT: {
    DISPLAY_SEPARATOR: "-",
    YEAR_LENGTH: 4,
    MONTH_START: 4,
    MONTH_LENGTH: 2,
    DAY_START: 6,
    DAY_LENGTH: 2
  },
  AUTOSAVE_INDICATOR: {
    SPINNER_CLASS: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600",
    TEXT: "Autosaving..."
  }
} as const;

export type AppConstants = typeof APP_CONSTANTS;
