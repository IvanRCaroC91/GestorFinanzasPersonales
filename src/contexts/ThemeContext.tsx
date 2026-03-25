import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeMode, themes } from '../theme/theme';

interface ThemeContextType {
    theme: Theme;
    themeMode: ThemeMode;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps { children: ReactNode; defaultMode?: ThemeMode; }

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultMode = 'light' }) => {
    const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('theme-mode') as ThemeMode;
        if (saved && (saved === 'light' || saved === 'dark')) return saved;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return defaultMode;
    });

    const [userPrefers, setUserPrefers] = useState<boolean>(!!localStorage.getItem('theme-mode'));
    const [theme, setTheme] = useState<Theme>(themes[themeMode]);
    const isDark = themeMode === 'dark';

    const toggleTheme = () => {
        const newMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newMode);
    };

    const setThemeMode = (mode: ThemeMode) => {
        setThemeModeState(mode);
        setUserPrefers(true);
        localStorage.setItem('theme-mode', mode);
    };

    useEffect(() => {
        setTheme(themes[themeMode]);
        if (themeMode === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [themeMode]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (!userPrefers) setThemeModeState(e.matches ? 'dark' : 'light');
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [userPrefers]);

    return (
        <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setThemeMode, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};

// Hook para colores semánticos
export const useFinancialColors = () => {
    const { theme } = useTheme();
    return {
        brand: theme.colors.brand.primary,
        brandSecondary: theme.colors.brand.secondary,
        income: theme.colors.semantic.success,
        expense: theme.colors.semantic.danger,
        warning: theme.colors.semantic.warning,
        info: theme.colors.semantic.info,
        background: theme.colors.surface.background,
        card: theme.colors.surface.card,
        overlay: theme.colors.surface.overlay,
        textPrimary: theme.colors.text.primary,
        textSecondary: theme.colors.text.secondary,
        inverseText: theme.colors.text.inverse,
        inverseSecondaryText: theme.colors.text.inverseSecondary,
        chartIncome: theme.colors.charts.income,
        chartExpense: theme.colors.charts.expense,
        chartSavings: theme.colors.charts.savings,
        chartInvestment: theme.colors.charts.investment,
        statusOnline: theme.colors.status.online,
        statusOffline: theme.colors.status.offline,
        statusPending: theme.colors.status.pending,
    };
};