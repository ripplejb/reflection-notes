// UI Utilities following Single Responsibility Principle
import { APP_CONSTANTS } from '../constants/AppConstants';

export class UIUtils {
  /**
   * Shows a confirmation dialog with a standardized message
   */
  static showConfirmationDialog(message: string): boolean {
    return window.confirm(message);
  }

  /**
   * Shows delete date confirmation dialog
   */
  static confirmDeleteDate(): boolean {
    return UIUtils.showConfirmationDialog(APP_CONSTANTS.UI_MESSAGES.DELETE_DATE_CONFIRMATION);
  }

  /**
   * Shows delete content confirmation dialog
   */
  static confirmDeleteContent(): boolean {
    return UIUtils.showConfirmationDialog(APP_CONSTANTS.UI_MESSAGES.DELETE_CONTENT_CONFIRMATION);
  }

  /**
   * Checks if File System Access API is supported
   */
  static isFileSystemAPISupported(): boolean {
    return "showOpenFilePicker" in window && "showSaveFilePicker" in window;
  }

  /**
   * Creates a unique ID using crypto.randomUUID with fallback
   */
  static generateUniqueId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for environments without crypto.randomUUID
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Validates if a filter is active
   */
  static isFilterActive(startDate: string | null, endDate: string | null): boolean {
    return !!(startDate || endDate);
  }
}
