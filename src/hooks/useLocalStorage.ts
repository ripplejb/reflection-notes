import { useState } from "react";
import { getNotes, saveNotes } from "../utils/storage";
import type { Note } from "../models/Note";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(getNotes());
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(() => {
    const stored = localStorage.getItem("reflection-notes-file-name");
    return stored || null;
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const refresh = () => setNotes(getNotes());

  const addOrUpdateNote = (note: Note) => {
    const updated = notes.filter((n) => n.date !== note.date).concat(note);
    saveNotes(updated);
    setNotes(updated);
    setHasUnsavedChanges(true);
  };

  const deleteNote = (date: string) => {
    const updated = notes.filter((n) => n.date !== date);
    saveNotes(updated);
    setNotes(updated);
    setHasUnsavedChanges(true);
  };

  // Save as new file
  const saveAs = async () => {
    if (!(window as any).showSaveFilePicker) {
      throw new Error("File System Access API not supported");
    }
    
    const handle = await (window as any).showSaveFilePicker({
      types: [
        {
          description: "Reflection Notes JSON",
          accept: { "application/json": [".json"] },
        },
      ],
      excludeAcceptAllOption: true,
    });
    
    if (!handle) return;
    
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(notes, null, 2));
    await writable.close();
    
    setFileHandle(handle);
    setLoadedFileName(handle.name);
    localStorage.setItem("reflection-notes-file-name", handle.name);
    setHasUnsavedChanges(false);
  };

  // Save to disk file if loaded
  const saveToDisk = async () => {
    if (!fileHandle) {
      await saveAs();
      return;
    }
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(notes, null, 2));
    await writable.close();
    setHasUnsavedChanges(false);
  };

  // Load from disk file
  const loadFromDisk = async (handle: FileSystemFileHandle) => {
    const file = await handle.getFile();
    const text = await file.text();
    const loadedNotes = JSON.parse(text) as Note[];
    setNotes(loadedNotes);
    saveNotes(loadedNotes);
    setFileHandle(handle);
    setLoadedFileName(handle.name);
    localStorage.setItem("reflection-notes-file-name", handle.name);
    setHasUnsavedChanges(false);
  };

  // For warning unsaved changes
  const warnUnsaved = async () => {
    if (!hasUnsavedChanges) return true;
    return window.confirm(
      "You have unsaved changes. Loading a file will discard them. Continue?",
    );
  };

  // For saving to local file
  const saveToLocal = async () => {
    if (!fileHandle) return;
    await saveToDisk();
  };

  // For loading a new file
  const handleLoad = async (notes: Note[], handle: FileSystemFileHandle) => {
    setNotes(notes);
    saveNotes(notes);
    setFileHandle(handle);
    setLoadedFileName(handle.name);
    localStorage.setItem("reflection-notes-file-name", handle.name);
    setHasUnsavedChanges(false);
  };

  return {
    notes,
    addOrUpdateNote,
    deleteNote,
    refresh,
    fileHandle,
    loadedFileName,
    hasUnsavedChanges,
    saveToDisk,
    saveAs,
    loadFromDisk,
    warnUnsaved,
    saveToLocal,
    handleLoad,
  };
}
