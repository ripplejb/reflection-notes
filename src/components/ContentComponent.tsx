import React, { useState } from "react";
import { ContentViewer } from "./ContentViewer";
import { ContentEditor } from "./ContentEditor";
import { serviceContainer } from "../services/ServiceContainer";

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
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [editHeader, setEditHeader] = useState(content.header);
  const [editContent, setEditContent] = useState(content.content);

  const handleEdit = () => {
    setEditHeader(content.header);
    setEditContent(content.content);
    setMode("edit");
  };

  const handleSave = () => {
    onUpdate({
      id: content.id,
      header: editHeader,
      content: editContent,
    });
    setMode("view");
  };

  const handleCancel = () => {
    setEditHeader(content.header);
    setEditContent(content.content);
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
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};
