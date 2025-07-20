// Theme utility functions for consistent styling
import { THEME_CONSTANTS } from '../constants/ThemeConstants';
import type { Theme } from '../services/ThemeService';

export class ThemeUtils {
  /**
   * Get background classes based on theme and variant
   */
  static getBackground(theme: Theme, variant: 'PRIMARY' | 'SECONDARY' | 'MODAL' = 'PRIMARY'): string {
    return THEME_CONSTANTS.BACKGROUNDS[variant][theme.toUpperCase() as 'LIGHT' | 'DARK'];
  }

  /**
   * Get border classes based on theme and variant
   */
  static getBorder(theme: Theme, variant: 'PRIMARY' | 'SECONDARY' | 'ACCENT' = 'PRIMARY'): string {
    return THEME_CONSTANTS.BORDERS[variant][theme.toUpperCase() as 'LIGHT' | 'DARK'];
  }

  /**
   * Get text classes based on theme and variant
   */
  static getText(theme: Theme, variant: 'PRIMARY' | 'SECONDARY' | 'MUTED' = 'PRIMARY'): string {
    return THEME_CONSTANTS.TEXT[variant][theme.toUpperCase() as 'LIGHT' | 'DARK'];
  }

  /**
   * Get button classes based on theme and variant
   */
  static getButton(theme: Theme, variant: 'PRIMARY' | 'DANGER' | 'WARNING' = 'PRIMARY'): string {
    return THEME_CONSTANTS.BUTTON[variant][theme.toUpperCase() as 'LIGHT' | 'DARK'];
  }

  /**
   * Combine background and border for common container pattern
   */
  static getContainer(theme: Theme, bgVariant: 'PRIMARY' | 'SECONDARY' | 'MODAL' = 'PRIMARY', borderVariant: 'PRIMARY' | 'SECONDARY' | 'ACCENT' = 'PRIMARY'): string {
    return `${this.getBackground(theme, bgVariant)} ${this.getBorder(theme, borderVariant)}`;
  }

  /**
   * Get header/navigation bar styling
   */
  static getHeaderStyle(theme: Theme): string {
    return `${this.getBackground(theme, 'PRIMARY')} ${this.getBorder(theme, 'PRIMARY')}`;
  }

  /**
   * Get modal styling
   */
  static getModalStyle(theme: Theme): string {
    return `${this.getBackground(theme, 'MODAL')} border ${this.getBorder(theme, 'SECONDARY')}`;
  }

  /**
   * Get card/panel styling
   */
  static getCardStyle(theme: Theme): string {
    return `${this.getBackground(theme, 'PRIMARY')} border ${this.getBorder(theme, 'PRIMARY')}`;
  }

  /**
   * Get form input styling
   */
  static getInputStyle(theme: Theme): string {
    return `${this.getBackground(theme, 'PRIMARY')} ${this.getText(theme, 'PRIMARY')} ${this.getBorder(theme, 'SECONDARY')}`;
  }

  /**
   * Utility for status indicators
   */
  static getStatusColor(theme: Theme, status: 'info' | 'warning' | 'error' | 'success'): string {
    const colors = {
      info: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      warning: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
      error: theme === 'dark' ? 'text-red-400' : 'text-red-600',
      success: theme === 'dark' ? 'text-green-400' : 'text-green-600'
    };
    return colors[status];
  }

  /**
   * Get transition classes for smooth theme changes
   */
  static getTransitions(): string {
    return 'transition-colors duration-200';
  }

  /**
   * Complete button styling with proper theme support
   */
  static getButtonStyle(
    theme: Theme, 
    variant: 'PRIMARY' | 'DANGER' | 'WARNING' = 'PRIMARY',
    size: 'sm' | 'md' | 'lg' = 'md'
  ): string {
    const baseClasses = 'flex items-center gap-1 rounded border justify-center';
    const sizeClasses = {
      sm: 'px-2 py-1 text-sm h-8 min-w-[32px]',
      md: 'px-3 py-2 h-10 min-w-[40px]',
      lg: 'px-4 py-3 h-12 min-w-[48px]'
    };
    
    return `${baseClasses} ${sizeClasses[size]} ${this.getButton(theme, variant)} ${this.getTransitions()}`;
  }
}
