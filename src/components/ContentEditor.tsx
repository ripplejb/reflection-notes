// Content editor component following SRP
import React, { useCallback, useState, useEffect } from "react";
import MDEditor from '@uiw/react-md-editor';
import { FaEye } from "react-icons/fa";
import { HeaderDropdown } from "./HeaderDropdown";
import { ThemeUtils } from "../utils/ThemeUtils";
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
    <div className={`rounded-lg shadow-sm ${ThemeUtils.getBackground(currentTheme, 'PRIMARY')}`} data-color-mode={colorMode}>
      <div className={`p-3 space-y-3 ${ThemeUtils.getBackground(currentTheme, 'PRIMARY')}`}>
        <div className={`flex justify-between items-center mb-2`}>
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
          <button
            onClick={onViewMode}
            className={`p-3 rounded justify-self:end hover:bg-opacity-80 ${ThemeUtils.getText(currentTheme, 'SECONDARY')} hover:${ThemeUtils.getBackground(currentTheme, 'SECONDARY')}`}
            aria-label="Switch to view mode"
          >
            <FaEye size={16} />
          </button>
        </div>
        <div className={`rounded overflow-hidden border ${ThemeUtils.getBorder(currentTheme, 'SECONDARY')}`}>
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
