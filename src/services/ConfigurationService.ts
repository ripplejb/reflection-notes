// Configuration service following OCP
export interface IConfigurationService {
  getPredefinedHeaders(): string[];
  getMarkdownOptions(): MarkdownOptions;
}

interface MarkdownOptions {
  autofocus: boolean;
  spellChecker: boolean;
  placeholder: string;
}

export class ConfigurationService implements IConfigurationService {
  private predefinedHeaders: string[] = [
    "Goals",
    "Achievements", 
    "Gratitudes",
    "Lessons Learned",
    "Challenges Faced",
    "Positive Moments",
    "Personal Growth",
    "Reflections",
    "Action Items",
    "Insights",
    "Wins",
    "Improvements",
    "Inspiration",
    "Progress Updates"
  ];

  private markdownOptions: MarkdownOptions = {
    autofocus: true,
    spellChecker: false,
    placeholder: "Write your notes in markdown...",
  };

  getPredefinedHeaders(): string[] {
    return [...this.predefinedHeaders];
  }

  getMarkdownOptions(): MarkdownOptions {
    return { ...this.markdownOptions };
  }

  addPredefinedHeader(header: string): void {
    if (!this.predefinedHeaders.includes(header)) {
      this.predefinedHeaders.push(header);
    }
  }

  removePredefinedHeader(header: string): void {
    const index = this.predefinedHeaders.indexOf(header);
    if (index > -1) {
      this.predefinedHeaders.splice(index, 1);
    }
  }
}
