import React, { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { PasswordModal } from "./PasswordModal";
import usePasswordManager from "../hooks/usePasswordManager";
import { serviceContainer } from "../services/ServiceContainer";
import { UIUtils } from "../utils/UIUtils";
import { ThemeUtils } from "../utils/ThemeUtils";
import { APP_CONSTANTS } from "../constants/AppConstants";
import type { Note } from "../models/Note";
import type { Theme } from "../services/ThemeService";

interface EncryptedAppHeaderProps {
  isAutoSaving: boolean;
  loadedFileName: string | null;
  hasUnsavedChanges: boolean;
  isFileHandleLost: boolean;
  isFileEncrypted: boolean;
  onLoad: (notes: Note[], fileHandle: FileSystemFileHandle, isEncrypted: boolean, password?: string) => void;
  onSaveToLocal: (password?: string) => void;
  onSaveAs: (password?: string) => void;
  onWarnUnsaved: () => Promise<boolean>;
  onClose: () => void;
}

export const EncryptedAppHeader: React.FC<EncryptedAppHeaderProps> = ({
  isAutoSaving,
  loadedFileName,
  hasUnsavedChanges,
  isFileHandleLost,
  isFileEncrypted,
  onLoad,
  onSaveToLocal,
  onSaveAs,
  onWarnUnsaved,
  onClose,
}) => {
  // Theme state
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

  // Password management
  const { passwordState, requestPassword, closePasswordModal, handlePasswordSubmit } = usePasswordManager();
  
  // State for encryption options
  const [showEncryptionOptions, setShowEncryptionOptions] = useState(false);

  const isFileSystemSupported = UIUtils.isFileSystemAPISupported();

  const handleLoad = async () => {
    if (!isFileSystemSupported) {
      alert("File System Access API not supported in this browser.");
      return;
    }
    
    if (hasUnsavedChanges) {
      const proceed = await onWarnUnsaved();
      if (!proceed) return;
    }
    
    try {
      // First, try to load the file to see if it's encrypted
      const result = await serviceContainer.fileSystemService.load();
      const { notes: loadedNotes, fileHandle, fileName, isEncrypted } = result;
      
      if (isEncrypted) {
        // File is encrypted, request password
        try {
          const password = await requestPassword(
            "Enter File Password",
            `The file "${fileName}" is encrypted. Please enter the password to open it.`
          );
          
          // Load with password
          const decryptResult = await serviceContainer.fileSystemService.loadEncrypted(fileHandle, password);
          const { notes: decryptedNotes } = decryptResult;
          onLoad(decryptedNotes, fileHandle, true, password);
        } catch (error) {
          console.error("Failed to decrypt file:", error);
          // Error handling is done through the password modal
        }
      } else {
        // File is not encrypted
        onLoad(loadedNotes, fileHandle, false);
      }
    } catch (error) {
      console.error("Error loading file:", error);
      // User cancelled or error - do nothing
    }
  };

  const handleSave = async () => {
    if (!isFileSystemSupported) {
      alert("File System Access API not supported in this browser.");
      return;
    }
    
    try {
      if (loadedFileName) {
        // Saving to existing file
        if (isFileEncrypted) {
          // File is encrypted, request password
          const password = await requestPassword(
            "Enter File Password",
            "This file is encrypted. Please enter the password to save changes."
          );
          await onSaveToLocal(password);
        } else {
          // Check if user wants to encrypt the file
          setShowEncryptionOptions(true);
        }
      } else {
        // Save as new file - always show encryption options
        setShowEncryptionOptions(true);
      }
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Error saving file. Please try again.");
    }
  };

  const handleSaveWithEncryption = async (encrypt: boolean) => {
    setShowEncryptionOptions(false);
    
    try {
      if (encrypt) {
        const password = await requestPassword(
          "Set File Password",
          "Enter a password to encrypt this file. You'll need this password to open the file later."
        );
        
        if (loadedFileName) {
          await onSaveToLocal(password);
        } else {
          await onSaveAs(password);
        }
      } else {
        // Save without encryption
        if (loadedFileName) {
          await onSaveToLocal();
        } else {
          await onSaveAs();
        }
      }
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Error saving file. Please try again.");
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-40 border-b ${ThemeUtils.getTransitions()} ${ThemeUtils.getHeaderStyle(currentTheme)}`}>
        <div className="flex items-center justify-between px-6 py-4">
          {/* Theme toggle moved to left corner */}
          <div className="flex items-center gap-4">
            <ThemeToggle 
              themeService={serviceContainer.configurationService.getThemeService()}
            />
            {/* Title */}
            <h1 className={`text-xl font-bold ${ThemeUtils.getText(currentTheme, 'PRIMARY')}`}>
              📝 Reflection Notes
            </h1>
          </div>

          {/* File operations */}
          <div className="flex items-center gap-4">
            {isFileSystemSupported ? (
              <>
                <div className="flex gap-2 items-center h-10">
                  <button
                    className={ThemeUtils.getButtonStyle(currentTheme, 'PRIMARY')}
                    onClick={handleLoad}
                    title="Load file"
                  >
                    📁
                  </button>
                  <button
                    className={`${ThemeUtils.getButtonStyle(currentTheme, hasUnsavedChanges ? 'WARNING' : 'PRIMARY')}`}
                    onClick={handleSave}
                    title={`Save file${hasUnsavedChanges ? " (unsaved changes)" : ""}`}
                  >
                    💾{hasUnsavedChanges ? " *" : ""}
                  </button>
                  {loadedFileName && (
                    <button
                      className={ThemeUtils.getButtonStyle(currentTheme, 'DANGER')}
                      onClick={async () => {
                        if (hasUnsavedChanges) {
                          const proceed = await onWarnUnsaved();
                          if (!proceed) return;
                        }
                        onClose();
                      }}
                      title="Close file"
                    >
                      ❌
                    </button>
                  )}
                </div>
                
                {/* File status information beside buttons */}
                <div className={`text-xs ${ThemeUtils.getText(currentTheme, 'SECONDARY')}`}>
                  {loadedFileName && (
                    <div className={`flex items-center gap-1 ${isFileHandleLost ? ThemeUtils.getStatusColor(currentTheme, 'warning') : ""}`}>
                      {isFileHandleLost && <span>⚠</span>}
                      {isFileEncrypted && <span>🔒</span>}
                      <span>Loaded: {loadedFileName}</span>
                    </div>
                  )}
                  {isFileHandleLost && loadedFileName && (
                    <div className={`font-medium ${ThemeUtils.getStatusColor(currentTheme, 'warning')}`}>File connection lost - click Save to reconnect</div>
                  )}
                  {hasUnsavedChanges && (
                    <div className={`font-medium ${ThemeUtils.getStatusColor(currentTheme, 'warning')}`}>• Unsaved changes</div>
                  )}
                  {isAutoSaving && (
                    <div className={ThemeUtils.getStatusColor(currentTheme, 'info')}>
                      • Auto-saving...
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={`text-sm ${ThemeUtils.getStatusColor(currentTheme, 'error')}`}>
                {APP_CONSTANTS.UI_MESSAGES.FILE_SYSTEM_NOT_SUPPORTED}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Password Modal */}
      <PasswordModal
        isOpen={passwordState.isModalOpen}
        onClose={closePasswordModal}
        onSubmit={handlePasswordSubmit}
        title={passwordState.modalTitle}
        message={passwordState.modalMessage}
        isLoading={passwordState.isLoading}
        error={passwordState.error || undefined}
        theme={currentTheme}
      />

      {/* Encryption Options Modal */}
      {showEncryptionOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`relative w-full max-w-md mx-4 p-6 rounded-lg shadow-xl ${ThemeUtils.getModalStyle(currentTheme)}`}>
            <h3 className={`text-lg font-semibold mb-4 ${ThemeUtils.getText(currentTheme, 'PRIMARY')}`}>
              File Encryption
            </h3>
            
            <p className={`text-sm mb-6 ${ThemeUtils.getText(currentTheme, 'SECONDARY')}`}>
              Do you want to encrypt this file with a password?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleSaveWithEncryption(false)}
                className={`flex-1 px-4 py-2 border rounded-md text-sm font-medium ${ThemeUtils.getBorder(currentTheme, 'SECONDARY')} ${ThemeUtils.getText(currentTheme, 'SECONDARY')} hover:${ThemeUtils.getBackground(currentTheme, 'SECONDARY')}`}
              >
                Save without encryption
              </button>
              <button
                onClick={() => handleSaveWithEncryption(true)}
                className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                🔒 Encrypt file
              </button>
            </div>

            <div className={`mt-4 p-3 rounded border ${
              currentTheme === 'dark' 
                ? 'bg-blue-900/20 border-blue-700' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-xs ${ThemeUtils.getStatusColor(currentTheme, 'info')}`}>
                🔒 <strong>Encryption:</strong> Each file can have its own password. The entire file will be encrypted, and you'll need the password every time you load it.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
