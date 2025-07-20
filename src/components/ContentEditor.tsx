// Content editor component following SRP
import React, { useCallback, useState, useEffect } from "react";
import MDEditor from '@uiw/react-md-editor';
import { FaEye } from "react-icons/fa";
import { HeaderDropdown } from "./HeaderDropdown";
import type { IConfigurationService } from "../services/ConfigurationService";
import type { Theme } from "../services/ThemeService";
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface ContentEditorProps {
  header: string;
  content: string;
  configurationService: IConfigurationService;
  onHeaderChange: (header: string) => void;
  onContentChange: (value?: string) => void;
  onViewMode: () => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ 
  header,
  content,
  configurationService,
  onHeaderChange,
  onContentChange,
  onViewMode
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => 
    configurationService.getThemeService().getCurrentTheme()
  );

  // Header dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [predefinedHeaders] = useState(() => 
    configurationService.getPredefinedHeaders().map(h => ({ value: h, label: h }))
  );

  useEffect(() => {
    const themeService = configurationService.getThemeService();
    
    // Subscribe to theme changes
    const unsubscribe = themeService.onThemeChange((theme) => {
      setCurrentTheme(theme);
    });
    
    return unsubscribe;
  }, [configurationService]);

  const handleContentChange = useCallback((newValue?: string) => {
    onContentChange(newValue || "");
  }, [onContentChange]);

  const handleHeaderSelect = (selectedHeader: string) => {
    onHeaderChange(selectedHeader);
    setIsDropdownOpen(false);
  };

  const colorMode = currentTheme === 'dark' ? 'dark' : 'light';

  return (
    <div className={`rounded-lg shadow-sm ${
      currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`} data-color-mode={colorMode}>
      <div className={`flex items-center justify-between p-3 border-b ${
        currentTheme === 'dark' 
          ? 'bg-gray-800 text-gray-200 border-gray-700' 
          : 'bg-gray-50 text-gray-700 border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Content Editor</span>
        </div>
        <button
          onClick={onViewMode}
          className={`p-1 rounded hover:bg-opacity-80 ${
            currentTheme === 'dark' 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-gray-600 hover:bg-gray-200'
          }`}
          aria-label="Switch to view mode"
        >
          <FaEye size={16} />
        </button>
      </div>
      <div className={`p-3 space-y-3 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <HeaderDropdown
          value={header}
          options={predefinedHeaders}
          onSelect={handleHeaderSelect}
          onValueChange={onHeaderChange}
          onFocus={() => {}}
          placeholder="Header or select from dropdown"
          isOpen={isDropdownOpen}
          onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          onClose={() => setIsDropdownOpen(false)}
          theme={currentTheme}
        />
        <div className={`rounded overflow-hidden ${
          currentTheme === 'dark' ? 'border border-gray-600' : 'border border-gray-300'
        }`}>
          <MDEditor
            value={content}
            onChange={handleContentChange}
            height={300}
            preview="edit"
            hideToolbar={false}
            data-color-mode={colorMode}
          />
        </div>
      </div>
    </div>
  );
};
