export interface Theme {
    colors: {
        // Brand Colors
        brand: {
            primary: string;
            secondary: string;
        };

        // Semantic Colors
        semantic: {
            success: string;    // Income/Positive
            danger: string;     // Expense/Negative
            warning: string;    // Budget warnings
            info: string;       // Neutral information
        };

        // Surface Colors
        surface: {
            background: string;
            card: string;
            overlay: string;
        };

        // Text Colors
        text: {
            primary: string;
            secondary: string;
            inverse: string;
            inverseSecondary: string;
        };

        // Chart Colors
        charts: {
            income: string;
            expense: string;
            savings: string;
            investment: string;
        };

        // Status Colors for accessibility
        status: {
            online: string;
            offline: string;
            pending: string;
        };
    };

    // Typography
    typography: {
        fontFamily: {
            primary: string;
            secondary: string;
        };
        fontSize: {
            xs: string;
            sm: string;
            base: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
            '4xl': string;
        };
        fontWeight: {
            light: number;
            normal: number;
            medium: number;
            semibold: number;
            bold: number;
        };
    };

    // Spacing
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
    };

    // Border Radius
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        full: string;
    };

    // Shadows
    shadows: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };

    // Transitions
    transitions: {
        fast: string;
        normal: string;
        slow: string;
    };
}

// Light Theme Configuration
export const lightTheme: Theme = {
    colors: {
        brand: {
            primary: '#3F51B5',     // Indigo
            secondary: '#FF4081',   // Pink
        },

        semantic: {
            success: '#00C853',     // Emerald Green (Income)
            danger: '#D32F2F',      // Red Coral (Expenses)
            warning: '#FFA000',     // Amber (Budget warnings)
            info: '#0288D1',        // Light Blue (Information)
        },

        surface: {
            background: '#F4F7FE',  // Very light gray-blue
            card: '#FFFFFF',        // Pure white
            overlay: 'rgba(0, 0, 0, 0.5)',
        },

        text: {
            primary: '#2D3748',     // Dark gray
            secondary: '#718096',   // Medium gray
            inverse: '#FFFFFF',     // White
            inverseSecondary: '#A0AEC0', // Light gray
        },

        charts: {
            income: '#00C853',      // Green
            expense: '#D32F2F',     // Red
            savings: '#3F51B5',     // Indigo
            investment: '#FF4081',  // Pink
        },

        status: {
            online: '#00C853',      // Green
            offline: '#718096',     // Gray
            pending: '#FFA000',     // Amber
        },
    },

    typography: {
        fontFamily: {
            primary: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
            secondary: 'Georgia, serif',
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
    },

    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
    },

    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
    },

    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },

    transitions: {
        fast: '150ms ease-in-out',
        normal: '250ms ease-in-out',
        slow: '350ms ease-in-out',
    },
};

// Dark Theme Configuration
export const darkTheme: Theme = {
    ...lightTheme,
    colors: {
        brand: {
            primary: '#5C6BC0',     // Lighter indigo for dark mode
            secondary: '#F06292',   // Lighter pink for dark mode
        },

        semantic: {
            success: '#00E676',     // Neon green
            danger: '#FF5252',      // Bright red
            warning: '#FF9100',     // Orange
            info: '#40C4FF',        // Bright blue
        },

        surface: {
            background: '#121212',  // Dark graphite
            card: '#1E1E1E',        // Dark card
            overlay: 'rgba(0, 0, 0, 0.7)',
        },

        text: {
            primary: '#FFFFFF',     // White
            secondary: '#A0AEC0',   // Light gray
            inverse: '#2D3748',     // Dark gray
            inverseSecondary: '#718096', // Medium gray
        },

        charts: {
            income: '#00E676',      // Neon green
            expense: '#FF5252',     // Bright red
            savings: '#5C6BC0',     // Light indigo
            investment: '#F06292',  // Light pink
        },

        status: {
            online: '#00E676',      // Neon green
            offline: '#4A5568',     // Dark gray
            pending: '#FF9100',     // Orange
        },
    },
};

// Theme type for runtime usage
export type ThemeMode = 'light' | 'dark';

export const themes = {
    light: lightTheme,
    dark: darkTheme,
};

// Default theme
export const defaultTheme: Theme = lightTheme;
