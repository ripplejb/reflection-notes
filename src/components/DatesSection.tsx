// Dates section component following SRP
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { DateComponent } from "./DateComponent";
import { DateRangeFilter } from "./DateRangeFilter";
import { DateUtils } from "../utils/DateUtils";
import { UIUtils } from "../utils/UIUtils";
import { ThemeUtils } from "../utils/ThemeUtils";
import { APP_CONSTANTS } from "../constants/AppConstants";
import { serviceContainer } from "../services/ServiceContainer";
import type { Note } from "../models/Note";
import type { Theme } from "../services/ThemeService";

interface DatesSectionProps {
  filteredNotes: Note[];
  selectedDate: string;
  dateRangeFilter: {
    startDate: string | null;
    endDate: string | null;
  };
  onDateSelect: (date: string) => void;
  onDateUpdate: (oldDate: string, newDate: string) => void;
  onDateDelete: (date: string) => void;
  onAddDate: () => void;
  onDateRangeFilterChange: (
    startDate: string | null,
    endDate: string | null,
  ) => void;
}

export const DatesSection: React.FC<DatesSectionProps> = ({
  filteredNotes,
  selectedDate,
  dateRangeFilter,
  onDateSelect,
  onDateUpdate,
  onDateDelete,
  onAddDate,
  onDateRangeFilterChange,
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() =>
    serviceContainer.configurationService.getThemeService().getCurrentTheme(),
  );

  useEffect(() => {
    const themeService =
      serviceContainer.configurationService.getThemeService();
    const unsubscribe = themeService.onThemeChange((theme) => {
      setCurrentTheme(theme);
    });
    return unsubscribe;
  }, []);

  const isFilterActive = UIUtils.isFilterActive(
    dateRangeFilter.startDate,
    dateRangeFilter.endDate,
  );
  const hasNoFilteredResults = filteredNotes.length === 0 && isFilterActive;
  const sortedFilteredNotes = DateUtils.sortNotesByDateDesc(filteredNotes);

  return (
    <section className="w-1/4">
      <div className="flex justify-between items-center mb-2">
        <h2
          className={`font-semibold text-lg ${ThemeUtils.getText(currentTheme, "PRIMARY")}`}
        >
          Dates
        </h2>
        <div className="flex items-center gap-2">
          <DateRangeFilter
            onFilterChange={onDateRangeFilterChange}
            isActive={isFilterActive}
          />
          <button
            className={`flex items-center gap-1 ${ThemeUtils.getStatusColor(currentTheme, "info")} hover:opacity-80`}
            onClick={onAddDate}
            aria-label="Add date"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>

      {hasNoFilteredResults ? (
        <div
          className={`text-sm py-4 text-center ${ThemeUtils.getText(currentTheme, "MUTED")}`}
        >
          {APP_CONSTANTS.UI_MESSAGES.NO_DATES_IN_RANGE}
        </div>
      ) : (
        <div className="flex flex-col space-y-2 max-h-full overflow-y-auto">
          {sortedFilteredNotes.map((note) => (
            <DateComponent
              key={note.date}
              date={note.date}
              selected={note.date === selectedDate}
              theme={currentTheme}
              onSelect={onDateSelect}
              onUpdate={(newDate) => onDateUpdate(note.date, newDate)}
              onDelete={() => onDateDelete(note.date)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
