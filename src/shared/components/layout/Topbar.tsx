// Importamos las herramientas necesarias de React y Material-UI
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/AuthContext'; // Hook para manejar la autenticación del usuario

// Definimos las propiedades que nuestro componente necesita recibir
interface TopbarProps {
  user: any | null; // Datos del usuario que está logueado
}

// Componente principal de la barra superior (topbar)
const Topbar: React.FC<TopbarProps> = ({ user }) => {
  // Obtenemos la función de logout del hook de autenticación
  const { logout } = useAuth();
  
  // Estado para controlar si el menú de usuario está abierto o cerrado
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Función que se ejecuta cuando el usuario hace clic en su avatar
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Abrimos el menú desplegable
  };

  // Función que se ejecuta cuando el usuario cierra el menú
  const handleMenuClose = () => {
    setAnchorEl(null); // Cerramos el menú desplegable
  };

  // Función que se ejecuta cuando el usuario quiere cerrar sesión
  const handleLogout = () => {
    logout(); // Llamamos a la función de logout del hook
    handleMenuClose(); // Cerramos el menú desplegable
  };

  return (
    // Barra superior principal de la aplicación
    <AppBar
      position="sticky" // Posición fija en la parte superior
      sx={{
        backgroundColor: '#FFFFFF', // Color de fondo blanco
        color: 'text.primary', // Color del texto principal
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // Sombra sutil
        borderBottom: '1px solid #E0E0E0', // Borde inferior
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} /> {/* Espacio flexible para empujar el contenido a la derecha */}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {user?.username || 'Usuario'} {/* Mostramos el nombre de usuario o "Usuario" por defecto */}
          </Typography>
          
          {/* Botón del menú desplegable con avatar del usuario */}
          <IconButton
            onClick={handleMenuOpen} // Al hacer clic, abrimos el menú
            size="small" // Tamaño pequeño del botón
            sx={{
              backgroundColor: 'action.hover', // Color de fondo
              '&:hover': {
                backgroundColor: 'action.selected', // Color al pasar el mouse
              },
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.username?.charAt(0).toUpperCase() || 'U'} {/* Primera letra del nombre de usuario */}
            </Avatar>
          </IconButton>
        </Box>

        {/* Menú desplegable de opciones del usuario */}
        <Menu
          anchorEl={anchorEl} // Elemento que ancla el menú
          open={Boolean(anchorEl)} // Estado para mostrar/ocultar menú
          onClose={handleMenuClose} // Función para cerrar menú
          onClick={handleMenuClose} // También cerramos al hacer clic fuera
          PaperProps={{
            elevation: 3, // Sombra del menú
            sx: {
              mt: 1.5, // Margen superior
              minWidth: 200, // Ancho mínimo
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }} // Posición de origen
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} // Anclaje del menú
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {user?.username || 'Usuario'} {/* Nombre del usuario logueado */}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user?.email || 'usuario@finanzas.com'} {/* Email del usuario */}
            </Typography>
          </Box>
          
          <Divider /> {/* Línea separadora */}
          
          {/* Opción para cerrar sesión */}
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" /> {/* Icono de logout */}
            </ListItemIcon>
            Cerrar Sesión {/* Texto de la opción */}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
