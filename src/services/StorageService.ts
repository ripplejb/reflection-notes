// Storage service abstraction following DIP
import type { Note } from "../models/Note";

export interface IStorageService {
  getNotes(): Note[];
  saveNotes(notes: Note[]): void;
  findNoteByDate(date: string): Note | undefined;
  upsertNote(note: Note): void;
}

export class LocalStorageService implements IStorageService {
  private readonly storageKey = "reflection-notes";

  getNotes(): Note[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      
      // Validate that parsed data is an array of Notes
      if (!Array.isArray(parsed)) {
        console.warn("Invalid notes data format in localStorage, resetting to empty array");
        this.saveNotes([]);
        return [];
      }
      
      return parsed;
    } catch (error) {
      console.warn("Failed to parse notes from localStorage:", error);
      // Reset to empty array if JSON is corrupted
      this.saveNotes([]);
      return [];
    }
  }

  saveNotes(notes: Note[]): void {
    try {
      const serialized = JSON.stringify(notes);
      localStorage.setItem(this.storageKey, serialized);
    } catch (error) {
      console.error("Failed to save notes to localStorage:", error);
      throw new Error("Unable to save notes to local storage");
    }
  }

  findNoteByDate(date: string): Note | undefined {
    return this.getNotes().find((note) => note.date === date);
  }

  upsertNote(note: Note): void {
    const notes = this.getNotes();
    const idx = notes.findIndex((n) => n.date === note.date);
    if (idx > -1) notes[idx] = note;
    else notes.push(note);
    this.saveNotes(notes);
  }
}
