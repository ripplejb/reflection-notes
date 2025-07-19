// Validation service following SRP
export interface IValidationService {
  validateHeader(header: string): ValidationResult;
  validateContent(content: string): ValidationResult;
  validateMarkdownOptions(options: Record<string, unknown>): ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ValidationService implements IValidationService {
  private readonly MAX_HEADER_LENGTH = 100;
  private readonly MAX_CONTENT_LENGTH = 10000;
  private readonly MIN_EDITOR_HEIGHT = 100;
  private readonly MAX_EDITOR_HEIGHT = 1000;

  validateHeader(header: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (typeof header !== 'string') {
      errors.push('Header must be a string');
    } else {
      if (header.length > this.MAX_HEADER_LENGTH) {
        errors.push(`Header must be ${this.MAX_HEADER_LENGTH} characters or less`);
      }
      
      if (header.trim().length === 0) {
        warnings.push('Header is empty');
      }

      if (header.includes('\n')) {
        warnings.push('Header contains line breaks');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateContent(content: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (typeof content !== 'string') {
      errors.push('Content must be a string');
    } else {
      if (content.length > this.MAX_CONTENT_LENGTH) {
        warnings.push(`Content is very long (${content.length} characters). Consider breaking it into smaller notes.`);
      }

      if (content.trim().length === 0) {
        warnings.push('Content is empty');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateMarkdownOptions(options: Record<string, unknown>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!options || typeof options !== 'object') {
      errors.push('Options must be an object');
      return { isValid: false, errors, warnings };
    }

    // Validate preview mode
    if (options.preview && typeof options.preview === 'string' && !['edit', 'live', 'preview'].includes(options.preview)) {
      errors.push('Preview mode must be "edit", "live", or "preview"');
    }

    // Validate height
    if (options.height !== undefined) {
      if (typeof options.height !== 'number') {
        errors.push('Height must be a number');
      } else if (options.height < this.MIN_EDITOR_HEIGHT) {
        errors.push(`Height must be at least ${this.MIN_EDITOR_HEIGHT}px`);
      } else if (options.height > this.MAX_EDITOR_HEIGHT) {
        warnings.push(`Height ${options.height}px is very large. Consider using a smaller value.`);
      }
    }

    // Validate hideToolbar
    if (options.hideToolbar !== undefined && typeof options.hideToolbar !== 'boolean') {
      errors.push('hideToolbar must be a boolean');
    }

    // Validate colorMode
    if (options.colorMode && typeof options.colorMode === 'string' && !['light', 'dark'].includes(options.colorMode)) {
      errors.push('Color mode must be "light" or "dark"');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
