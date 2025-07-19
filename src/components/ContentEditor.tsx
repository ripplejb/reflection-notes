// Content editor component following SRP
import React, { useMemo } from "react";
import SimpleMDE from "react-simplemde-editor";
import { FaEye } from "react-icons/fa";
import { HeaderDropdown } from "./HeaderDropdown";
import type { IConfigurationService } from "../services/ConfigurationService";
import "easymde/dist/easymde.min.css";

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

  const predefinedHeaders = useMemo(
    () => configService.getPredefinedHeaders().map(h => ({ value: h, label: h })),
    [configService]
  );

  const contentOptions = useMemo(
    () => configService.getMarkdownOptions(),
    [configService]
  );

  const handleHeaderFocus = () => {
    if (!header.trim()) {
      setShowDropdown(true);
    }
  };

  const handleHeaderSelect = (selectedHeader: string) => {
    onHeaderChange(selectedHeader);
    setShowDropdown(false);
  };

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
            onToggle={() => setShowDropdown(!showDropdown)}
            onClose={() => setShowDropdown(false)}
          />
        </div>
        <div className="flex gap-2 ml-2">
          <button
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
            onClick={onViewMode}
            aria-label="Switch to view mode"
          >
            <FaEye />
          </button>
        </div>
      </div>
      <SimpleMDE
        value={content}
        onChange={onContentChange}
        options={contentOptions}
      />
    </>
  );
};
