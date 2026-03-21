import { useNavigate } from 'react-router-dom';
import { Container, Card, TextField, Button, Typography, Box, Alert } from '@mui/material';
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

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Card style={{ padding: '2rem' }}>
        <Typography variant="h5" gutterBottom align="center">
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
          />
          
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
            required
            autoComplete="current-password"
          />
          
          {error && (
            <Alert 
              severity="error" 
              style={{ marginTop: '1rem' }}
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
            style={{ marginTop: '1rem' }}
            disabled={isLoading}
            size="large"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
          
          <Button
            variant="text"
            color="secondary"
            fullWidth
            style={{ marginTop: '1rem' }}
            onClick={handleRegisterClick}
            disabled={isLoading}
          >
            ¿No tienes una cuenta? Regístrate aquí
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default Login;
