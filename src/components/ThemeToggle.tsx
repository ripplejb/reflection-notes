// Theme toggle component following SRP
import React, { useState, useEffect } from 'react';
import type { IThemeService, Theme } from '../services/ThemeService';
import { THEME_CONSTANTS } from '../constants/ThemeConstants';

interface ThemeToggleProps {
  themeService: IThemeService;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  themeService, 
  className = '' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themeService.getCurrentTheme());

  useEffect(() => {
    // Subscribe to theme changes
    const unsubscribe = themeService.onThemeChange((theme) => {
      setCurrentTheme(theme);
    });

    return unsubscribe;
  }, [themeService]);

  const handleToggle = () => {
    themeService.toggleTheme();
  };

  const isDark = currentTheme === THEME_CONSTANTS.THEMES.DARK;
  const icon = isDark ? THEME_CONSTANTS.ICONS.SUN : THEME_CONSTANTS.ICONS.MOON;
  const ariaLabel = isDark 
    ? THEME_CONSTANTS.ACCESSIBILITY.LIGHT_MODE_LABEL 
    : THEME_CONSTANTS.ACCESSIBILITY.DARK_MODE_LABEL;

  return (
    <button
      onClick={handleToggle}
      className={`${THEME_CONSTANTS.UI_CLASSES.TOGGLE_BUTTON} ${className}`}
      aria-label={ariaLabel}
      title={ariaLabel}
      type="button"
    >
      <span className={THEME_CONSTANTS.UI_CLASSES.THEME_INDICATOR}>
        {icon}
      </span>
    </button>
  );
};
