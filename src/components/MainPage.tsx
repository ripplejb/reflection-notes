import React, { useState } from "react";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import { DateComponent } from "./DateComponent";
import { ContentComponent } from "./ContentComponent";
import { useNotes } from "../hooks/useLocalStorage";
import type { Note, Content } from "../models/Note";
import { DiskStorageControls } from "./DiskStorageControls";

const USER = "DEFAULT";

export const MainPage: React.FC = () => {
  const {
    notes,
    addOrUpdateNote,
    deleteNote,
    loadedFileName,
    hasUnsavedChanges,
    warnUnsaved,
    saveToLocal,
    handleLoad,
  } = useNotes();
  const [selectedDate, setSelectedDate] = useState<string>(
    notes.length > 0 ? notes[0].date : "",
  );
  const [, setTzOffset] = useState<number | undefined>(undefined);

  // Ask for location on mount
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Use Intl API to get timezone offset from location
          try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const now = new Date();
            const localDate = new Date(
              now.toLocaleString("en-US", { timeZone: tz }),
            );
            setTzOffset(-localDate.getTimezoneOffset());
          } catch {
            setTzOffset(undefined);
          }
        },
        () => setTzOffset(undefined),
      );
    }
  }, []);

  // Set timezone offset if available
  // Find selected note
  const selectedNote = notes.find((n) => n.date === selectedDate);

  // Add new date
  const handleAddDate = () => {
    // Add a new note with empty date and set it in edit mode
    const tempId = "new";
    addOrUpdateNote({
      user: USER,
      date: tempId,
      contents: [],
    });
    setSelectedDate(tempId);
  };

  // Update date (edit)
  const handleUpdateDate = (oldDate: string, newDate: string) => {
    if (oldDate === newDate || notes.some((n) => n.date === newDate)) return;
    const note = notes.find((n) => n.date === oldDate);
    if (note) {
      const updatedNote: Note = { ...note, date: newDate };
      deleteNote(oldDate);
      addOrUpdateNote(updatedNote);
      setSelectedDate(newDate);
    }
  };

  // Delete date
  const handleDeleteDate = (date: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this date and all its contents?",
      )
    ) {
      deleteNote(date);
      if (selectedDate === date) {
        setSelectedDate(
          notes.length > 1
            ? notes.find((n) => n.date !== date)?.date || ""
            : "",
        );
      }
    }
  };

  // Add new content
  const handleAddContent = () => {
    if (!selectedNote) return;
    const newContent: Content = {
      id: crypto.randomUUID(),
      header: "New Header",
      content: "",
    };
    const updatedNote: Note = {
      ...selectedNote,
      contents: [newContent, ...selectedNote.contents],
    };
    addOrUpdateNote(updatedNote);
  };

  // Update content
  const handleUpdateContent = (id: string, updated: Content) => {
    if (!selectedNote) return;
    const updatedContents = selectedNote.contents.map((c) =>
      c.id === id ? updated : c,
    );
    addOrUpdateNote({ ...selectedNote, contents: updatedContents });
  };

  // Delete content
  const handleDeleteContent = (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      if (!selectedNote) return;
      const updatedContents = selectedNote.contents.filter((c) => c.id !== id);
      addOrUpdateNote({ ...selectedNote, contents: updatedContents });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center gap-4 bg-white shadow px-6 py-4">
        <div className="flex flex-col items-center mr-4">
          <FaUserCircle className="text-3xl text-gray-500" />
          <span className="text-xs text-gray-600">{USER}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Reflection Notes</h1>
      </header>
      {/* Main Content */}
      <main className="flex flex-row gap-4 px-6 py-6">
        {/* Left: Dates */}
        <section className="w-1/4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">Dates</h2>
            <button
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              onClick={handleAddDate}
              aria-label="Add date"
            >
              <FaPlus /> Add
            </button>
          </div>
          <div className="space-y-2">
            {notes
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((note) => (
                <DateComponent
                  key={note.date}
                  date={note.date}
                  selected={note.date === selectedDate}
                  onSelect={setSelectedDate}
                  onUpdate={(newDate) => handleUpdateDate(note.date, newDate)}
                  onDelete={() => handleDeleteDate(note.date)}
                />
              ))}
          </div>
        </section>
        {/* Right: Contents */}
        <section className="flex-1">
          {"showOpenFilePicker" in window && "showSaveFilePicker" in window ? (
            <DiskStorageControls
              notes={notes}
              onLoad={handleLoad}
              onSave={saveToLocal}
              loadedFileName={loadedFileName}
              hasUnsavedChanges={hasUnsavedChanges}
              onSaveToLocal={saveToLocal}
              onWarnUnsaved={warnUnsaved}
            />
          ) : (
            <div className="mb-4 text-red-600">
              File System Access API is not supported in this browser.
            </div>
          )}
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">
              {selectedNote
                ? `Contents for ${selectedNote.date.slice(0, 4)}-${selectedNote.date.slice(4, 6)}-${selectedNote.date.slice(6, 8)}`
                : "No Date Selected"}
            </h2>
            {selectedNote && (
              <button
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                onClick={handleAddContent}
                aria-label="Add content"
              >
                <FaPlus /> Add
              </button>
            )}
          </div>
          {selectedNote ? (
            selectedNote.contents.length > 0 ? (
              selectedNote.contents.map((c) => (
                <ContentComponent
                  key={c.id}
                  content={c}
                  onUpdate={(updated) => handleUpdateContent(c.id, updated)}
                  onDelete={() => handleDeleteContent(c.id)}
                />
              ))
            ) : (
              <div className="text-gray-500">No contents for this date.</div>
            )
          ) : (
            <div className="text-gray-400">Select a date to view contents.</div>
          )}
        </section>
      </main>
    </div>
  );
};
