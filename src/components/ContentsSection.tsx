// Contents section component following SRP
import React, { useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa";
import { ContentComponent } from './ContentComponent';
import { DateUtils } from '../utils/DateUtils';
import { APP_CONSTANTS } from '../constants/AppConstants';
import { serviceContainer } from '../services/ServiceContainer';
import type { Note, Content } from '../models/Note';
import type { Theme } from '../services/ThemeService';

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
    serviceContainer.configurationService.getThemeService().getCurrentTheme()
  );

  useEffect(() => {
    const themeService = serviceContainer.configurationService.getThemeService();
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
        <h2 className={`font-semibold text-lg ${
          currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {getFormattedDateHeader()}
        </h2>
        {selectedNote && (
          <button
            className={`flex items-center gap-1 ${
              currentTheme === 'dark' 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
            onClick={onAddContent}
            aria-label="Add content"
          >
            <FaPlus /> Add
          </button>
        )}
      </div>
      
      {selectedNote ? (
        hasContents ? (
          selectedNote.contents.map((content) => (
            <ContentComponent
              key={content.id}
              content={content}
              onUpdate={(updated) => onUpdateContent(content.id, updated)}
              onDelete={() => onDeleteContent(content.id)}
            />
          ))
        ) : (
          <div className={`${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {APP_CONSTANTS.UI_MESSAGES.NO_CONTENTS_FOR_DATE}
          </div>
        )
      ) : (
        <div className={`${
          currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'
        }`}>
          {APP_CONSTANTS.UI_MESSAGES.NO_DATE_SELECTED}
        </div>
      )}
    </section>
  );
};
