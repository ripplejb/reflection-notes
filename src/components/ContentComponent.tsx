import React, { useState, useEffect, useRef } from "react";
import { ContentViewer } from "./ContentViewer";
import { ContentEditor } from "./ContentEditor";
import { serviceContainer } from "../services/ServiceContainer";
import { APP_CONSTANTS } from "../constants/AppConstants";

interface Content {
  id: string;
  header: string;
  content: string;
}

interface ContentComponentProps {
  content: Content;
  onUpdate: (updated: Content) => void;
  onDelete: () => void;
}

export const ContentComponent: React.FC<ContentComponentProps> = ({
  content,
  onUpdate,
  onDelete,
}) => {
  // Start in edit mode if content is empty (new content)
  const initialMode = (!content.header.trim() && !content.content.trim()) ? "edit" : "view";
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const [editHeader, setEditHeader] = useState(content.header);
  const [editContent, setEditContent] = useState(content.content);
  
  // Debounce timer for autosave
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save changes with debouncing
  useEffect(() => {
    // Only autosave if we're in edit mode and the content has actually changed
    if (mode === "edit" && (editHeader !== content.header || editContent !== content.content)) {
      // Clear existing timeout
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }

      // Set new timeout for debounced autosave
      autosaveTimeoutRef.current = setTimeout(() => {
        onUpdate({
          id: content.id,
          header: editHeader,
          content: editContent,
        });
      }, APP_CONSTANTS.TIMING.AUTOSAVE_DEBOUNCE_MS); // Configurable autosave debounce
    }

    // Cleanup timeout
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [editHeader, editContent, content.header, content.content, content.id, onUpdate, mode]);

  const handleEdit = () => {
    setEditHeader(content.header);
    setEditContent(content.content);
    setMode("edit");
  };

  const handleViewMode = () => {
    // Save any pending changes before switching to view mode
    if (editHeader !== content.header || editContent !== content.content) {
      onUpdate({
        id: content.id,
        header: editHeader,
        content: editContent,
      });
    }
    setMode("view");
  };

  const handleHeaderChange = (header: string) => {
    setEditHeader(header);
  };

  const handleContentChange = (value: string) => {
    setEditContent(value);
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      {mode === "view" ? (
        <ContentViewer
          header={content.header}
          content={content.content}
          markdownProcessor={serviceContainer.markdownProcessor}
          onEdit={handleEdit}
          onDelete={onDelete}
        />
      ) : (
        <ContentEditor
          header={editHeader}
          content={editContent}
          configService={serviceContainer.configurationService}
          onHeaderChange={handleHeaderChange}
          onContentChange={handleContentChange}
          onViewMode={handleViewMode}
        />
      )}
    </div>
  );
};
