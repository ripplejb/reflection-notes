// Content editor component following SRP
import React, { useMemo } from "react";
import SimpleMDE from "react-simplemde-editor";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HeaderDropdown } from "./HeaderDropdown";
import type { IConfigurationService } from "../services/ConfigurationService";
import "easymde/dist/easymde.min.css";

interface ContentEditorProps {
  header: string;
  content: string;
  configService: IConfigurationService;
  onHeaderChange: (header: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  header,
  content,
  configService,
  onHeaderChange,
  onContentChange,
  onSave,
  onCancel,
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
            className="text-green-600 hover:text-green-800"
            onClick={onSave}
            aria-label="Save content"
          >
            <FaCheck />
          </button>
          <button
            className="text-gray-500 hover:text-red-600"
            onClick={onCancel}
            aria-label="Cancel edit"
          >
            <FaTimes />
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
