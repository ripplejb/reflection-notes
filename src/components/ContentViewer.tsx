// Content viewer component following SRP
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaEdit, FaTrash } from "react-icons/fa";
import { serviceContainer } from "../services/ServiceContainer";
import type { IMarkdownProcessor } from "../services/MarkdownProcessor";
import type { Theme } from "../services/ThemeService";

interface ContentViewerProps {
  header: string;
  content: string;
  markdownProcessor: IMarkdownProcessor;
  onEdit: () => void;
  onDelete: () => void;
}

export const ContentViewer: React.FC<ContentViewerProps> = ({
  header,
  content,
  markdownProcessor,
  onEdit,
  onDelete,
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => 
    serviceContainer.configurationService.getThemeService().getCurrentTheme()
  );

  useEffect(() => {
    const themeService = serviceContainer.configurationService.getThemeService();
    const unsubscribe = themeService.onThemeChange((theme) => {
      setCurrentTheme(theme);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className={`text-xl font-bold ${
          currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>{header}</h2>
        <div className="flex gap-2">
          <button
            className={`${
              currentTheme === 'dark' 
                ? 'text-gray-400 hover:text-blue-400' 
                : 'text-gray-500 hover:text-blue-600'
            }`}
            onClick={onEdit}
            aria-label="Edit content"
          >
            <FaEdit />
          </button>
          <button
            className={`${
              currentTheme === 'dark' 
                ? 'text-gray-400 hover:text-red-400' 
                : 'text-gray-500 hover:text-red-600'
            }`}
            onClick={onDelete}
            aria-label="Delete content"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <div className={`prose ${
        currentTheme === 'dark' ? 'prose-invert' : ''
      }`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdownProcessor.process(content)}
        </ReactMarkdown>
      </div>
    </>
  );
};
