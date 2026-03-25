import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { ThemeToggle } from '../components/ThemeToggle';
import { Container, Card, TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Alert } from '@mui/material';

const Register = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validación básica de campos requeridos
    if (!primerNombre || !primerApellido || !nombreUsuario || !email || !password || !confirmPassword || !telefono) {
      setMensaje('Por favor complete todos los campos requeridos');
      setIsError(true);
      setOpenDialog(true);
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensaje('Por favor ingrese un email válido');
      setIsError(true);
      setOpenDialog(true);
      return;
    }

    // Validación de contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres');
      setIsError(true);
      setOpenDialog(true);
      return;
    }

    // Validación de confirmación de contraseña
    if (password !== confirmPassword) {
      setMensaje('Las contraseñas no coinciden');
      setIsError(true);
      setOpenDialog(true);
      return;
    }

    // Validación de teléfono (solo números y 10 caracteres)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(telefono)) {
      setMensaje('El teléfono debe contener exactamente 10 números');
      setIsError(true);
      setOpenDialog(true);
      return;
    }

    try {
      const response = await authService.register({
        username: nombreUsuario,
        email,
        password,
        celular: telefono,
        primer_nombre: primerNombre,
        primer_apellido: primerApellido,
        segundo_nombre: segundoNombre || null,
        segundo_apellido: segundoApellido || null,
      });
      setMensaje(response.message);
      setIsError(false);
      if (response.success) {
        setOpenDialog(true);
      }
    } catch (error: unknown) {
      console.error('Error en registro:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        setMensaje(axiosError.response.data.message);
      } else {
        setMensaje('Error al registrar el usuario');
      }
      setIsError(true);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (!isError) {
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Theme Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ThemeToggle />
      </Box>
      
      <Card sx={{ 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
      }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom align="center" sx={{ 
            mb: 3,
            color: '#3F51B5',
            fontWeight: 600,
          }}>
            Registro de Usuario
          </Typography>
          
          <Alert severity="error" sx={{ mb: 3 }}>
            Los campos marcados con * son obligatorios
          </Alert>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Primer Nombre *"
                fullWidth
                required
                value={primerNombre}
                onChange={(e) => setPrimerNombre(e.target.value)}
              />
              <TextField
                label="Segundo Nombre"
                fullWidth
                value={segundoNombre}
                onChange={(e) => setSegundoNombre(e.target.value)}
              />
              <TextField
                label="Primer Apellido *"
                fullWidth
                required
                value={primerApellido}
                onChange={(e) => setPrimerApellido(e.target.value)}
              />
              <TextField
                label="Segundo Apellido"
                fullWidth
                value={segundoApellido}
                onChange={(e) => setSegundoApellido(e.target.value)}
              />
              <TextField
                label="Nombre de Usuario *"
                fullWidth
                required
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
              <TextField
                label="Email *"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Contraseña *"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                label="Confirmar Contraseña *"
                type="password"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <TextField
                label="Teléfono *"
                fullWidth
                required
                value={telefono}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length <= 10) {
                    setTelefono(value);
                  }
                }}
                placeholder="Ej: 1234567890"
                inputProps={{
                  maxLength: 10,
                  pattern: "[0-9]{10}"
                } as React.InputHTMLAttributes<HTMLInputElement>}
              />
            </Box>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleRegister}
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
              Registrarse
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ 
                  textTransform: 'none',
                  color: '#FF4081',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 64, 129, 0.04)',
                  },
                }}
              >
                ¿Ya tienes una cuenta? Inicia sesión aquí
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isError ? 'Error de Validación' : 'Registro Exitoso'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{mensaje}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Register;
