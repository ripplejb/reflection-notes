// Filter service for note filtering operations following SRP and OCP
import type { Note } from "../models/Note";

export interface IFilterService {
  filterByDateRange(notes: Note[], startDate: string | null, endDate: string | null): Note[];
  findFirstNoteInRange(notes: Note[], startDate: string | null, endDate: string | null): Note | null;
  isNoteInDateRange(note: Note, startDate: string | null, endDate: string | null): boolean;
}

export class FilterService implements IFilterService {
  /**
   * Filter notes by date range
   * @param notes Array of notes to filter
   * @param startDate Start date in YYYYMMDD format or null for no start limit
   * @param endDate End date in YYYYMMDD format or null for no end limit
   * @returns Filtered array of notes
   */
  filterByDateRange(notes: Note[], startDate: string | null, endDate: string | null): Note[] {
    if (!startDate && !endDate) {
      return notes; // No filter applied
    }
    
    return notes.filter(note => this.isNoteInDateRange(note, startDate, endDate));
  }

  /**
   * Find the first note that matches the date range criteria
   * @param notes Array of notes to search
   * @param startDate Start date in YYYYMMDD format or null
   * @param endDate End date in YYYYMMDD format or null
   * @returns First matching note or null if none found
   */
  findFirstNoteInRange(notes: Note[], startDate: string | null, endDate: string | null): Note | null {
    const filtered = this.filterByDateRange(notes, startDate, endDate);
    return filtered.length > 0 ? filtered[0] : null;
  }

  /**
   * Check if a note falls within the specified date range
   * @param note Note to check
   * @param startDate Start date in YYYYMMDD format or null
   * @param endDate End date in YYYYMMDD format or null
   * @returns True if note is in range, false otherwise
   */
  isNoteInDateRange(note: Note, startDate: string | null, endDate: string | null): boolean {
    const noteDate = note.date;
    const isAfterStart = !startDate || noteDate >= startDate;
    const isBeforeEnd = !endDate || noteDate <= endDate;
    
    return isAfterStart && isBeforeEnd;
  }
}
