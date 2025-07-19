import React, { useState } from "react";
import { AppHeader } from "./AppHeader";
import { DatesSection } from "./DatesSection";
import { ContentsSection } from "./ContentsSection";
import { useNotes } from "../hooks/useLocalStorage";
import { useTimezone } from "../hooks/useTimezone";
import { useBeforeUnloadWarning } from "../hooks/useBeforeUnloadWarning";
import { useSelectedNote } from "../hooks/useSelectedNote";
import type { Content } from "../models/Note";
import { serviceContainer } from "../services/ServiceContainer";
import { UIUtils } from "../utils/UIUtils";
import { APP_CONSTANTS } from "../constants/AppConstants";

export const MainPage: React.FC = () => {
  // Hooks for data and state management
  const {
    notes,
    addOrUpdateNote,
    deleteNote,
    loadedFileName,
    hasUnsavedChanges,
    isFileHandleLost,
    isAutoSaving,
    warnUnsaved,
    saveToLocal,
    saveAs,
    handleLoad,
  } = useNotes();

  const { selectedDate, setSelectedDate, selectedNote, selectFirstAvailableNote } = useSelectedNote({
    notes,
    initialDate: notes.length > 0 ? notes[0].date : ""
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
    isFileHandleLost
  });

  // Computed values using services
  const filteredNotes = serviceContainer.filterService.filterByDateRange(
    notes, 
    dateRangeFilter.startDate, 
    dateRangeFilter.endDate
  );

  // Event handlers following clean code principles
  const handleDateRangeFilterChange = (startDate: string | null, endDate: string | null) => {
    setDateRangeFilter({ startDate, endDate });
    
    if (startDate || endDate) {
      const firstNoteInRange = serviceContainer.filterService.findFirstNoteInRange(
        notes, 
        startDate, 
        endDate
      );
      
      const isSelectedInRange = selectedNote 
        ? serviceContainer.filterService.isNoteInDateRange(selectedNote, startDate, endDate)
        : false;
      
      if (!isSelectedInRange && firstNoteInRange) {
        setSelectedDate(firstNoteInRange.date);
      }
    }
  };

  const handleAddDate = () => {
    setDateRangeFilter({ startDate: null, endDate: null });
    const newNote = serviceContainer.noteOperationsService.createNewNote(APP_CONSTANTS.DEFAULT_USER);
    addOrUpdateNote(newNote);
    setSelectedDate(newNote.date);
  };

  const handleUpdateDate = (oldDate: string, newDate: string) => {
    if (oldDate === newDate || notes.some((n) => n.date === newDate)) return;
    
    const note = notes.find((n) => n.date === oldDate);
    if (note) {
      const updatedNote = serviceContainer.noteOperationsService.updateNoteDate(note, newDate);
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
    
    const newContent = serviceContainer.noteOperationsService.createNewContent();
    const updatedNote = serviceContainer.noteOperationsService.addContentToNote(selectedNote, newContent);
    addOrUpdateNote(updatedNote);
  };

  const handleUpdateContent = (id: string, updated: Content) => {
    if (!selectedNote) return;
    
    const updatedNote = serviceContainer.noteOperationsService.updateContentInNote(
      selectedNote, 
      id, 
      updated
    );
    addOrUpdateNote(updatedNote);
  };

  const handleDeleteContent = (id: string) => {
    if (UIUtils.confirmDeleteContent()) {
      if (!selectedNote) return;
      
      const updatedNote = serviceContainer.noteOperationsService.removeContentFromNote(
        selectedNote, 
        id
      );
      addOrUpdateNote(updatedNote);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        notes={notes}
        isAutoSaving={isAutoSaving}
        loadedFileName={loadedFileName}
        hasUnsavedChanges={hasUnsavedChanges}
        isFileHandleLost={isFileHandleLost}
        onLoad={handleLoad}
        onSaveToLocal={saveToLocal}
        onSaveAs={saveAs}
        onWarnUnsaved={warnUnsaved}
      />
      
      <main className="flex flex-row gap-4 px-6 py-6">
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
    </div>
  );
};
