import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, TextField, Button, Typography, Box, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Person } from '@mui/icons-material';
import { useLoginForm } from '../hooks/useLoginForm';

const Login = () => {
  const {
    username,
    password,
    isLoading,
    error,
    updateField,
    handleSubmit,
    clearError,
  } = useLoginForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('username', e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('password', e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card sx={{ 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
            Iniciar Sesión
          </Typography>
          
          <Box component="form" onSubmit={handleFormSubmit} noValidate>
            <TextField
              label="Nombre de Usuario"
              fullWidth
              margin="normal"
              value={username}
              onChange={handleUsernameChange}
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
              onChange={handlePasswordChange}
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
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                onClose={clearError}
              >
                {error}
              </Alert>
            )}
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ 
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="text"
                color="secondary"
                onClick={handleRegisterClick}
                disabled={isLoading}
                sx={{ textTransform: 'none' }}
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
