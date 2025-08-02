import React, { useState, useEffect } from "react";
import { EncryptedAppHeader } from "./EncryptedAppHeader";
import { DatesSection } from "./DatesSection";
import { ContentsSection } from "./ContentsSection";
import { PasswordModal } from "./PasswordModal";
import { useEncryptedNotes } from "../hooks/useEncryptedNotes";
import { useTimezone } from "../hooks/useTimezone";
import { useBeforeUnloadWarning } from "../hooks/useBeforeUnloadWarning";
import { useSelectedNote } from "../hooks/useSelectedNote";
import { ThemeUtils } from "../utils/ThemeUtils";
import type { Content } from "../models/Note";
import { serviceContainer } from "../services/ServiceContainer";
import { UIUtils } from "../utils/UIUtils";
import { APP_CONSTANTS } from "../constants/AppConstants";
import type { Theme } from "../services/ThemeService";

export const MainPage: React.FC = () => {
  // Theme state management
  const [currentTheme, setCurrentTheme] = useState<Theme>(() =>
    serviceContainer.configurationService.getThemeService().getCurrentTheme(),
  );

  // Setup theme subscription
  useEffect(() => {
    const themeService =
      serviceContainer.configurationService.getThemeService();
    const unsubscribe = themeService.onThemeChange((theme) => {
      setCurrentTheme(theme);
    });
    return unsubscribe;
  }, []);

  // Hooks for data and state management
  const {
    notes,
    addOrUpdateNote,
    deleteNote,
    loadedFileName,
    hasUnsavedChanges,
    isFileHandleLost,
    isAutoSaving,
    isFileEncrypted,
    warnUnsaved,
    saveToLocal,
    saveAs,
    handleLoad,
    clearFileAssociation,
    passwordState,
    closePasswordModal,
    handlePasswordSubmit,
  } = useEncryptedNotes();

  const {
    selectedDate,
    setSelectedDate,
    selectedNote,
    selectFirstAvailableNote,
  } = useSelectedNote({
    notes,
    initialDate: notes.length > 0 ? notes[0].date : "",
  });

  const [dateRangeFilter, setDateRangeFilter] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });

  // Initialize timezone detection
  useTimezone();

  // Setup beforeunload warning
  useBeforeUnloadWarning({
    hasUnsavedChanges,
    loadedFileName,
    isFileHandleLost,
  });

  // Close file functionality
  const handleClose = () => {
    // Clear file association
    clearFileAssociation();
    // Clear notes from storage and state - reset to empty
    serviceContainer.storageService.saveNotes([]);
    // This will trigger a re-render with empty notes
    window.location.reload();
  };

  // Apply filters to notes
  const filteredNotes = notes.filter((note) => {
    const { startDate, endDate } = dateRangeFilter;
    if (!startDate && !endDate) return true;

    const noteDate = new Date(note.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (!start || noteDate >= start) && (!end || noteDate <= end);
  });

  const handleDateRangeFilterChange = (
    startDate: string | null,
    endDate: string | null,
  ) => {
    setDateRangeFilter({ startDate, endDate });
  };

  const handleAddDate = () => {
    setDateRangeFilter({ startDate: null, endDate: null });
    const newNote = serviceContainer.noteOperationsService.createNewNote(
      APP_CONSTANTS.DEFAULT_USER,
    );
    addOrUpdateNote(newNote);
    setSelectedDate(newNote.date);
  };

  const handleUpdateDate = (oldDate: string, newDate: string) => {
    if (oldDate === newDate || notes.some((n) => n.date === newDate)) return;

    const note = notes.find((n) => n.date === oldDate);
    if (note) {
      const updatedNote = serviceContainer.noteOperationsService.updateNoteDate(
        note,
        newDate,
      );
      deleteNote(oldDate);
      addOrUpdateNote(updatedNote);
      setSelectedDate(newDate);
    }
  };

  const handleDeleteDate = (date: string) => {
    if (UIUtils.confirmDeleteDate()) {
      deleteNote(date);
      if (selectedDate === date) {
        selectFirstAvailableNote(date);
      }
    }
  };

  const handleAddContent = () => {
    if (!selectedNote) return;

    const newContent =
      serviceContainer.noteOperationsService.createNewContent();
    const updatedNote = serviceContainer.noteOperationsService.addContentToNote(
      selectedNote,
      newContent,
    );
    addOrUpdateNote(updatedNote);
  };

  const handleUpdateContent = (id: string, updated: Content) => {
    if (!selectedNote) return;

    const updatedNote =
      serviceContainer.noteOperationsService.updateContentInNote(
        selectedNote,
        id,
        updated,
      );
    addOrUpdateNote(updatedNote);
  };

  const handleDeleteContent = (id: string) => {
    if (selectedNote && UIUtils.confirmDeleteContent()) {
      const updatedNote =
        serviceContainer.noteOperationsService.removeContentFromNote(
          selectedNote,
          id,
        );
      addOrUpdateNote(updatedNote);
    }
  };

  return (
    <div
      className={`max-h-full ${ThemeUtils.getTransitions()} ${ThemeUtils.getBackground(currentTheme, "SECONDARY")}`}
    >
      <EncryptedAppHeader
        isAutoSaving={isAutoSaving}
        loadedFileName={loadedFileName}
        hasUnsavedChanges={hasUnsavedChanges}
        isFileHandleLost={isFileHandleLost}
        isFileEncrypted={isFileEncrypted}
        onLoad={handleLoad}
        onSaveToLocal={saveToLocal}
        onSaveAs={saveAs}
        onWarnUnsaved={warnUnsaved}
        onClose={handleClose}
      />

      <main className="flex flex-row gap-x-4 px-6 pt-2 pb-10 max-h-[calc(100vh-5rem)]">
        <DatesSection
          filteredNotes={filteredNotes}
          selectedDate={selectedDate}
          dateRangeFilter={dateRangeFilter}
          onDateSelect={setSelectedDate}
          onDateUpdate={handleUpdateDate}
          onDateDelete={handleDeleteDate}
          onAddDate={handleAddDate}
          onDateRangeFilterChange={handleDateRangeFilterChange}
        />

        <ContentsSection
          selectedNote={selectedNote}
          onAddContent={handleAddContent}
          onUpdateContent={handleUpdateContent}
          onDeleteContent={handleDeleteContent}
        />
      </main>

      {/* Global Password Modal */}
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
    </div>
  );
};
