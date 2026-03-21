import { Container, Card, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // La redirección al login se manejará automáticamente por el ProtectedRoute
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Card style={{ padding: '2rem' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">
            Bienvenido al sistema de Gestión de Finanzas Personales
          </Typography>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </Box>
        
        <Typography variant="body1" paragraph>
          {user ? `Hola, ${user.username}!` : '¡Bienvenido!'}
        </Typography>
        
        <Typography variant="body1" color="textSecondary">
          Aquí podrás gestionar tus ingresos, gastos, presupuestos y metas financieras.
        </Typography>
      </Card>
    </Container>
  );
};

export default Home;
