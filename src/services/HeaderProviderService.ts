// Header provider service following SRP
import type { IHeaderProvider, HeaderOption } from '../interfaces/ConfigurationInterfaces';

export class HeaderProviderService implements IHeaderProvider {
  private readonly predefinedHeaders: string[] = [
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

  getPredefinedHeaders(): string[] {
    return [...this.predefinedHeaders];
  }

  getPredefinedHeaderOptions(): HeaderOption[] {
    return this.predefinedHeaders.map(header => ({
      value: header,
      label: header
    }));
  }

  addPredefinedHeader(header: string): void {
    if (!this.isValidHeader(header)) {
      throw new Error('Invalid header: Header must be a non-empty string');
    }

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

  private isValidHeader(header: string): boolean {
    return typeof header === 'string' && header.trim().length > 0;
  }
}
