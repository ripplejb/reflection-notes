// App header component following SRP
import React from 'react';
import { DiskStorageControls } from './DiskStorageControls';
import { UIUtils } from '../utils/UIUtils';
import { APP_CONSTANTS } from '../constants/AppConstants';
import type { Note } from '../models/Note';

interface AppHeaderProps {
  notes: Note[];
  isAutoSaving: boolean;
  loadedFileName: string | null;
  hasUnsavedChanges: boolean;
  isFileHandleLost: boolean;
  onLoad: (notes: Note[], fileHandle: FileSystemFileHandle) => void;
  onSaveToLocal: () => void;
  onSaveAs: () => void;
  onWarnUnsaved: () => Promise<boolean>;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  notes,
  isAutoSaving,
  loadedFileName,
  hasUnsavedChanges,
  isFileHandleLost,
  onLoad,
  onSaveToLocal,
  onSaveAs,
  onWarnUnsaved,
}) => {
  const isFileSystemSupported = UIUtils.isFileSystemAPISupported();

  return (
    <header className="flex items-center justify-between gap-4 bg-white shadow px-6 py-4">
      <div className="flex items-center gap-3">
        <img 
          src="/reflection-notes/reflection-notes-icon.svg" 
          alt="Reflection Notes Logo" 
          className="w-8 h-8"
        />
        <h1 className="text-2xl font-bold text-gray-800">Reflection Notes</h1>
      </div>
      
      {isFileSystemSupported ? (
        <div className="flex items-center gap-3">
          {isAutoSaving && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className={APP_CONSTANTS.AUTOSAVE_INDICATOR.SPINNER_CLASS}></div>
              {APP_CONSTANTS.AUTOSAVE_INDICATOR.TEXT}
            </div>
          )}
          <DiskStorageControls
            notes={notes}
            onLoad={onLoad}
            loadedFileName={loadedFileName}
            hasUnsavedChanges={hasUnsavedChanges}
            isFileHandleLost={isFileHandleLost}
            onSaveToLocal={onSaveToLocal}
            onSaveAs={onSaveAs}
            onWarnUnsaved={onWarnUnsaved}
          />
        </div>
      ) : (
        <div className="text-red-600 text-sm">
          {APP_CONSTANTS.UI_MESSAGES.FILE_SYSTEM_NOT_SUPPORTED}
        </div>
      )}
    </header>
  );
};
