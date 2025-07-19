// Interfaces segregated by concern following ISP
import type { PreviewMode } from '../constants/MarkdownEditorConstants';

// Segregated interface for markdown editor configuration
export interface IMarkdownEditorConfig {
  getEditorOptions(): MarkdownEditorOptions;
  updateEditorOptions(options: Partial<MarkdownEditorOptions>): void;
}

// Segregated interface for header management
export interface IHeaderProvider {
  getPredefinedHeaders(): string[];
  addPredefinedHeader(header: string): void;
  removePredefinedHeader(header: string): void;
}

// Combined interface for backward compatibility
export interface IConfigurationService extends IMarkdownEditorConfig, IHeaderProvider {}

// Markdown editor options interface
export interface MarkdownEditorOptions {
  preview?: PreviewMode;
  hideToolbar?: boolean;
  height?: number;
  colorMode?: 'light' | 'dark';
}

// Header dropdown option interface
export interface HeaderOption {
  value: string;
  label: string;
}
