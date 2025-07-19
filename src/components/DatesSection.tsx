// Dates section component following SRP
import React from 'react';
import { FaPlus } from "react-icons/fa";
import { DateComponent } from './DateComponent';
import { DateRangeFilter } from './DateRangeFilter';
import { DateUtils } from '../utils/DateUtils';
import { UIUtils } from '../utils/UIUtils';
import { APP_CONSTANTS } from '../constants/AppConstants';
import type { Note } from '../models/Note';

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
  onDateRangeFilterChange: (startDate: string | null, endDate: string | null) => void;
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
  const isFilterActive = UIUtils.isFilterActive(dateRangeFilter.startDate, dateRangeFilter.endDate);
  const hasNoFilteredResults = filteredNotes.length === 0 && isFilterActive;
  const sortedFilteredNotes = DateUtils.sortNotesByDateDesc(filteredNotes);

  return (
    <section className="w-1/4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">Dates</h2>
        <div className="flex items-center gap-2">
          <DateRangeFilter
            onFilterChange={onDateRangeFilterChange}
            isActive={isFilterActive}
          />
          <button
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            onClick={onAddDate}
            aria-label="Add date"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>
      
      {hasNoFilteredResults ? (
        <div className="text-gray-500 text-sm py-4 text-center">
          {APP_CONSTANTS.UI_MESSAGES.NO_DATES_IN_RANGE}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedFilteredNotes.map((note) => (
            <DateComponent
              key={note.date}
              date={note.date}
              selected={note.date === selectedDate}
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
