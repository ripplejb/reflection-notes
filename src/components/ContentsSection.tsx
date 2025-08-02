// Contents section component following SRP
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { ContentComponent } from "./ContentComponent";
import { DateUtils } from "../utils/DateUtils";
import { ThemeUtils } from "../utils/ThemeUtils";
import { APP_CONSTANTS } from "../constants/AppConstants";
import { serviceContainer } from "../services/ServiceContainer";
import type { Note, Content } from "../models/Note";
import type { Theme } from "../services/ThemeService";

interface ContentsSectionProps {
  selectedNote: Note | undefined;
  onAddContent: () => void;
  onUpdateContent: (id: string, updated: Content) => void;
  onDeleteContent: (id: string) => void;
}

export const ContentsSection: React.FC<ContentsSectionProps> = ({
  selectedNote,
  onAddContent,
  onUpdateContent,
  onDeleteContent,
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() =>
    serviceContainer.configurationService.getThemeService().getCurrentTheme(),
  );

  useEffect(() => {
    const themeService =
      serviceContainer.configurationService.getThemeService();
    const unsubscribe = themeService.onThemeChange((theme) => {
      setCurrentTheme(theme);
    });
    return unsubscribe;
  }, []);

  const getFormattedDateHeader = () => {
    if (!selectedNote) return APP_CONSTANTS.UI_MESSAGES.NO_DATE_SELECTED;
    return `Contents for ${DateUtils.formatDateForDisplay(selectedNote.date)}`;
  };

  const hasContents = selectedNote && selectedNote.contents.length > 0;

  return (
    <section className="flex-1">
      <div className="flex justify-between items-center mb-2">
        <h2
          className={`font-semibold text-lg ${ThemeUtils.getText(currentTheme, "PRIMARY")}`}
        >
          {getFormattedDateHeader()}
        </h2>
        {selectedNote && (
          <button
            className={`flex items-center gap-1 ${ThemeUtils.getStatusColor(currentTheme, "info")} hover:opacity-80`}
            onClick={onAddContent}
            aria-label="Add content"
          >
            <FaPlus /> Add
          </button>
        )}
      </div>
      <div className="max-h-full overflow-y-auto">
        {selectedNote ? (
          hasContents ? (
            selectedNote.contents.map((content) => (
              <ContentComponent
                key={content.id}
                content={content}
                onUpdate={(updated: Content) =>
                  onUpdateContent(content.id, updated)
                }
                onDelete={() => onDeleteContent(content.id)}
              />
            ))
          ) : (
            <div className={ThemeUtils.getText(currentTheme, "MUTED")}>
              {APP_CONSTANTS.UI_MESSAGES.NO_CONTENTS_FOR_DATE}
            </div>
          )
        ) : (
          <div className={ThemeUtils.getText(currentTheme, "MUTED")}>
            {APP_CONSTANTS.UI_MESSAGES.NO_DATE_SELECTED}
          </div>
        )}
      </div>
    </section>
  );
};
