// Content editor component following SRP
import React, { useMemo, useCallback } from "react";
import MDEditor from '@uiw/react-md-editor';
import { FaEye } from "react-icons/fa";
import { HeaderDropdown } from "./HeaderDropdown";
import type { IConfigurationService } from "../services/ConfigurationService";
import { MARKDOWN_EDITOR_CONSTANTS } from "../constants/MarkdownEditorConstants";
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface ContentEditorProps {
  header: string;
  content: string;
  configService: IConfigurationService;
  onHeaderChange: (header: string) => void;
  onContentChange: (content: string) => void;
  onViewMode: () => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  header,
  content,
  configService,
  onHeaderChange,
  onContentChange,
  onViewMode,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Memoized values for performance
  const predefinedHeaders = useMemo(
    () => configService.getPredefinedHeaders().map(h => ({ value: h, label: h })),
    [configService]
  );

  const contentOptions = useMemo(
    () => configService.getMarkdownOptions(),
    [configService]
  );

  // Event handlers using useCallback for optimization
  const handleHeaderFocus = useCallback(() => {
    if (!header.trim()) {
      setShowDropdown(true);
    }
  }, [header]);

  const handleHeaderSelect = useCallback((selectedHeader: string) => {
    onHeaderChange(selectedHeader);
    setShowDropdown(false);
  }, [onHeaderChange]);

  const handleContentChange = useCallback((val: string | undefined) => {
    onContentChange(val || '');
  }, [onContentChange]);

  const handleDropdownToggle = useCallback(() => {
    setShowDropdown(!showDropdown);
  }, [showDropdown]);

  const handleDropdownClose = useCallback(() => {
    setShowDropdown(false);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="flex-1 flex items-center gap-2">
          <HeaderDropdown
            value={header}
            options={predefinedHeaders}
            onSelect={handleHeaderSelect}
            onValueChange={onHeaderChange}
            onFocus={handleHeaderFocus}
            isOpen={showDropdown}
            onToggle={handleDropdownToggle}
            onClose={handleDropdownClose}
          />
        </div>
        <div className="flex gap-2 ml-2">
          <button
            className={MARKDOWN_EDITOR_CONSTANTS.UI_CLASSES.BUTTON_PRIMARY}
            onClick={onViewMode}
            aria-label={MARKDOWN_EDITOR_CONSTANTS.ACCESSIBILITY.VIEW_MODE_LABEL}
          >
            <FaEye />
          </button>
        </div>
      </div>
      <div className={MARKDOWN_EDITOR_CONSTANTS.UI_CLASSES.CONTAINER}>
        <MDEditor
          value={content}
          onChange={handleContentChange}
          data-color-mode={MARKDOWN_EDITOR_CONSTANTS.DEFAULT_OPTIONS.COLOR_MODE}
          preview={contentOptions.preview}
          hideToolbar={contentOptions.hideToolbar}
          height={contentOptions.height}
        />
      </div>
    </>
  );
};
