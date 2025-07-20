// Theme service following SRP and OCP
export interface IThemeService {
  getCurrentTheme(): Theme;
  setTheme(theme: Theme): void;
  toggleTheme(): void;
  isDarkMode(): boolean;
  applyTheme(theme: Theme): void;
  onThemeChange(callback: (theme: Theme) => void): () => void;
}

export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  theme: Theme;
  colorMode: 'light' | 'dark';
  cssClass: string;
}

export class ThemeService implements IThemeService {
  private currentTheme: Theme = 'light';
  private listeners: ((theme: Theme) => void)[] = [];
  private readonly STORAGE_KEY = 'reflection-notes-theme';

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      this.currentTheme = savedTheme;
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.currentTheme = 'dark';
      }
    }
    
    this.applyTheme(this.currentTheme);
    this.setupSystemThemeListener();
  }

  private setupSystemThemeListener(): void {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if no explicit theme was saved
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          const newTheme: Theme = e.matches ? 'dark' : 'light';
          this.setTheme(newTheme);
        }
      });
    }
  }

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  setTheme(theme: Theme): void {
    if (this.currentTheme !== theme) {
      this.currentTheme = theme;
      this.applyTheme(theme);
      this.saveThemePreference(theme);
      this.notifyListeners(theme);
    }
  }

  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }

  applyTheme(theme: Theme): void {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }

  getThemeConfig(): ThemeConfig {
    return {
      theme: this.currentTheme,
      colorMode: this.currentTheme,
      cssClass: this.currentTheme === 'dark' ? 'dark' : ''
    };
  }

  private saveThemePreference(theme: Theme): void {
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  onThemeChange(callback: (theme: Theme) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(theme: Theme): void {
    this.listeners.forEach(callback => callback(theme));
  }
}
