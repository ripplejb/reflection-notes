import React, { useState, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import { FaEdit, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import "easymde/dist/easymde.min.css";

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
    onUpdate({ id: content.id, header: editHeader, content: editContent });
    setMode("view");
  };

  const handleCancel = () => {
    setEditHeader(content.header);
    setEditContent(content.content);
    setMode("view");
  };

  const onContentChange = useCallback((value: string) => {
    setEditContent(value);
  }, []);

  const contentOptions = useMemo(
    () => ({
      autofocus: true,
      spellChecker: false,
      placeholder: "Write your notes in markdown...",
    }),
    [],
  );

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      {mode === "view" ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{content.header}</h2>
            <div className="flex gap-2">
              <button
                className="text-gray-500 hover:text-blue-600"
                onClick={handleEdit}
                aria-label="Edit content"
              >
                <FaEdit />
              </button>
              <button
                className="text-gray-500 hover:text-red-600"
                onClick={onDelete}
                aria-label="Delete content"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          <div className="prose max-w-none">
            <ReactMarkdown>{content.content}</ReactMarkdown>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <input
              className="border rounded px-2 py-1 w-full font-bold text-xl"
              value={editHeader}
              onChange={(e) => setEditHeader(e.target.value)}
              placeholder="Header"
              autoFocus
            />
            <div className="flex gap-2 ml-2">
              <button
                className="text-green-600 hover:text-green-800"
                onClick={handleSave}
                aria-label="Save content"
              >
                <FaCheck />
              </button>
              <button
                className="text-gray-500 hover:text-red-600"
                onClick={handleCancel}
                aria-label="Cancel edit"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          <SimpleMDE
            value={editContent}
            onChange={onContentChange}
            options={contentOptions}
          />
        </>
      )}
    </div>
  );
};
