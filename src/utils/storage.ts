import type { Note } from "../models/Note";

const STORAGE_KEY = "reflection-notes";

export function getNotes(): Note[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
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
