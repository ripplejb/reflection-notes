import React, { useState } from "react";

import DatePicker from "react-datepicker";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

interface DateComponentProps {
  date: string; // "YYYYMMDD"
  selected: boolean;
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

export const DateComponent: React.FC<DateComponentProps> = ({
  date,
  selected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [editDate, setEditDate] = useState<Date | null>(null);

  const handleEdit = () => {
    setEditDate(
      new Date(
        `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T00:00:00`,
      ),
    );
    setMode("edit");
  };

  const handleSave = () => {
    if (editDate) {
      onUpdate(toYYYYMMDD(editDate));
      setMode("view");
    }
  };

  const handleCancel = () => {
    setMode("view");
    setEditDate(null);
  };

  return (
    <div
      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
        selected
          ? "bg-blue-100 border-l-4 border-blue-500"
          : "hover:bg-gray-100"
      }`}
      onClick={() => mode === "view" && onSelect(date)}
    >
      {mode === "view" ? (
        <>
          <span className="text-lg">{formatDisplay(date)}</span>
          <div className="flex gap-2">
            <button
              className="text-gray-500 hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              aria-label="Edit date"
            >
              <FaEdit />
            </button>
            <button
              className="text-gray-500 hover:text-red-600"
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
            onChange={(date) => setEditDate(date as Date)}
            dateFormat="yyyy-MM-dd"
            className="border rounded px-2 py-1"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              className="text-green-600 hover:text-green-800"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              aria-label="Save date"
            >
              <FaCheck />
            </button>
            <button
              className="text-gray-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              aria-label="Cancel edit"
            >
              <FaTimes />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
