// Factory pattern for creating markdown editor configurations following OCP
import type { MarkdownEditorOptions } from '../interfaces/ConfigurationInterfaces';
import { MARKDOWN_EDITOR_CONSTANTS } from '../constants/MarkdownEditorConstants';

export interface IMarkdownEditorFactory {
  createDefaultConfig(): MarkdownEditorOptions;
  createMinimalConfig(): MarkdownEditorOptions;
  createFullFeaturedConfig(): MarkdownEditorOptions;
  createCustomConfig(overrides: Partial<MarkdownEditorOptions>): MarkdownEditorOptions;
}

export class MarkdownEditorFactory implements IMarkdownEditorFactory {
  createDefaultConfig(): MarkdownEditorOptions {
    return {
      preview: MARKDOWN_EDITOR_CONSTANTS.DEFAULT_OPTIONS.PREVIEW_MODE,
      hideToolbar: MARKDOWN_EDITOR_CONSTANTS.DEFAULT_OPTIONS.HIDE_TOOLBAR,
      height: MARKDOWN_EDITOR_CONSTANTS.DEFAULT_OPTIONS.HEIGHT,
      colorMode: MARKDOWN_EDITOR_CONSTANTS.DEFAULT_OPTIONS.COLOR_MODE,
    };
  }

  createMinimalConfig(): MarkdownEditorOptions {
    return {
      preview: MARKDOWN_EDITOR_CONSTANTS.PREVIEW_MODES.EDIT,
      hideToolbar: true,
      height: 200,
      colorMode: MARKDOWN_EDITOR_CONSTANTS.DEFAULT_OPTIONS.COLOR_MODE,
    };
  }

  createFullFeaturedConfig(): MarkdownEditorOptions {
    return {
      preview: MARKDOWN_EDITOR_CONSTANTS.PREVIEW_MODES.LIVE,
      hideToolbar: false,
      height: 500,
      colorMode: MARKDOWN_EDITOR_CONSTANTS.DEFAULT_OPTIONS.COLOR_MODE,
    };
  }

  createCustomConfig(overrides: Partial<MarkdownEditorOptions>): MarkdownEditorOptions {
    const baseConfig = this.createDefaultConfig();
    return { ...baseConfig, ...overrides };
  }
}

// Singleton factory instance
export const markdownEditorFactory = new MarkdownEditorFactory();
