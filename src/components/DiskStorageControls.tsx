import React, { useState } from "react";
import { FaSave, FaFolderOpen } from "react-icons/fa";
import type { Note } from "../models/Note";
import { serviceContainer } from "../services/ServiceContainer";

interface DiskStorageControlsProps {
  notes: Note[];
  onLoad: (notes: Note[], fileHandle: FileSystemFileHandle) => void;
  loadedFileName: string | null;
  hasUnsavedChanges: boolean;
  isFileHandleLost: boolean;
  onSaveToLocal: () => void;
  onSaveAs: () => void;
  onWarnUnsaved: () => Promise<boolean>;
}

export const DiskStorageControls: React.FC<DiskStorageControlsProps> = ({
  onLoad,
  loadedFileName,
  hasUnsavedChanges,
  isFileHandleLost,
  onSaveToLocal,
  onSaveAs,
  onWarnUnsaved,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { fileSystemService } = serviceContainer;

  // Open file and load notes
  const handleLoad = async () => {
    if (!fileSystemService.isSupported()) {
      alert("File System Access API not supported in this browser.");
      return;
    }
    if (hasUnsavedChanges) {
      const proceed = await onWarnUnsaved();
      if (!proceed) return;
    }
    setLoading(true);
    try {
      const { notes, fileHandle } = await fileSystemService.load();
      onLoad(notes, fileHandle);
    } catch {
      // User cancelled or error - do nothing
    }
    setLoading(false);
  };

  // Save notes to loaded file or save as new file
  const handleSave = async () => {
    if (!fileSystemService.isSupported()) {
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
      <div className="flex gap-2 items-center h-10">
        <button
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 px-3 py-2 rounded border border-blue-200 hover:border-blue-300 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed min-w-[100px] justify-center h-full"
          onClick={handleLoad}
          disabled={loading}
        >
          <FaFolderOpen /> Load
        </button>
        <button
          className={`flex items-center gap-1 px-3 py-2 rounded border min-w-[100px] justify-center disabled:cursor-not-allowed h-full ${
            hasUnsavedChanges 
              ? "text-orange-600 hover:text-orange-800 border-orange-200 hover:border-orange-300 disabled:text-gray-400 disabled:border-gray-200" 
              : "text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-300 disabled:text-gray-400 disabled:border-gray-200"
          }`}
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> Save{hasUnsavedChanges ? " *" : ""}
        </button>
      </div>
      <div className="text-xs text-gray-600 text-right">
        {loadedFileName && (
          <div className={isFileHandleLost ? "text-orange-600" : ""}>
            {isFileHandleLost ? "⚠ " : ""}Loaded: {loadedFileName}
            {isFileHandleLost && <div className="text-orange-600 font-medium">File connection lost - click Save to reconnect</div>}
          </div>
        )}
        {hasUnsavedChanges && (
          <div className="text-orange-600 font-medium">• Unsaved changes</div>
        )}
      </div>
    </div>
  );
};
