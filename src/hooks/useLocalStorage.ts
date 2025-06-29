import { useState } from "react";
import { getNotes, saveNotes } from "../utils/storage";
import type { Note } from "../models/Note";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(getNotes());

  const refresh = () => setNotes(getNotes());

  const addOrUpdateNote = (note: Note) => {
    const updated = notes.filter((n) => n.date !== note.date).concat(note);
    saveNotes(updated);
    setNotes(updated);
  };

  const deleteNote = (date: string) => {
    const updated = notes.filter((n) => n.date !== date);
    saveNotes(updated);
    setNotes(updated);
  };

  return { notes, addOrUpdateNote, deleteNote, refresh };
}
