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
  onWarnUnsaved: () => Promise<boolean>;
}

export const DiskStorageControls: React.FC<DiskStorageControlsProps> = ({
  onLoad,
  loadedFileName,
  hasUnsavedChanges,
  onSaveToLocal,
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

  // Save notes to loaded file
  const handleSave = async () => {
    if (!(window as any).showSaveFilePicker) {
      alert("File System Access API not supported in this browser.");
      return;
    }
    setSaving(true);
    onSaveToLocal();
    setSaving(false);
  };

  return (
    <div className="flex flex-col items-end gap-2 mb-4">
      <div className="flex gap-2">
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
          onClick={handleLoad}
          disabled={loading}
        >
          <FaFolderOpen /> Load File
        </button>
        <button
          className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
          onClick={handleSave}
          disabled={saving || !loadedFileName}
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
