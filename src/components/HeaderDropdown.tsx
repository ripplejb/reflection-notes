// Dropdown component following SRP
import React, { useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

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
        className="border rounded px-2 py-1 w-full font-bold text-xl pr-10"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        autoFocus
      />
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
        onClick={onToggle}
        aria-label="Show header options"
      >
        <FaChevronDown />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
          <div className="py-1">
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
              Quick Headers
            </div>
            {options.map((option) => (
              <button
                key={option.value}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 text-sm"
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
