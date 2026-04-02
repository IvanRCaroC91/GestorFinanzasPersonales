// Importamos las herramientas necesarias de React y Material-UI
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Hooks para navegación y ubicación
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  SwapHoriz as MovementsIcon,
  AccountBalance as BudgetIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

// Definimos los elementos del menú de navegación
const menuItems = [
  {
    text: 'Dashboard', // Texto que se muestra en el menú
    icon: <DashboardIcon />, // Icono del dashboard
    path: '/home', // Ruta a la que navega
    primary: true, // Indica si es un elemento principal
  },
  {
    text: 'Movimientos',
    icon: <MovementsIcon />,
    path: '/movimientos',
    primary: true,
  },
  {
    text: 'Presupuestos',
    icon: <BudgetIcon />,
    path: '/presupuestos',
    primary: true,
  },
  {
    text: 'Categorías',
    icon: <CategoryIcon />,
    path: '/categorias',
    primary: false,
  },
];

// Componente principal de la barra lateral (sidebar)
const Sidebar: React.FC = () => {
  // Hooks de React Router para navegación y obtener la ruta actual
  const navigate = useNavigate(); // Hook para navegar a otras páginas
  const location = useLocation(); // Hook para saber en qué página estamos

  // Función para manejar la navegación cuando el usuario hace clic en un elemento del menú
  const handleNavigation = (path: string) => {
    navigate(path); // Navegamos a la ruta especificada
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: '100%',
        height: '100%',
        '& .MuiDrawer-paper': {
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E0E0E0',
          position: 'relative',
        },
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid #E0E0E0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
              Finanzas
            </Typography>
            <Typography variant="body2" sx={{ color: '#666666' }}>
              Personales
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ p: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Box key={item.text}>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                    },
                    minHeight: 48,
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isActive ? 'white' : 'text.secondary',
                    minWidth: 40,
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: item.primary ? 600 : 400,
                      fontSize: '0.95rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Box>
          );
        })}
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      <Box sx={{ p: 2, mt: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Ingresos
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrendingDownIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 600 }}>
            Gastos
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
