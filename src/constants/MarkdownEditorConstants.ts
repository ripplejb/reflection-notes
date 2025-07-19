// Markdown editor constants following SRP
export const MARKDOWN_EDITOR_CONSTANTS = {
  DEFAULT_OPTIONS: {
    PREVIEW_MODE: 'edit' as const,
    HIDE_TOOLBAR: false,
    HEIGHT: 300,
    COLOR_MODE: 'light' as const,
  },
  PREVIEW_MODES: {
    EDIT: 'edit' as const,
    LIVE: 'live' as const,
    PREVIEW: 'preview' as const,
  },
  UI_CLASSES: {
    CONTAINER: "markdown-editor-container",
    BUTTON_PRIMARY: "text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm",
  },
  ACCESSIBILITY: {
    VIEW_MODE_LABEL: "Switch to view mode",
  },
  DEBOUNCE_DELAY: 1000, // Autosave delay in milliseconds
} as const;

export type MarkdownEditorConstants = typeof MARKDOWN_EDITOR_CONSTANTS;
export type PreviewMode = typeof MARKDOWN_EDITOR_CONSTANTS.PREVIEW_MODES[keyof typeof MARKDOWN_EDITOR_CONSTANTS.PREVIEW_MODES];
