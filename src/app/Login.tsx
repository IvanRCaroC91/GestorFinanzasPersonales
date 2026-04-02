// Importamos las herramientas necesarias de React y Material-UI
import { useState } from 'react';
import { Container, Card, TextField, Button, Typography, Box, Alert, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, Person } from '@mui/icons-material';

// Importamos nuestros hooks y componentes personalizados
import { useAuth } from '../shared/hooks/AuthContext'; // Hook que maneja la autenticación del usuario
import { useLoginForm } from '../shared/hooks/useLoginForm'; // Hook que maneja el formulario de login
import { ThemeToggle } from '../shared/components/ui/ThemeToggle'; // Botón para cambiar el tema claro/oscuro
import { useReturnTo } from '../shared/hooks/useReturnTo'; // Hook que maneja a dónde redirigir después del login

// Componente principal de la página de login
const Login = () => {
  // Obtenemos el estado de autenticación del usuario
  // isAuthenticated: nos dice si el usuario ya está logueado
  // authLoading: nos dice si está cargando la autenticación
  // authError: nos muestra si hay algún error de autenticación
  // clearError: función para limpiar los errores
  const { isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth();
  
  // Usamos nuestro hook personalizado para manejar el formulario
  // username: el nombre de usuario que escribe el usuario
  // password: la contraseña que escribe el usuario
  // isLoading: nos dice si está procesando el login
  // updateField: función para actualizar los campos del formulario
  // handleSubmit: función que se ejecuta cuando se envía el formulario
  const {
    username,
    password,
    isLoading,
    error: formError,
    updateField,
    handleSubmit,
    clearError: clearFormError,
  } = useLoginForm();
  
  // Estado para mostrar u ocultar la contraseña
  // false = contraseña oculta (puntos)
  // true = contraseña visible (texto)
  const [showPassword, setShowPassword] = useState(false);
  
  // Hook que se encarga de redirigir al usuario después del login
  // Si el usuario ya está autenticado, lo redirige a la página que corresponda
  useReturnTo(isAuthenticated, authLoading);

  // Los errores solo se limpian al enviar formulario o cerrar alerta manualmente

  // Función para mostrar u ocultar la contraseña
  // Cambia el estado de showPassword de verdadero (true) a falso(false) o viceversa
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  
  // Función para ir a la página de registro
  // Redirige al usuario a la página donde puede crear una cuenta nueva
  const handleRegisterClick = () => {
    // Redirigimos directamente a la página de registro
    window.location.href = '/register';
  };

  // Si está cargando la autenticación inicial, mostramos un indicador de carga
  if (authLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} />
      </Container>
    );
  }

  // Renderizamos el formulario de login
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Botón para cambiar entre tema claro y oscuro */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ThemeToggle />
      </Box>
      
      {/* Tarjeta principal que contiene el formulario */}
      <Card sx={{ 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}>
        <Box sx={{ p: 3 }}>
          {/* Título de la página de login */}
          <Typography variant="h5" gutterBottom align="center" sx={{ 
            mb: 3,
            color: '#3F51B5',
            fontWeight: 600,
          }}>
            Iniciar Sesión
          </Typography>
          
          {/* Mostramos alerta de error si hay algún error de autenticación o del formulario */}
          {(authError || formError) && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => {
                if (authError) clearError();
                if (formError) clearFormError();
              }}
            >
              {authError || formError}
            </Alert>
          )}
          
          {/* Formulario de login */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Nombre de Usuario"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => updateField('username', e.target.value)}
              disabled={isLoading}
              required
              autoComplete="username"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => updateField('password', e.target.value)}
              disabled={isLoading}
              required
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="small"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading || !username.trim() || !password.trim()}
              sx={{ 
                py: 1.5,
                fontSize: '1.1rem',
                backgroundColor: '#3F51B5',
                '&:hover': {
                  backgroundColor: '#303F9F',
                },
                '&:disabled': {
                  backgroundColor: '#9FA8DA',
                },
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Iniciando sesión...
                </Box>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="text"
                onClick={handleRegisterClick}
                disabled={isLoading}
                sx={{ 
                  textTransform: 'none',
                  color: '#FF4081',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 64, 129, 0.04)',
                  },
                }}
              >
                ¿No tienes una cuenta? Regístrate aquí
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default Login;
