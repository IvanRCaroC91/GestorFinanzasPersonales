import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, TextField, Button, Typography } from '@mui/material';

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        nombre_usuario: nombreUsuario,
        password: contraseña, // Cambiado de 'contraseña' a 'password'
      });
      setMensaje(response.data.message);
      if (response.status === 200) {
        navigate('/home');
      }
    } catch (error) {
      setMensaje('Credenciales inválidas');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Card style={{ padding: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión
        </Typography>
        <TextField
          label="Nombre de Usuario"
          fullWidth
          margin="normal"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1rem' }}
          onClick={handleLogin}
        >
          Iniciar Sesión
        </Button>
        <Button
          variant="text"
          color="secondary"
          fullWidth
          style={{ marginTop: '1rem' }}
          onClick={() => navigate('/register')}
        >
          ¿No tienes una cuenta? Regístrate aquí
        </Button>
        {mensaje && (
          <Typography color="error" style={{ marginTop: '1rem' }}>
            {mensaje}
          </Typography>
        )}
      </Card>
    </Container>
  );
};

export default Login;
