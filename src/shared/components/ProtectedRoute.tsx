import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../hooks/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * Componente que protege rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 * Maneja estados de carga y redirección con returnTo
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Si está cargando, mostrar spinner profesional
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ 
          bgcolor: 'background.default',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          Verificando autenticación...
        </Box>
      </Box>
    );
  }

  // Si requiere autenticación y no está autenticado, redirigir
  if (requireAuth && !isAuthenticated) {
    // Guardar la ubicación actual para redirigir después del login
    const returnTo = location.pathname !== '/login' ? location.pathname : '/home';
    return (
      <Navigate 
        to={{ pathname: redirectTo, search: `?returnTo=${encodeURIComponent(returnTo)}` }} 
        replace 
      />
    );
  }

  // Si no requiere autenticación pero está autenticado, redirigir a home
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Si todo está bien, mostrar los children
  return <>{children}</>;
};

export default ProtectedRoute;
