// Markdown editor service following DIP and SRP
import type { MarkdownEditorOptions } from '../interfaces/ConfigurationInterfaces';
import { MARKDOWN_EDITOR_CONSTANTS } from '../constants/MarkdownEditorConstants';
import { ValidationService, type IValidationService } from './ValidationService';

// Abstract interface for markdown editor
export interface IMarkdownEditor {
  getDefaultOptions(): MarkdownEditorOptions;
  validateOptions(options: MarkdownEditorOptions): boolean;
  sanitizeContent(content: string): string;
}

// Concrete implementation for EasyMDE
export class EasyMDEService implements IMarkdownEditor {
  private readonly validationService: IValidationService;

  constructor(validationService?: IValidationService) {
    this.validationService = validationService ?? new ValidationService();
  }

  getDefaultOptions(): MarkdownEditorOptions {
    return {
      preview: MARKDOWN_EDITOR_CONSTANTS.DEFAULT_OPTIONS.PREVIEW_MODE,
      hideToolbar: MARKDOWN_EDITOR_CONSTANTS.DEFAULT_OPTIONS.HIDE_TOOLBAR,
      height: MARKDOWN_EDITOR_CONSTANTS.DEFAULT_OPTIONS.HEIGHT,
      colorMode: MARKDOWN_EDITOR_CONSTANTS.DEFAULT_OPTIONS.COLOR_MODE,
    };
  }

  validateOptions(options: MarkdownEditorOptions): boolean {
    const result = this.validationService.validateMarkdownOptions(options as Record<string, unknown>);
    return result.isValid;
  }

  sanitizeContent(content: string): string {
    // Basic content sanitization
    return content.trim();
  }
}
