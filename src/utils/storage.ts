import type { Note } from "../models/Note";

const STORAGE_KEY = "reflection-notes";

export function getNotes(): Note[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    
    // Validate that parsed data is an array of Notes
    if (!Array.isArray(parsed)) {
      console.warn("Invalid notes data format in localStorage, resetting to empty array");
      saveNotes([]);
      return [];
    }
    
    return parsed;
  } catch (error) {
    console.warn("Failed to parse notes from localStorage:", error);
    // Reset to empty array if JSON is corrupted
    saveNotes([]);
    return [];
  }
}

export function saveNotes(notes: Note[]) {
  try {
    const serialized = JSON.stringify(notes);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Failed to save notes to localStorage:", error);
    throw new Error("Unable to save notes to local storage");
  }
}

export function findNoteByDate(date: string): Note | undefined {
  return getNotes().find((note) => note.date === date);
}

export function upsertNote(note: Note) {
  const notes = getNotes();
  const idx = notes.findIndex((n) => n.date === note.date);
  if (idx > -1) notes[idx] = note;
  else notes.push(note);
  saveNotes(notes);
}
