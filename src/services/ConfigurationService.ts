// Configuration service following SOLID principles with composition
import type { 
  MarkdownEditorOptions,
  HeaderOption,
  IHeaderProvider
} from '../interfaces/ConfigurationInterfaces';
import { HeaderProviderService } from './HeaderProviderService';
import { EasyMDEService, type IMarkdownEditor } from './MarkdownEditorService';

// Configuration service interface
export interface IConfigurationService {
  getPredefinedHeaders(): string[];
  getMarkdownOptions(): MarkdownEditorOptions;
  addPredefinedHeader(header: string): void;
  removePredefinedHeader(header: string): void;
}

// Re-export types for backward compatibility
export type { MarkdownEditorOptions };

export class ConfigurationService implements IConfigurationService {
  private readonly headerProvider: IHeaderProvider;
  private readonly markdownEditor: IMarkdownEditor;
  private markdownOptions: MarkdownEditorOptions;

  constructor(
    headerProvider?: IHeaderProvider,
    markdownEditor?: IMarkdownEditor
  ) {
    // Dependency injection with default implementations
    this.headerProvider = headerProvider ?? new HeaderProviderService();
    this.markdownEditor = markdownEditor ?? new EasyMDEService();
    this.markdownOptions = this.markdownEditor.getDefaultOptions();
  }

  // Header management delegation
  getPredefinedHeaders(): string[] {
    return this.headerProvider.getPredefinedHeaders();
  }

  getPredefinedHeaderOptions(): HeaderOption[] {
    return this.headerProvider.getPredefinedHeaders().map((h: string) => ({ value: h, label: h }));
  }

  addPredefinedHeader(header: string): void {
    this.headerProvider.addPredefinedHeader(header);
  }

  removePredefinedHeader(header: string): void {
    this.headerProvider.removePredefinedHeader(header);
  }

  // Markdown options management
  getMarkdownOptions(): MarkdownEditorOptions {
    return { ...this.markdownOptions };
  }

  updateMarkdownOptions(options: Partial<MarkdownEditorOptions>): void {
    const updatedOptions = { ...this.markdownOptions, ...options };
    
    if (this.markdownEditor.validateOptions(updatedOptions)) {
      this.markdownOptions = updatedOptions;
    } else {
      throw new Error('Invalid markdown editor options provided');
    }
  }

  resetMarkdownOptions(): void {
    this.markdownOptions = this.markdownEditor.getDefaultOptions();
  }
}
