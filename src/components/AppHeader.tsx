// App header component following SRP
import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { UIUtils } from '../utils/UIUtils';
import { APP_CONSTANTS } from '../constants/AppConstants';
import { serviceContainer } from '../services/ServiceContainer';
import type { Note } from '../models/Note';
import type { Theme } from '../services/ThemeService';

interface AppHeaderProps {
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
  isAutoSaving,
  loadedFileName,
  hasUnsavedChanges,
  isFileHandleLost,
  onLoad,
  onSaveToLocal,
  onSaveAs,
  onWarnUnsaved,
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => 
    serviceContainer.configurationService.getThemeService().getCurrentTheme()
  );

  useEffect(() => {
    const themeService = serviceContainer.configurationService.getThemeService();
    const unsubscribe = themeService.onThemeChange((theme) => {
      setCurrentTheme(theme);
    });
    return unsubscribe;
  }, []);

  const isFileSystemSupported = UIUtils.isFileSystemAPISupported();

  return (
    <header className={`flex items-center justify-between gap-4 shadow px-6 py-4 transition-colors duration-200 ${
      currentTheme === 'dark' 
        ? 'bg-gray-800 text-gray-100' 
        : 'bg-white text-gray-800'
    }`}>
      <div className="flex items-center gap-3">
        <img 
          src="/reflection-notes/reflection-notes-icon.svg" 
          alt="Reflection Notes Logo" 
          className="w-8 h-8"
        />
        <h1 className={`text-2xl font-bold ${
          currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'
        }`}>Reflection Notes</h1>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-3">
          <ThemeToggle themeService={serviceContainer.configurationService.getThemeService()} />
          
          {isFileSystemSupported ? (
            <>
              {isAutoSaving && (
                <div className={`flex items-center gap-2 text-sm ${
                  currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  <div className={APP_CONSTANTS.AUTOSAVE_INDICATOR.SPINNER_CLASS}></div>
                  {APP_CONSTANTS.AUTOSAVE_INDICATOR.TEXT}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  className={`text-blue-600 hover:text-blue-800 flex items-center gap-1 px-3 py-2 rounded border min-w-[100px] justify-center h-10 disabled:text-gray-400 disabled:cursor-not-allowed ${
                    currentTheme === 'dark' 
                      ? 'border-gray-600 hover:border-gray-500 disabled:border-gray-700' 
                      : 'border-gray-300 hover:border-gray-400 disabled:border-gray-200'
                  }`}
                  onClick={async () => {
                    if (!UIUtils.isFileSystemAPISupported()) {
                      alert("File System Access API not supported in this browser.");
                      return;
                    }
                    if (hasUnsavedChanges) {
                      const proceed = await onWarnUnsaved();
                      if (!proceed) return;
                    }
                    try {
                      const { notes: loadedNotes, fileHandle } = await serviceContainer.fileSystemService.load();
                      onLoad(loadedNotes, fileHandle);
                    } catch {
                      // User cancelled or error - do nothing
                    }
                  }}
                >
                  📁 Load
                </button>
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded border min-w-[100px] justify-center h-10 ${
                    hasUnsavedChanges 
                      ? `text-orange-600 hover:text-orange-800 ${
                          currentTheme === 'dark' 
                            ? 'border-orange-400 hover:border-orange-300' 
                            : 'border-orange-200 hover:border-orange-300'
                        }` 
                      : `text-blue-600 hover:text-blue-800 ${
                          currentTheme === 'dark' 
                            ? 'border-gray-600 hover:border-gray-500' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`
                  }`}
                  onClick={async () => {
                    if (!UIUtils.isFileSystemAPISupported()) {
                      alert("File System Access API not supported in this browser.");
                      return;
                    }
                    try {
                      if (loadedFileName) {
                        await onSaveToLocal();
                      } else {
                        await onSaveAs();
                      }
                    } catch (error) {
                      console.error("Error saving file:", error);
                      alert("Error saving file. Please try again.");
                    }
                  }}
                >
                  💾 Save{hasUnsavedChanges ? " *" : ""}
                </button>
              </div>
            </>
          ) : (
            <div className={`text-sm ${
              currentTheme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}>
              {APP_CONSTANTS.UI_MESSAGES.FILE_SYSTEM_NOT_SUPPORTED}
            </div>
          )}
        </div>
        
        {isFileSystemSupported && (
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
        )}
      </div>
    </header>
  );
};
