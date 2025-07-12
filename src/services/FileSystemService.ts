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

    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(notes, null, 2));
    await writable.close();

    return { fileHandle: handle, fileName: handle.name };
  }

  async save(notes: Note[], fileHandle: FileSystemFileHandle): Promise<void> {
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(notes, null, 2));
    await writable.close();
  }

  async load(): Promise<{ notes: Note[]; fileHandle: FileSystemFileHandle; fileName: string }> {
    if (!this.isSupported()) {
      throw new Error("File System Access API not supported");
    }

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
    const notes = JSON.parse(text) as Note[];

    return { notes, fileHandle, fileName: fileHandle.name };
  }
}
