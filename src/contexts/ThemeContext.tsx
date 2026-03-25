import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeMode, themes, defaultTheme } from '../theme/theme';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultMode = 'light' 
}) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme-mode') as ThemeMode;
    if (saved && (saved === 'light' || saved === 'dark')) {
      return saved;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return defaultMode;
  });

  const [theme, setTheme] = useState<Theme>(themes[themeMode]);

  const isDark = themeMode === 'dark';

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  useEffect(() => {
    setTheme(themes[themeMode]);
    localStorage.setItem('theme-mode', themeMode);
    
    // Update document class for Tailwind dark mode
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-change if user hasn't explicitly set a preference
      if (!localStorage.getItem('theme-mode')) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value: ThemeContextType = {
    theme,
    themeMode,
    toggleTheme,
    setThemeMode,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for accessing theme colors with semantic meaning
export const useFinancialColors = () => {
  const { theme } = useTheme();
  
  return {
    // Brand colors
    brand: theme.colors.brand.primary,
    brandSecondary: theme.colors.brand.secondary,
    
    // Financial semantic colors
    income: theme.colors.semantic.success,
    expense: theme.colors.semantic.danger,
    warning: theme.colors.semantic.warning,
    info: theme.colors.semantic.info,
    
    // Surface colors
    background: theme.colors.surface.background,
    card: theme.colors.surface.card,
    
    // Text colors
    textPrimary: theme.colors.text.primary,
    textSecondary: theme.colors.text.secondary,
    
    // Chart colors
    chartIncome: theme.colors.charts.income,
    chartExpense: theme.colors.charts.expense,
    chartSavings: theme.colors.charts.savings,
    chartInvestment: theme.colors.charts.investment,
  };
};
