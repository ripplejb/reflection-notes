// Enhanced file system service with encryption support
import type { Note } from "../models/Note";
import type { IFileEncryptionService } from "./FileEncryptionService";

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

export interface IEncryptedFileSystemService {
  isSupported(): boolean;
  saveAs(notes: Note[], password?: string): Promise<{ fileHandle: FileSystemFileHandle; fileName: string }>;
  save(notes: Note[], fileHandle: FileSystemFileHandle, password?: string): Promise<void>;
  load(): Promise<{ notes: Note[]; fileHandle: FileSystemFileHandle; fileName: string; isEncrypted: boolean }>;
  loadEncrypted(fileHandle: FileSystemFileHandle, password: string): Promise<{ notes: Note[]; fileName: string }>;
}

export class BrowserEncryptedFileSystemService implements IEncryptedFileSystemService {
  private fileEncryptionService: IFileEncryptionService;

  constructor(fileEncryptionService: IFileEncryptionService) {
    this.fileEncryptionService = fileEncryptionService;
  }

  isSupported(): boolean {
    return "showOpenFilePicker" in window && "showSaveFilePicker" in window;
  }

  async saveAs(notes: Note[], password?: string): Promise<{ fileHandle: FileSystemFileHandle; fileName: string }> {
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

      await this.writeFile(handle, notes, password);
      return { fileHandle: handle, fileName: handle.name };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error("File save was cancelled");
      }
      throw new Error(`Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async save(notes: Note[], fileHandle: FileSystemFileHandle, password?: string): Promise<void> {
    try {
      await this.writeFile(fileHandle, notes, password);
    } catch (error) {
      throw new Error(`Failed to save to existing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async load(): Promise<{ notes: Note[]; fileHandle: FileSystemFileHandle; fileName: string; isEncrypted: boolean }> {
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
      
      // Check if file is encrypted
      const isEncrypted = this.fileEncryptionService.isFileEncrypted(text);
      
      if (isEncrypted) {
        // Return minimal info - actual decryption requires password
        return { 
          notes: [], 
          fileHandle, 
          fileName: fileHandle.name, 
          isEncrypted: true 
        };
      } else {
        // Parse unencrypted file
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

        return { notes, fileHandle, fileName: fileHandle.name, isEncrypted: false };
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error("File selection was cancelled");
      }
      throw new Error(`Failed to load file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async loadEncrypted(fileHandle: FileSystemFileHandle, password: string): Promise<{ notes: Note[]; fileName: string }> {
    try {
      const file = await fileHandle.getFile();
      const encryptedText = await file.text();
      
      // Decrypt the file content
      const decryptedText = await this.fileEncryptionService.decryptFile(encryptedText, password);
      
      // Parse the decrypted JSON
      let notes: Note[];
      try {
        notes = JSON.parse(decryptedText) as Note[];
      } catch {
        throw new Error("Invalid file format after decryption");
      }

      // Validate that the loaded data is an array of Note objects
      if (!Array.isArray(notes)) {
        throw new Error("File does not contain a valid array of notes");
      }

      return { notes, fileName: fileHandle.name };
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid password')) {
        throw new Error("Invalid password");
      }
      throw new Error(`Failed to decrypt file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async writeFile(fileHandle: FileSystemFileHandle, notes: Note[], password?: string): Promise<void> {
    let fileContent: string;
    
    if (password) {
      // Encrypt the entire file
      const jsonData = JSON.stringify(notes, null, 2);
      fileContent = await this.fileEncryptionService.encryptFile(jsonData, password);
    } else {
      // Save as plain JSON
      fileContent = JSON.stringify(notes, null, 2);
    }

    const writable = await fileHandle.createWritable();
    await writable.write(fileContent);
    await writable.close();
  }
}
