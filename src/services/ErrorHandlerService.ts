// Error handling service following SRP
export interface IErrorHandler {
  handleValidationError(error: ValidationError): void;
  handleMarkdownError(error: MarkdownError): void;
  handleStorageError(error: StorageError): void;
  handleGenericError(error: Error): void;
}

export interface ValidationError extends Error {
  field: string;
  value: unknown;
  constraints: string[];
}

export interface MarkdownError extends Error {
  editorType: string;
  operation: string;
}

export interface StorageError extends Error {
  storageType: string;
  key?: string;
}

export class ErrorHandlerService implements IErrorHandler {
  private readonly isProduction = import.meta.env.PROD;

  handleValidationError(error: ValidationError): void {
    const message = `Validation failed for field "${error.field}": ${error.constraints.join(', ')}`;
    
    if (!this.isProduction) {
      console.warn('Validation Error:', {
        field: error.field,
        value: error.value,
        constraints: error.constraints,
        message: error.message
      });
    }

    // In production, you might want to send to error tracking service
    this.notifyUser(message, 'warning');
  }

  handleMarkdownError(error: MarkdownError): void {
    if (!this.isProduction) {
      console.error('Markdown Error:', {
        editorType: error.editorType,
        operation: error.operation,
        message: error.message,
        stack: error.stack
      });
    }

    this.notifyUser('There was an issue with the markdown editor. Please try again.', 'error');
  }

  handleStorageError(error: StorageError): void {
    if (!this.isProduction) {
      console.error('Storage Error:', {
        storageType: error.storageType,
        key: error.key,
        message: error.message,
        stack: error.stack
      });
    }

    this.notifyUser('There was an issue saving your data. Please try again.', 'error');
  }

  handleGenericError(error: Error): void {
    if (!this.isProduction) {
      console.error('Generic Error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    this.notifyUser('An unexpected error occurred. Please try again.', 'error');
  }

  private notifyUser(message: string, type: 'info' | 'warning' | 'error'): void {
    // This is a placeholder for user notification
    // In a real app, you'd integrate with a toast/notification system
    if (type === 'error') {
      console.error(`User notification: ${message}`);
    } else if (type === 'warning') {
      console.warn(`User notification: ${message}`);
    } else {
      console.info(`User notification: ${message}`);
    }
  }
}

// Utility functions for creating specific error types
export const createValidationError = (field: string, value: unknown, constraints: string[], message?: string): ValidationError => {
  const error = new Error(message || `Validation failed for ${field}`) as ValidationError;
  error.field = field;
  error.value = value;
  error.constraints = constraints;
  return error;
};

export const createMarkdownError = (editorType: string, operation: string, message: string): MarkdownError => {
  const error = new Error(message) as MarkdownError;
  error.editorType = editorType;
  error.operation = operation;
  return error;
};

export const createStorageError = (storageType: string, message: string, key?: string): StorageError => {
  const error = new Error(message) as StorageError;
  error.storageType = storageType;
  error.key = key;
  return error;
};
