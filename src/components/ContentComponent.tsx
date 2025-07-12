import React, { useState, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import SimpleMDE from "react-simplemde-editor";
import { FaEdit, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import remarkGfm from "remark-gfm";
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
  const [, setHasUnsavedChanges] = useState(false);
  const handleEdit = () => {
    setEditHeader(content.header);
    setEditContent(content.content);
    setMode("edit");
  };

  const handleSave = () => {
    setMode("view");
  };

  const handleCancel = () => {
    setEditHeader(content.header);
    setEditContent(content.content);
    setMode("view");
  };

  const onContentChange = useCallback(
    (value: string) => {
      setEditContent(value);
      setHasUnsavedChanges(true);
      onUpdate({ id: content.id, header: editHeader, content: value });
    },
    [content.id, editHeader, onUpdate],
  );

  // Preprocess markdown to fix common formatting issues
  const preprocessMarkdown = (text: string): string => {
    // Fix nested lists that start with tabs or are indented
    const lines = text.split('\n');
    const processedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this line is a numbered list item that starts with tab or multiple spaces
      if (/^\s*\d+\.\s/.test(line)) {
        const indent = line.match(/^(\s*)/)?.[1] || '';
        
        // If it's indented (tab or multiple spaces), convert to proper markdown nested list
        if (indent.length > 0) {
          // Convert tabs to spaces and ensure proper markdown indentation
          const spaces = '   '; // 3 spaces for proper markdown nesting
          const cleanLine = line.replace(/^\s*/, spaces);
          processedLines.push(cleanLine);
        } else {
          processedLines.push(line);
        }
      } else if (/^\s*[-*]\s/.test(line)) {
        // Handle bullet lists with tabs/indentation
        const indent = line.match(/^(\s*)/)?.[1] || '';
        if (indent.length > 0) {
          const spaces = '   '; // 3 spaces for proper markdown nesting
          const cleanLine = line.replace(/^\s*/, spaces);
          processedLines.push(cleanLine);
        } else {
          processedLines.push(line);
        }
      } else {
        processedLines.push(line);
      }
    }
    
    return processedLines.join('\n');
  };

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
          <div className="prose">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
            >
              {preprocessMarkdown(content.content)}
            </ReactMarkdown>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <input
              className="border rounded px-2 py-1 w-full font-bold text-xl"
              value={editHeader}
              onChange={(e) => {
                setEditHeader(e.target.value);
                setHasUnsavedChanges(true);
                onUpdate({
                  id: content.id,
                  header: e.target.value,
                  content: editContent,
                });
              }}
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
