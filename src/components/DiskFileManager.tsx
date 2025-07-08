import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaSave, FaFolderOpen } from "react-icons/fa";

interface DiskFileManagerProps {
  content: string;
  onLoad: (content: string) => void;
  onSave: (content: string) => void;
  hasUnsavedChanges: boolean;
}

export const DiskFileManager: React.FC<DiskFileManagerProps> = ({
  content,
  onLoad,
  onSave,
  hasUnsavedChanges,
}) => {
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(
    null,
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const pendingSaveRef = useRef(false);

  // Persist file handle using window property (File System Access API limitation)
  useEffect(() => {
    // @ts-ignore
    if (window._content_file_handle) {
      setFileHandle(window._content_file_handle);
      setFileName(localStorage.getItem("content_file_name"));
    }
  }, []);

  // Save file handle on browser close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const saveToFile = useCallback(async () => {
    if (!fileHandle) return;
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    pendingSaveRef.current = false;
    onSave(content);
  }, [fileHandle, content, onSave]);

  const loadFromFile = useCallback(async () => {
    // Warn if unsaved changes and no file loaded
    if (!fileHandle && hasUnsavedChanges) {
      if (
        !window.confirm(
          "You have unsaved changes. Loading a file will discard them. Continue?",
        )
      ) {
        return;
      }
    }
    // If file already loaded, save before switching
    if (fileHandle && hasUnsavedChanges) {
      await saveToFile();
    }
    // Open file picker
    // @ts-ignore
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: "JSON Files",
          accept: { "application/json": [".json"] },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    });
    if (fileHandle && handle.name === fileHandle.name) {
      // Same file, do nothing
      return;
    }
    const file = await handle.getFile();
    const text = await file.text();
    setFileHandle(handle);
    setFileName(handle.name);
    localStorage.setItem("content_file_name", handle.name);
    // @ts-ignore
    window._content_file_handle = handle;
    onLoad(text);
    pendingSaveRef.current = false;
  }, [fileHandle, hasUnsavedChanges, saveToFile, onLoad]);

  // Save on content change if file loaded
  useEffect(() => {
    if (fileHandle && hasUnsavedChanges && !pendingSaveRef.current) {
      pendingSaveRef.current = true;
      saveToFile();
    }
    // eslint-disable-next-line
  }, [content]);

  return (
    <div className="flex flex-col items-end gap-2 mb-2">
      <div className="flex gap-2">
        <button
          className="text-gray-500 hover:text-green-600"
          onClick={saveToFile}
          aria-label="Save to disk"
          disabled={!fileHandle}
          title={fileHandle ? "Save to file" : "Load a file first"}
        >
          <FaSave />
        </button>
        <button
          className="text-gray-500 hover:text-blue-600"
          onClick={loadFromFile}
          aria-label="Load from disk"
          title="Load file"
        >
          <FaFolderOpen />
        </button>
      </div>
      {fileName && (
        <div className="text-xs text-gray-500 text-right">
          Loaded file: {fileName}
        </div>
      )}
    </div>
  );
};
