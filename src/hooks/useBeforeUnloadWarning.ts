// Custom hook for beforeunload warning following SRP
import { useEffect } from 'react';
import { APP_CONSTANTS } from '../constants/AppConstants';

interface UseBeforeUnloadWarningProps {
  hasUnsavedChanges: boolean;
  loadedFileName: string | null;
  isFileHandleLost: boolean;
}

export const useBeforeUnloadWarning = ({
  hasUnsavedChanges,
  loadedFileName,
  isFileHandleLost
}: UseBeforeUnloadWarningProps) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Only warn if there are unsaved changes and we're not dealing with a file (autosaved)
      // or if the file handle is lost
      if (hasUnsavedChanges && (!loadedFileName || isFileHandleLost)) {
        event.preventDefault();
        event.returnValue = APP_CONSTANTS.UI_MESSAGES.UNSAVED_CHANGES_WARNING;
        return APP_CONSTANTS.UI_MESSAGES.UNSAVED_CHANGES_WARNING;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, loadedFileName, isFileHandleLost]);
};
