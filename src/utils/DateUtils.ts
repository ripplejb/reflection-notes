// Date utilities following Single Responsibility Principle
import { APP_CONSTANTS } from '../constants/AppConstants';

export class DateUtils {
  /**
   * Formats a date string for display (YYYYMMDD -> YYYY-MM-DD)
   */
  static formatDateForDisplay(dateStr: string): string {
    if (!dateStr || dateStr.length < 8) return dateStr;
    
    const { DATE_FORMAT } = APP_CONSTANTS;
    const year = dateStr.slice(0, DATE_FORMAT.YEAR_LENGTH);
    const month = dateStr.slice(DATE_FORMAT.MONTH_START, DATE_FORMAT.MONTH_START + DATE_FORMAT.MONTH_LENGTH);
    const day = dateStr.slice(DATE_FORMAT.DAY_START, DATE_FORMAT.DAY_START + DATE_FORMAT.DAY_LENGTH);
    
    return `${year}${DATE_FORMAT.DISPLAY_SEPARATOR}${month}${DATE_FORMAT.DISPLAY_SEPARATOR}${day}`;
  }

  /**
   * Validates if a date string is in the correct format
   */
  static isValidDateFormat(dateStr: string): boolean {
    if (!dateStr) return false;
    return /^\d{8}$/.test(dateStr) || dateStr === APP_CONSTANTS.NEW_DATE_TEMP_ID;
  }

  /**
   * Sorts notes by date in descending order (newest first)
   */
  static sortNotesByDateDesc<T extends { date: string }>(notes: T[]): T[] {
    return [...notes].sort((a, b) => b.date.localeCompare(a.date));
  }

  /**
   * Gets timezone offset using Intl API
   */
  static getTimezoneOffset(): number | undefined {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date();
      const localDate = new Date(now.toLocaleString("en-US", { timeZone: tz }));
      return -localDate.getTimezoneOffset();
    } catch {
      return undefined;
    }
  }
}
