// Interfaz principal para la configuración del tema
export interface Theme {
    colors: {
        // Colores de marca principales
        brand: {
            primary: string;
            secondary: string;
        };

        // Colores semánticos (con significado)
        semantic: {
            success: string;    // Ingresos/Positivo
            danger: string;     // Gastos/Negativo
            warning: string;    // Advertencias de presupuesto
            info: string;       // Información neutral
        };

        // Colores de superficies
        surface: {
            background: string;
            card: string;
            overlay: string;
        };

        // Colores de texto
        text: {
            primary: string;
            secondary: string;
            inverse: string;
            inverseSecondary: string;
        };

        // Colores para gráficos
        charts: {
            income: string;
            expense: string;
            savings: string;
            investment: string;
        };

        // Colores de estado para accesibilidad
        status: {
            online: string;
            offline: string;
            pending: string;
        };
    };

    // Configuración de tipografía
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

    // Configuración de espaciado
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
    };

    // Configuración de bordes redondeados
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        full: string;
    };

    // Configuración de sombras
    shadows: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };

    // Configuración de transiciones
    transitions: {
        fast: string;
        normal: string;
        slow: string;
    };
}

// Configuración del tema claro
export const lightTheme: Theme = {
    colors: {
        brand: {
            primary: '#3F51B5',     // Índigo
            secondary: '#FF4081',   // Rosa
        },

        semantic: {
            success: '#00C853',     // Verde esmeralda (Ingresos)
            danger: '#D32F2F',      // Rojo coral (Gastos)
            warning: '#FFA000',     // Ámbar (Advertencias de presupuesto)
            info: '#0288D1',        // Azul claro (Información)
        },

        surface: {
            background: '#F4F7FE',  // Gris azul muy claro
            card: '#FFFFFF',        // Blanco puro
            overlay: 'rgba(0, 0, 0, 0.5)',
        },

        text: {
            primary: '#2D3748',     // Gris oscuro
            secondary: '#718096',   // Gris medio
            inverse: '#FFFFFF',     // Blanco
            inverseSecondary: '#A0AEC0', // Gris claro
        },

        charts: {
            income: '#00C853',      // Verde
            expense: '#D32F2F',     // Rojo
            savings: '#3F51B5',     // Índigo
            investment: '#FF4081',  // Rosa
        },

        status: {
            online: '#00C853',      // Verde
            offline: '#718096',     // Gris
            pending: '#FFA000',     // Ámbar
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

// Configuración del tema oscuro
export const darkTheme: Theme = {
    ...lightTheme,
    colors: {
        brand: {
            primary: '#5C6BC0',     // Índigo más claro para modo oscuro
            secondary: '#F06292',   // Rosa más clara para modo oscuro
        },

        semantic: {
            success: '#00E676',     // Verde neón
            danger: '#FF5252',      // Rojo brillante
            warning: '#FF9100',     // Naranja
            info: '#40C4FF',        // Azul brillante
        },

        surface: {
            background: '#121212',  // Grafito oscuro
            card: '#1E1E1E',        // Tarjeta oscura
            overlay: 'rgba(0, 0, 0, 0.7)',
        },

        text: {
            primary: '#FFFFFF',     // Blanco
            secondary: '#A0AEC0',   // Gris claro
            inverse: '#2D3748',     // Gris oscuro
            inverseSecondary: '#718096', // Gris medio
        },

        charts: {
            income: '#00E676',      // Verde neón
            expense: '#FF5252',     // Rojo brillante
            savings: '#5C6BC0',     // Índigo claro
            investment: '#F06292',  // Rosa clara
        },

        status: {
            online: '#00E676',      // Verde neón
            offline: '#4A5568',     // Gris oscuro
            pending: '#FF9100',     // Naranja
        },
    },
};

// Tipo de tema para uso en tiempo de ejecución
export type ThemeMode = 'light' | 'dark';

// Objeto con todos los temas disponibles
export const themes = {
    light: lightTheme,
    dark: darkTheme,
};

// Tema por defecto
export const defaultTheme: Theme = lightTheme;

