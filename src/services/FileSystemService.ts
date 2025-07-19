// File system service abstraction following DIP
import type { Note } from "../models/Note";

interface FilePickerOptions {
  types: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
  excludeAcceptAllOption: boolean;
  multiple?: boolean;
}

declare global {
  interface Window {
    showOpenFilePicker?: (options: FilePickerOptions) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker?: (options: Omit<FilePickerOptions, 'multiple'>) => Promise<FileSystemFileHandle>;
  }
}

export interface IFileSystemService {
  isSupported(): boolean;
  saveAs(notes: Note[]): Promise<{ fileHandle: FileSystemFileHandle; fileName: string }>;
  save(notes: Note[], fileHandle: FileSystemFileHandle): Promise<void>;
  load(): Promise<{ notes: Note[]; fileHandle: FileSystemFileHandle; fileName: string }>;
}

export class BrowserFileSystemService implements IFileSystemService {
  isSupported(): boolean {
    return "showOpenFilePicker" in window && "showSaveFilePicker" in window;
  }

  async saveAs(notes: Note[]): Promise<{ fileHandle: FileSystemFileHandle; fileName: string }> {
    if (!this.isSupported()) {
      throw new Error("File System Access API not supported");
    }

    try {
      const handle = await window.showSaveFilePicker!({
        types: [
          {
            description: "Reflection Notes JSON",
            accept: { "application/json": [".json"] },
          },
        ],
        excludeAcceptAllOption: true,
      });

      if (!handle) {
        throw new Error("No file selected");
      }

      const jsonData = JSON.stringify(notes, null, 2);
      const writable = await handle.createWritable();
      await writable.write(jsonData);
      await writable.close();

      return { fileHandle: handle, fileName: handle.name };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error("File save was cancelled");
      }
      throw new Error(`Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async save(notes: Note[], fileHandle: FileSystemFileHandle): Promise<void> {
    try {
      const jsonData = JSON.stringify(notes, null, 2);
      const writable = await fileHandle.createWritable();
      await writable.write(jsonData);
      await writable.close();
    } catch (error) {
      throw new Error(`Failed to save to existing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async load(): Promise<{ notes: Note[]; fileHandle: FileSystemFileHandle; fileName: string }> {
    if (!this.isSupported()) {
      throw new Error("File System Access API not supported");
    }

    try {
      const [fileHandle] = await window.showOpenFilePicker!({
        types: [
          {
            description: "Reflection Notes JSON",
            accept: { "application/json": [".json"] },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      });

      if (!fileHandle) {
        throw new Error("No file selected");
      }

      const file = await fileHandle.getFile();
      const text = await file.text();
      
      let notes: Note[];
      try {
        notes = JSON.parse(text) as Note[];
      } catch {
        throw new Error("Invalid JSON file format");
      }

      // Validate that the loaded data is an array of Note objects
      if (!Array.isArray(notes)) {
        throw new Error("File does not contain a valid array of notes");
      }

      return { notes, fileHandle, fileName: fileHandle.name };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error("File selection was cancelled");
      }
      throw new Error(`Failed to load file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
