// Content viewer component following SRP
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { IMarkdownProcessor } from "../services/MarkdownProcessor";

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
  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{header}</h2>
        <div className="flex gap-2">
          <button
            className="text-gray-500 hover:text-blue-600"
            onClick={onEdit}
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
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdownProcessor.process(content)}
        </ReactMarkdown>
      </div>
    </>
  );
};
