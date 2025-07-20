import { useState, useEffect, useCallback, useRef } from "react";
import type { Note } from "../models/Note";
import { serviceContainer } from "../services/ServiceContainer";
import usePasswordManager from "./usePasswordManager";

export function useEncryptedNotes() {
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
  const [isFileEncrypted, setIsFileEncrypted] = useState(() => {
    // Restore encryption state from localStorage
    try {
      const stored = localStorage.getItem("reflection-notes-file-encrypted");
      return stored === "true";
    } catch (error) {
      console.warn("Failed to retrieve file encryption state from localStorage:", error);
      return false;
    }
  });
  const [filePassword, setFilePassword] = useState<string | null>(null);

  // Password management
  const { passwordState, requestPassword, closePasswordModal, handlePasswordSubmit } = usePasswordManager();

  // Helper function to update encryption state and persist to localStorage
  const updateEncryptionState = (encrypted: boolean) => {
    setIsFileEncrypted(encrypted);
    try {
      if (encrypted) {
        localStorage.setItem("reflection-notes-file-encrypted", "true");
      } else {
        localStorage.removeItem("reflection-notes-file-encrypted");
      }
    } catch (error) {
      console.warn("Failed to save file encryption state to localStorage:", error);
    }
  };

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
          // Use stored password for encrypted files
          const passwordToUse = isFileEncrypted && filePassword ? filePassword : undefined;
          await fileSystemService.save(notesToSave, fileHandle, passwordToUse);
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
  }, [fileHandle, isFileHandleLost, fileSystemService, isFileEncrypted, filePassword]);

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
      // Clear password when file handle is lost for security
      setFilePassword(null);
      
      // For encrypted files, also clear the content for security
      // This prevents unauthorized access to decrypted data after disconnection
      if (isFileEncrypted) {
        setNotes([]);
        storageService.saveNotes([]);
        setHasUnsavedChanges(false);
      }
    } else {
      setIsFileHandleLost(false);
    }
  }, [loadedFileName, fileHandle, isFileEncrypted]);

  const refresh = () => setNotes(storageService.getNotes());

  const addOrUpdateNote = (note: Note) => {
    const updated = notes.filter((n) => n.date !== note.date).concat(note);
    storageService.saveNotes(updated);
    setNotes(updated);
    
    if (fileHandle && !isFileHandleLost) {
      // Trigger autosave for any file (encrypted or unencrypted)
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
      // Trigger autosave for any file (encrypted or unencrypted)
      autosave(updated);
    } else {
      // For localStorage, data is already saved above
      setHasUnsavedChanges(true);
    }
  };

  // Save as new file
  const saveAs = async (password?: string) => {
    if (!fileSystemService.isSupported()) {
      throw new Error("File System Access API not supported");
    }
    
    const { fileHandle: handle, fileName } = await fileSystemService.saveAs(notes, password);
    
    setFileHandle(handle);
    setLoadedFileName(fileName);
    updateEncryptionState(!!password);
    setFilePassword(password || null);
    try {
      localStorage.setItem("reflection-notes-file-name", fileName);
    } catch (error) {
      console.warn("Failed to save file name to localStorage:", error);
    }
    setHasUnsavedChanges(false);
    setIsFileHandleLost(false); // Clear the lost flag when we get a new handle
  };

  // Save to disk file if loaded
  const saveToDisk = async (password?: string) => {
    if (!fileHandle) {
      await saveAs(password);
      return;
    }
    await fileSystemService.save(notes, fileHandle, password);
    
    // Update password state if provided
    if (password !== undefined) {
      setFilePassword(password || null);
      updateEncryptionState(!!password);
    }
    
    setHasUnsavedChanges(false);
    setIsFileHandleLost(false); // Clear the lost flag on successful save
  };

  // Load from disk file
  const loadFromDisk = async (notes: Note[], handle: FileSystemFileHandle, encrypted: boolean, password?: string) => {
    setNotes(notes);
    storageService.saveNotes(notes);
    setFileHandle(handle);
    setLoadedFileName(handle.name);
    updateEncryptionState(encrypted);
    setFilePassword(password || null);
    try {
      localStorage.setItem("reflection-notes-file-name", handle.name);
    } catch (error) {
      console.warn("Failed to save file name to localStorage:", error);
    }
    setHasUnsavedChanges(false);
    setIsFileHandleLost(false); // Clear the lost flag when loading a file
  };

  // For warning unsaved changes
  const warnUnsaved = async () => {
    if (!hasUnsavedChanges) return true;
    return window.confirm(
      "You have unsaved changes. Loading a file will discard them. Continue?",
    );
  };

  // For saving to local file
  const saveToLocal = async (password?: string) => {
    await saveToDisk(password);
  };

  // For loading a new file
  const handleLoad = async (loadedNotes: Note[], handle: FileSystemFileHandle, encrypted: boolean, password?: string) => {
    await loadFromDisk(loadedNotes, handle, encrypted, password);
  };

  // Clear file association (for unlinking)
  const clearFileAssociation = () => {
    setFileHandle(null);
    setLoadedFileName(null);
    updateEncryptionState(false);
    setFilePassword(null);
    setIsFileHandleLost(false);
    try {
      localStorage.removeItem("reflection-notes-file-name");
    } catch (error) {
      console.warn("Failed to clear file name from localStorage:", error);
    }
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
    isFileEncrypted,
    saveToDisk,
    saveAs,
    loadFromDisk,
    warnUnsaved,
    saveToLocal,
    handleLoad,
    clearFileAssociation,
    // Password management
    passwordState,
    requestPassword,
    closePasswordModal,
    handlePasswordSubmit,
  };
}
