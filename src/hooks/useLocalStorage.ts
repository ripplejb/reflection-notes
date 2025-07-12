import { useState } from "react";
import type { Note } from "../models/Note";
import { serviceContainer } from "../services/ServiceContainer";

export function useNotes() {
  const { storageService, fileSystemService } = serviceContainer;
  
  const [notes, setNotes] = useState<Note[]>(storageService.getNotes());
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(() => {
    const stored = localStorage.getItem("reflection-notes-file-name");
    return stored || null;
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const refresh = () => setNotes(storageService.getNotes());

  const addOrUpdateNote = (note: Note) => {
    const updated = notes.filter((n) => n.date !== note.date).concat(note);
    storageService.saveNotes(updated);
    setNotes(updated);
    setHasUnsavedChanges(true);
  };

  const deleteNote = (date: string) => {
    const updated = notes.filter((n) => n.date !== date);
    storageService.saveNotes(updated);
    setNotes(updated);
    setHasUnsavedChanges(true);
  };

  // Save as new file
  const saveAs = async () => {
    if (!fileSystemService.isSupported()) {
      throw new Error("File System Access API not supported");
    }
    
    const { fileHandle: handle, fileName } = await fileSystemService.saveAs(notes);
    
    setFileHandle(handle);
    setLoadedFileName(fileName);
    localStorage.setItem("reflection-notes-file-name", fileName);
    setHasUnsavedChanges(false);
  };

  // Save to disk file if loaded
  const saveToDisk = async () => {
    if (!fileHandle) {
      await saveAs();
      return;
    }
    await fileSystemService.save(notes, fileHandle);
    setHasUnsavedChanges(false);
  };

  // Load from disk file
  const loadFromDisk = async (handle: FileSystemFileHandle) => {
    const file = await handle.getFile();
    const text = await file.text();
    const loadedNotes = JSON.parse(text) as Note[];
    setNotes(loadedNotes);
    storageService.saveNotes(loadedNotes);
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
    storageService.saveNotes(notes);
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
