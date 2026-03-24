import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Box, Alert } from '@mui/material';

const Register = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [primerNombre, setPrimerNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validación básica de campos requeridos
    if (!primerNombre || !primerApellido || !nombreUsuario || !email || !password || !telefono) {
      setMensaje('Por favor complete todos los campos requeridos');
      setOpenDialog(true);
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensaje('Por favor ingrese un email válido');
      setOpenDialog(true);
      return;
    }

    // Validación de contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres');
      setOpenDialog(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/v1/auth/register', { //POST que se envia a la conexion server.js--------------------
        username: nombreUsuario,
        email,
        password,
        celular: telefono,
        primer_nombre: primerNombre,
        primer_apellido: primerApellido,
        segundo_nombre: segundoNombre || null,
        segundo_apellido: segundoApellido || null,
      });
      setMensaje(response.data.message);
      if (response.status === 201) {
        setOpenDialog(true);
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      if (error.response?.data?.message) {
        setMensaje(error.response.data.message);
      } else {
        setMensaje('Error al registrar el usuario');
      }
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate('/');
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
            Registro de Usuario
          </Typography>
          
          <Alert severity="error" sx={{ mb: 3 }}>
            Los campos marcados con * son obligatorios
          </Alert>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Primer Nombre *"
                fullWidth
                required
                value={primerNombre}
                onChange={(e) => setPrimerNombre(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Segundo Nombre"
                fullWidth
                value={segundoNombre}
                onChange={(e) => setSegundoNombre(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Primer Apellido *"
                fullWidth
                required
                value={primerApellido}
                onChange={(e) => setPrimerApellido(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Segundo Apellido"
                fullWidth
                value={segundoApellido}
                onChange={(e) => setSegundoApellido(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre de Usuario *"
                fullWidth
                required
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email *"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña *"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Teléfono *"
                fullWidth
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleRegister}
              sx={{ 
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Registrarse
            </Button>
          </Box>
        </Box>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Registro Exitoso</DialogTitle>
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
