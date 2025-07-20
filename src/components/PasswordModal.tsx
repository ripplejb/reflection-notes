import React, { useState, useEffect } from "react";
import { ThemeUtils } from "../utils/ThemeUtils";
import type { Theme } from "../services/ThemeService";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  title: string;
  message: string;
  isLoading?: boolean;
  error?: string;
  theme: Theme;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  message,
  isLoading = false,
  error,
  theme
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    try {
      await onSubmit(password);
      setPassword(""); // Clear on success
    } catch {
      // Error handling is done by parent component
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => e.target === e.currentTarget && !isLoading && onClose()}
    >
      <div 
        className={`relative w-full max-w-md mx-4 p-6 rounded-lg shadow-xl ${ThemeUtils.getModalStyle(theme)}`}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${ThemeUtils.getText(theme, 'PRIMARY')}`}>
            {title}
          </h2>
          {!isLoading && (
            <button
              onClick={onClose}
              className={`text-xl leading-none ${ThemeUtils.getText(theme, 'MUTED')} hover:${ThemeUtils.getText(theme, 'SECONDARY')}`}
              aria-label="Close modal"
            >
              ×
            </button>
          )}
        </div>

        {/* Message */}
        <p className={`mb-4 text-sm ${ThemeUtils.getText(theme, 'SECONDARY')}`}>
          {message}
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="password-input"
              className={`block text-sm font-medium mb-2 ${ThemeUtils.getText(theme, 'SECONDARY')}`}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoFocus
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 ${ThemeUtils.getInputStyle(theme)}`}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm ${ThemeUtils.getText(theme, 'MUTED')} hover:${ThemeUtils.getText(theme, 'SECONDARY')} disabled:opacity-50`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 ${ThemeUtils.getBorder(theme, 'SECONDARY')} ${ThemeUtils.getText(theme, 'SECONDARY')} hover:${ThemeUtils.getBackground(theme, 'SECONDARY')}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium text-white disabled:opacity-50 ${
                isLoading || !password.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>

        {/* Password security note */}
        <div className={`mt-4 p-3 rounded border ${
          theme === 'dark' 
            ? 'bg-blue-900/20 border-blue-700' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <p className={`text-xs ${ThemeUtils.getStatusColor(theme, 'info')}`}>
            🔒 <strong>Security Note:</strong> Each file can have its own password. Your password is never stored - only you know it.
          </p>
        </div>
      </div>
    </div>
  );
};
