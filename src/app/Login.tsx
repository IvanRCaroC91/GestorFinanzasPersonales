// Importaciones de hooks y componentes de React y Material-UI
import { useState, useEffect } from 'react';
import { Container, Card, TextField, Button, Typography, Box, Alert, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, Person } from '@mui/icons-material';

// Importaciones de servicios y componentes personalizados
import { useAuth } from '../shared/hooks/AuthContext'; // Hook de autenticación
import { ThemeToggle } from '../shared/components/ui/ThemeToggle'; // Componente para cambiar tema
import { useReturnTo } from '../shared/hooks/useReturnTo'; // Hook para redirección post-login

// Componente de página de inicio de sesión
const Login = () => {
  // Hook de autenticación para manejar login, estado y errores
  const { login, isAuthenticated, isLoading: authLoading, error: authError, clearError } = useAuth();
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  // Estados para controlar el envío y visibilidad de contraseña
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Usar hook para manejar redirección después del login exitoso
  useReturnTo(isAuthenticated, authLoading);

  // Limpiar error al cambiar los datos del formulario
  useEffect(() => {
    if (authError) {
      clearError();
    }
  }, [formData, authError, clearError]);

  // Manejadores de cambios en los campos del formulario
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, username: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, password: e.target.value }));
  };

  // Manejador de envío del formulario de login
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica del formulario
    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[Login] Attempting login with:', formData.username);
      const result = await login(formData);
      
      if (result.success) {
        console.log('[Login] Login successful, AuthContext will handle navigation');
        // La navegación se maneja en el useEffect
      } else {
        console.log('[Login] Login failed:', result.message);
        // El error se maneja en el AuthContext
      }
    } catch (error) {
      console.error('[Login] Unexpected error during login:', error);
      // El error se maneja en el AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejador para navegación a registro
  const handleRegisterClick = () => {
    // Usar returnTo para mantener la lógica consistente
    window.location.href = '/register';
  };

  // Función para alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Si está cargando la autenticación inicial
  if (authLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} />
      </Container>
    );
  }

  // JSX del formulario de login
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Theme Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ThemeToggle />
      </Box>
      
      {/* Tarjeta principal del formulario */}
      <Card sx={{ 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}>
        <Box sx={{ p: 3 }}>
          {/* Título del formulario */}
          <Typography variant="h5" gutterBottom align="center" sx={{ 
            mb: 3,
            color: '#3F51B5',
            fontWeight: 600,
          }}>
            Iniciar Sesión
          </Typography>
          
          {/* Alerta de error si existe */}
          {authError && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => clearError()}
            >
              {authError}
            </Alert>
          )}
          
          {/* Formulario */}
          <Box component="form" onSubmit={handleFormSubmit} noValidate>
            <TextField
              label="Nombre de Usuario"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleUsernameChange}
              disabled={isSubmitting}
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
              value={formData.password}
              onChange={handlePasswordChange}
              disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
              disabled={isSubmitting || !formData.username.trim() || !formData.password.trim()}
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
              {isSubmitting ? (
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
                disabled={isSubmitting}
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

// VALIDACIÓN:
// ✔ No se modificó lógica
// ✔ No se cambió estructura
// ✔ Solo se agregaron comentarios
