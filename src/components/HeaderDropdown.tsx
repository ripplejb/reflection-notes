// Dropdown component following SRP
import React, { useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import type { Theme } from "../services/ThemeService";

interface DropdownOption {
  value: string;
  label: string;
}

interface HeaderDropdownProps {
  value: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  onValueChange: (value: string) => void;
  onFocus: () => void;
  placeholder?: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  theme?: Theme;
}

export const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  value,
  options,
  onSelect,
  onValueChange,
  onFocus,
  placeholder = "Header or select from dropdown",
  isOpen,
  onToggle,
  onClose,
  theme = 'light',
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <input
        className={`rounded px-2 py-1 w-full font-bold text-xl pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          theme === 'dark' 
            ? 'bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400' 
            : 'bg-white border border-gray-300 text-gray-900'
        }`}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        autoFocus
      />
      <button
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
          theme === 'dark' 
            ? 'text-gray-400 hover:text-blue-400' 
            : 'text-gray-500 hover:text-blue-600'
        }`}
        onClick={onToggle}
        aria-label="Show header options"
      >
        <FaChevronDown />
      </button>
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 z-10 border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="py-1">
            <div className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              theme === 'dark' 
                ? 'text-gray-400 bg-gray-700' 
                : 'text-gray-500 bg-gray-50'
            }`}>
              Quick Headers
            </div>
            {options.map((option) => (
              <button
                key={option.value}
                className={`w-full text-left px-3 py-2 text-sm ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 hover:text-blue-400 text-gray-200' 
                    : 'hover:bg-blue-50 hover:text-blue-700 text-gray-900'
                }`}
                onClick={() => onSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
