// Importaciones de React, hooks y componentes Material-UI
import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Category as CategoryIcon,
  SwapHoriz as MovementIcon,
} from '@mui/icons-material';

// Importaciones de hooks y servicios personalizados
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/AuthContext'; // Hook de autenticación
import financeService from '../shared/services/financeService'; // Servicio de finanzas
import { Categoria, Movimiento } from '../shared/types/finance'; // Tipos de datos

// Componente de página principal (Dashboard)
const Home = () => {
  // Hooks de autenticación y navegación
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estado para el resumen de datos financieros
  const [resumen, setResumen] = useState({
    totalCategorias: 0,
    totalMovimientos: 0,
    totalPresupuestos: 0,
    ingresosMes: 0,
    gastosMes: 0,
    balanceMes: 0,
  });
  
  // Estados para categorías recientes y carga
  const [categoriasRecientes, setCategoriasRecientes] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos del dashboard al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Función para cargar todos los datos del dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar categorías desde el servicio
      const categoriasResponse = await financeService.getCategorias();
      const categoriasData = categoriasResponse.success ? categoriasResponse.data : [];
      
      // Cargar movimientos desde el servicio
      const movimientosResponse = await financeService.getMovimientos();
      const movimientosData = movimientosResponse.success ? movimientosResponse.data : [];
      
      // Cargar presupuestos desde el servicio
      const presupuestosResponse = await financeService.getPresupuestos();
      const presupuestosData = presupuestosResponse.success ? presupuestosResponse.data : [];
      
      // Calcular resumen del mes actual
      const fechaActual = new Date();
      const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
      const movimientosMes = movimientosData.filter(mov => 
        new Date(mov.fecha) >= primerDiaMes
      );
      
      // Calcular ingresos del mes
      const ingresosMes = movimientosMes
        .filter(mov => mov.tipo === 'INGRESO')
        .reduce((sum, mov) => sum + (mov.valor || 0), 0);
        
      // Calcular gastos del mes
      const gastosMes = movimientosMes
        .filter(mov => mov.tipo === 'EGRESO')
        .reduce((sum, mov) => sum + (mov.valor || 0), 0);

      // Actualizar estado con los datos calculados
      setResumen({
        totalCategorias: categoriasData.length,
        totalMovimientos: movimientosData.length,
        totalPresupuestos: presupuestosData.length,
        ingresosMes,
        gastosMes,
        balanceMes: ingresosMes - gastosMes,
      });
      
      // Guardar solo las 5 categorías más recientes
      setCategoriasRecientes(categoriasData.slice(0, 5));
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejadores de eventos
  const handleLogout = () => {
    logout();
  };

  // Función para formatear moneda a pesos colombianos
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  // Función de navegación simplificada
  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Estado de carga
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography>Cargando dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  // JSX del dashboard principal
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Header con información de usuario y logout */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">
                  Dashboard Financiero
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
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen General */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen General
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <CategoryIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" color="primary">
                      {resumen.totalCategorias}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Categorías
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <MovementIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" color="info.main">
                      {resumen.totalMovimientos}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Movimientos
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" color="success.main">
                      {resumen.totalPresupuestos}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Presupuestos
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen Mensual */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen del Mes
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      Ingresos: <strong>{formatCurrency(resumen.ingresosMes)}</strong>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      Gastos: <strong>{formatCurrency(resumen.gastosMes)}</strong>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    p={2} 
                    borderRadius={1}
                    sx={{ 
                      backgroundColor: resumen.balanceMes >= 0 ? 'success.50' : 'error.50',
                      border: `2px solid ${resumen.balanceMes >= 0 ? 'success.main' : 'error.main'}`
                    }}
                  >
                    <Typography variant="h6" color={resumen.balanceMes >= 0 ? 'success.dark' : 'error.dark'}>
                      Balance del Mes: {formatCurrency(resumen.balanceMes)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Categorías Recientes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Categorías Recientes
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigateTo('/categorias')}
                >
                  Ver Todas
                </Button>
              </Box>
              
              {categoriasRecientes.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Tipo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categoriasRecientes.map((categoria) => (
                        <TableRow key={categoria.id}>
                          <TableCell>{categoria.nombre}</TableCell>
                          <TableCell>
                            <Chip 
                              label={categoria.tipo} 
                              color={categoria.tipo === 'INGRESO' ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="textSecondary" textAlign="center" py={2}>
                  No hay categorías registradas
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Acciones Rápidas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acciones Rápidas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => navigateTo('/categorias')}
                    sx={{ py: 2 }}
                  >
                    Gestionar Categorías
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => navigateTo('/movimientos')}
                    sx={{ py: 2 }}
                  >
                    Ver Movimientos
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    onClick={() => navigateTo('/presupuestos')}
                    sx={{ py: 2 }}
                  >
                    Administrar Presupuestos
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;

// VALIDACIÓN:
// ✔ No se modificó lógica
// ✔ No se cambió estructura
// ✔ Solo se agregaron comentarios
