import React, { useState } from "react";

import DatePicker from "react-datepicker";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import type { Theme } from "../services/ThemeService";
import "react-datepicker/dist/react-datepicker.css";

interface DateComponentProps {
  date: string; // "YYYYMMDD"
  selected: boolean;
  theme?: Theme;
  onSelect: (date: string) => void;
  onUpdate: (newDate: string) => void;
  onDelete: () => void;
}

function formatDisplay(date: string) {
  // Expects "YYYYMMDD"
  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
}

function toYYYYMMDD(date: Date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

export const DateComponent: React.FC<
  DateComponentProps & {
    isEditing?: boolean;
    onDateEditDone?: () => void;
    existingDates?: string[];
    onRemoveTemp?: () => void;
    onSelectExisting?: (date: string) => void;
  }
> = ({
  date,
  selected,
  theme = 'light',
  onSelect,
  onUpdate,
  onDelete,
  isEditing = false,
  onDateEditDone,
  existingDates = [],
  onRemoveTemp,
  onSelectExisting,
}) => {
  const [mode, setMode] = useState<"view" | "edit">(
    isEditing ? "edit" : "view",
  );
  const [editDate, setEditDate] = useState<Date | null>(
    date && date !== "new"
      ? new Date(
          `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T00:00:00`,
        )
      : null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleEdit = () => {
    setEditDate(
      date && date !== "new"
        ? new Date(
            `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T00:00:00`,
          )
        : null,
    );
    setMode("edit");
  };

  const handleSave = () => {
    if (editDate) {
      const newDateStr = toYYYYMMDD(editDate);
      if (existingDates.includes(newDateStr)) {
        if (window.confirm("Date already exists. Move to existing date?")) {
          if (onRemoveTemp) onRemoveTemp();
          if (onSelectExisting) onSelectExisting(newDateStr);
        } else {
          setError("Date already exists. Please choose another date.");
        }
        return;
      }
      onUpdate(newDateStr);
      setMode("view");
      setError(null);
      if (onDateEditDone) onDateEditDone();
    }
  };

  const handleCancel = () => {
    setMode("view");
    setEditDate(null);
    setError(null);
    if (onDateEditDone) onDateEditDone();
  };

  return (
    <div
      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
        selected
          ? theme === 'dark'
            ? "bg-blue-800 border-l-4 border-blue-400 text-gray-100"
            : "bg-blue-100 border-l-4 border-blue-500"
          : theme === 'dark'
            ? "hover:bg-gray-700 text-gray-200"
            : "hover:bg-gray-100"
      }`}
      onClick={() => mode === "view" && onSelect(date)}
    >
      {mode === "view" ? (
        <>
          <span className={`text-lg ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {date === "new" ? "Set date..." : formatDisplay(date)}
          </span>
          <div className="flex gap-2">
            <button
              className={`${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-500 hover:text-blue-600'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              aria-label="Edit date"
            >
              <FaEdit />
            </button>
            <button
              className={`${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-red-400' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label="Delete date"
            >
              <FaTimes />
            </button>
          </div>
        </>
      ) : (
        <>
          <DatePicker
            selected={editDate || undefined}
            onChange={(date) => {
              setEditDate(date as Date);
              setError(null);
            }}
            dateFormat="yyyy-MM-dd"
            className={`border rounded px-2 py-1 ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              className={`${
                theme === 'dark' 
                  ? 'text-green-400 hover:text-green-300' 
                  : 'text-green-600 hover:text-green-800'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              aria-label="Save date"
            >
              <FaCheck />
            </button>
            <button
              className={`${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-red-400' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              aria-label="Cancel edit"
            >
              <FaTimes />
            </button>
          </div>
          {error && <span className={`ml-2 ${
            theme === 'dark' ? 'text-red-400' : 'text-red-500'
          }`}>{error}</span>}
        </>
      )}
    </div>
  );
};
