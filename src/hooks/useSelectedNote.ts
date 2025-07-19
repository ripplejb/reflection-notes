// Custom hook for selected note management following SRP
import { useState, useMemo } from 'react';
import type { Note } from '../models/Note';

interface UseSelectedNoteProps {
  notes: Note[];
  initialDate?: string;
}

export const useSelectedNote = ({ notes, initialDate }: UseSelectedNoteProps) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    initialDate || (notes.length > 0 ? notes[0].date : "")
  );

  const selectedNote = useMemo(
    () => notes.find((n) => n.date === selectedDate),
    [notes, selectedDate]
  );

  const selectFirstAvailableNote = (excludeDate?: string) => {
    const availableNote = notes.find((n) => n.date !== excludeDate);
    setSelectedDate(availableNote?.date || "");
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedNote,
    selectFirstAvailableNote
  };
};
