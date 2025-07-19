// Note operations service following SRP and DIP
import type { Note, Content } from '../models/Note';
import { UIUtils } from '../utils/UIUtils';
import { APP_CONSTANTS } from '../constants/AppConstants';

export interface INoteOperationsService {
  createNewNote(user: string): Note;
  createNewContent(): Content;
  updateNoteDate(note: Note, newDate: string): Note;
  addContentToNote(note: Note, content: Content): Note;
  updateContentInNote(note: Note, contentId: string, updatedContent: Content): Note;
  removeContentFromNote(note: Note, contentId: string): Note;
}

export class NoteOperationsService implements INoteOperationsService {
  createNewNote(user: string): Note {
    return {
      user,
      date: APP_CONSTANTS.NEW_DATE_TEMP_ID,
      contents: [],
    };
  }

  createNewContent(): Content {
    return {
      id: UIUtils.generateUniqueId(),
      header: "",
      content: "",
    };
  }

  updateNoteDate(note: Note, newDate: string): Note {
    return { ...note, date: newDate };
  }

  addContentToNote(note: Note, content: Content): Note {
    return {
      ...note,
      contents: [content, ...note.contents],
    };
  }

  updateContentInNote(note: Note, contentId: string, updatedContent: Content): Note {
    const updatedContents = note.contents.map((c) =>
      c.id === contentId ? updatedContent : c
    );
    return { ...note, contents: updatedContents };
  }

  removeContentFromNote(note: Note, contentId: string): Note {
    const updatedContents = note.contents.filter((c) => c.id !== contentId);
    return { ...note, contents: updatedContents };
  }
}
