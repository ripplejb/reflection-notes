import React, { useState } from "react";
import { FaSave, FaFolderOpen } from "react-icons/fa";
import type { Note } from "../models/Note";

interface DiskStorageControlsProps {
  notes: Note[];
  onLoad: (notes: Note[], fileHandle: FileSystemFileHandle) => void;
  onSave: (fileHandle: FileSystemFileHandle) => void;
  loadedFileName: string | null;
  hasUnsavedChanges: boolean;
  onSaveToLocal: () => void;
  onSaveAs: () => void;
  onWarnUnsaved: () => Promise<boolean>;
}

export const DiskStorageControls: React.FC<DiskStorageControlsProps> = ({
  onLoad,
  loadedFileName,
  hasUnsavedChanges,
  onSaveToLocal,
  onSaveAs,
  onWarnUnsaved,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Open file and load notes
  const handleLoad = async () => {
    if (!(window as any).showOpenFilePicker) {
      alert("File System Access API not supported in this browser.");
      return;
    }
    if (!loadedFileName && hasUnsavedChanges) {
      const proceed = await onWarnUnsaved();
      if (!proceed) return;
    }
    setLoading(true);
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: "Reflection Notes JSON",
            accept: { "application/json": [".json"] },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      });
      if (!fileHandle) return;
      const file = await fileHandle.getFile();
      const text = await file.text();
      const loadedNotes = JSON.parse(text) as Note[];
      onLoad(loadedNotes, fileHandle);
    } catch (e) {
      // User cancelled or error
    }
    setLoading(false);
  };

  // Save notes to loaded file or save as new file
  const handleSave = async () => {
    if (!(window as any).showSaveFilePicker) {
      alert("File System Access API not supported in this browser.");
      return;
    }
    setSaving(true);
    try {
      if (loadedFileName) {
        // Save to existing file
        await onSaveToLocal();
      } else {
        // Save as new file (prompt user for file name and location)
        await onSaveAs();
      }
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Error saving file. Please try again.");
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 px-3 py-2 rounded border border-blue-200 hover:border-blue-300 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed min-w-[100px] justify-center"
          onClick={handleLoad}
          disabled={loading}
        >
          <FaFolderOpen /> Load
        </button>
        <button
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 px-3 py-2 rounded border border-blue-200 hover:border-blue-300 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed min-w-[100px] justify-center"
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> Save
        </button>
      </div>
      {loadedFileName && (
        <div className="text-xs text-gray-600">Loaded: {loadedFileName}</div>
      )}
    </div>
  );
};
