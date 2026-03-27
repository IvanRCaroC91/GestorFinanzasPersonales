import React from 'react';
import { Box, AppBar, Toolbar, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../contexts/AuthContext';
import { useFinancialColors } from '../../contexts/ThemeContext';

// Tema MUI personalizado que usa nuestros colores financieros
const theme = createTheme({
  palette: {
    primary: {
      main: '#3F51B5', // Azul principal del tema
      light: '#5C6BC0',
      dark: '#303F9F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF4081', // Rosa secundario del tema
      light: '#F06292',
      dark: '#C2185B',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#00C853', // Verde para ingresos
      light: '#5EFC7D',
      dark: '#00A896',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#D32F2F', // Rojo para gastos
      light: '#EF5350',
      dark: '#C62828',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFA000', // Ámbar para advertencias
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F7FE', // Fondo del tema
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Box sx={{ 
          width: '280px',
          flexShrink: 0
        }}>
          <Sidebar />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Topbar user={user} />
          <Box
            component="main"
            sx={{
              flex: 1,
              p: 0,
              backgroundColor: 'background.default',
              overflow: 'auto',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
