import { useState, useEffect, useCallback, useRef } from "react";
import type { Note } from "../models/Note";
import { serviceContainer } from "../services/ServiceContainer";

export function useNotes() {
  const { storageService, fileSystemService } = serviceContainer;
  
  const [notes, setNotes] = useState<Note[]>(storageService.getNotes());
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("reflection-notes-file-name");
      return stored || null;
    } catch (error) {
      console.warn("Failed to retrieve file name from localStorage:", error);
      return null;
    }
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isFileHandleLost, setIsFileHandleLost] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Debounce timer for autosave
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autosave function with debouncing
  const autosave = useCallback(async (notesToSave: Note[]) => {
    // Clear existing timeout
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    // Set new timeout for debounced autosave
    autosaveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsAutoSaving(true);
        
        if (fileHandle && !isFileHandleLost) {
          // Save to file if we have a valid file handle
          await fileSystemService.save(notesToSave, fileHandle);
          setHasUnsavedChanges(false);
        } else {
          // Save to localStorage (already done in addOrUpdateNote/deleteNote)
          // No need to set hasUnsavedChanges to false for localStorage
        }
      } catch (error) {
        console.warn("Autosave failed:", error);
        setHasUnsavedChanges(true);
      } finally {
        setIsAutoSaving(false);
      }
    }, 2000); // 2 second debounce
  }, [fileHandle, isFileHandleLost, fileSystemService]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  // Check if fileHandle is lost after page reload
  useEffect(() => {
    if (loadedFileName && !fileHandle) {
      // File name is shown but handle is lost due to page reload
      setIsFileHandleLost(true);
    } else {
      setIsFileHandleLost(false);
    }
  }, [loadedFileName, fileHandle]);

  const refresh = () => setNotes(storageService.getNotes());

  const addOrUpdateNote = (note: Note) => {
    const updated = notes.filter((n) => n.date !== note.date).concat(note);
    storageService.saveNotes(updated);
    setNotes(updated);
    
    if (fileHandle && !isFileHandleLost) {
      // Trigger autosave for file
      autosave(updated);
    } else {
      // For localStorage, data is already saved above
      setHasUnsavedChanges(true);
    }
  };

  const deleteNote = (date: string) => {
    const updated = notes.filter((n) => n.date !== date);
    storageService.saveNotes(updated);
    setNotes(updated);
    
    if (fileHandle && !isFileHandleLost) {
      // Trigger autosave for file
      autosave(updated);
    } else {
      // For localStorage, data is already saved above
      setHasUnsavedChanges(true);
    }
  };

  // Save as new file
  const saveAs = async () => {
    if (!fileSystemService.isSupported()) {
      throw new Error("File System Access API not supported");
    }
    
    const { fileHandle: handle, fileName } = await fileSystemService.saveAs(notes);
    
    setFileHandle(handle);
    setLoadedFileName(fileName);
    try {
      localStorage.setItem("reflection-notes-file-name", fileName);
    } catch (error) {
      console.warn("Failed to save file name to localStorage:", error);
    }
    setHasUnsavedChanges(false);
    setIsFileHandleLost(false); // Clear the lost flag when we get a new handle
  };

  // Save to disk file if loaded
  const saveToDisk = async () => {
    if (!fileHandle) {
      await saveAs();
      return;
    }
    await fileSystemService.save(notes, fileHandle);
    setHasUnsavedChanges(false);
    setIsFileHandleLost(false); // Clear the lost flag on successful save
  };

  // Load from disk file
  const loadFromDisk = async (handle: FileSystemFileHandle) => {
    try {
      const file = await handle.getFile();
      const text = await file.text();
      const loadedNotes = JSON.parse(text) as Note[];
      
      // Validate that loaded data is an array
      if (!Array.isArray(loadedNotes)) {
        throw new Error("Invalid file format: expected array of notes");
      }
      
      setNotes(loadedNotes);
      storageService.saveNotes(loadedNotes);
      setFileHandle(handle);
      setLoadedFileName(handle.name);
      try {
        localStorage.setItem("reflection-notes-file-name", handle.name);
      } catch (error) {
        console.warn("Failed to save file name to localStorage:", error);
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to load file:", error);
      throw new Error(`Failed to load file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
    await saveToDisk(); // saveToDisk already handles the fileHandle check
  };

  // For loading a new file
  const handleLoad = async (notes: Note[], handle: FileSystemFileHandle) => {
    setNotes(notes);
    storageService.saveNotes(notes);
    setFileHandle(handle);
    setLoadedFileName(handle.name);
    try {
      localStorage.setItem("reflection-notes-file-name", handle.name);
    } catch (error) {
      console.warn("Failed to save file name to localStorage:", error);
    }
    setHasUnsavedChanges(false);
    setIsFileHandleLost(false); // Clear the lost flag when loading a file
  };

  return {
    notes,
    addOrUpdateNote,
    deleteNote,
    refresh,
    fileHandle,
    loadedFileName,
    hasUnsavedChanges,
    isFileHandleLost,
    isAutoSaving,
    saveToDisk,
    saveAs,
    loadFromDisk,
    warnUnsaved,
    saveToLocal,
    handleLoad,
  };
}
