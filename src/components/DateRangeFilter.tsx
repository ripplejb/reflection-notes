import React, { useState } from "react";
import { FaCalendarAlt, FaTimes, FaFilter } from "react-icons/fa";

interface DateRangeFilterProps {
  onFilterChange: (startDate: string | null, endDate: string | null) => void;
  isActive: boolean;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onFilterChange,
  isActive,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleApplyFilter = () => {
    if (startDate || endDate) {
      onFilterChange(
        startDate ? startDate.replace(/-/g, "") : null,
        endDate ? endDate.replace(/-/g, "") : null
      );
    } else {
      onFilterChange(null, null);
    }
    setShowFilter(false);
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    onFilterChange(null, null);
    setShowFilter(false);
  };

  const formatDateForInput = (dateStr: string) => {
    if (dateStr.length === 8) {
      return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
    }
    return dateStr;
  };

  return (
    <div className="relative">
      <button
        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
          isActive
            ? "bg-blue-100 text-blue-700 border border-blue-300"
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
        }`}
        onClick={() => setShowFilter(!showFilter)}
        aria-label="Filter dates"
      >
        <FaFilter className="text-xs" />
        {isActive ? "Filtered" : "Filter"}
      </button>

      {showFilter && (
        <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" />
              Date Range Filter
            </h3>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowFilter(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                onClick={handleApplyFilter}
              >
                Apply Filter
              </button>
              <button
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
                onClick={handleClearFilter}
              >
                Clear
              </button>
            </div>
          </div>

          {isActive && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
              <strong>Active Filter:</strong>{" "}
              {startDate && `From ${formatDateForInput(startDate)}`}
              {startDate && endDate && " "}
              {endDate && `To ${formatDateForInput(endDate)}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
