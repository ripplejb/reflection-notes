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
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveNotes(notes: Note[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(notes));
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
