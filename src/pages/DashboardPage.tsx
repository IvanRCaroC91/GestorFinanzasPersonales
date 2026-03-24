import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
  Category as CategoryIcon,
  SwapHoriz as MovementIcon,
  AccountBalanceWallet as BudgetIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import financeService from '../services/financeService';
import { Categoria, Movimiento } from '../types/finance';

interface ResumenData {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  totalCategorias: number;
  totalMovimientos: number;
  totalPresupuestos: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState<ResumenData>({
    totalIngresos: 0,
    totalGastos: 0,
    balance: 0,
    totalCategorias: 0,
    totalMovimientos: 0,
    totalPresupuestos: 0,
  });
  const [movimientosRecientes, setMovimientosRecientes] = useState<Movimiento[]>([]);
  const [categoriasRecientes, setCategoriasRecientes] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos en paralelo
      const [movimientosResponse, categoriasResponse, presupuestosResponse] = await Promise.all([
        financeService.getMovimientos(),
        financeService.getCategorias(),
        financeService.getPresupuestos(),
      ]);

      const movimientos = movimientosResponse.success ? movimientosResponse.data : [];
      const categorias = categoriasResponse.success ? categoriasResponse.data : [];
      const presupuestos = presupuestosResponse.success ? presupuestosResponse.data : [];

      // Calcular resumen del mes actual
      const fechaActual = new Date();
      const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
      
      const movimientosMes = movimientos.filter(mov => 
        new Date(mov.fecha) >= primerDiaMes
      );

      const totalIngresos = movimientosMes
        .filter(mov => mov.tipo === 'INGRESO')
        .reduce((sum, mov) => sum + mov.monto, 0);

      const totalGastos = movimientosMes
        .filter(mov => mov.tipo === 'GASTO')
        .reduce((sum, mov) => sum + mov.monto, 0);

      setResumen({
        totalIngresos,
        totalGastos,
        balance: totalIngresos - totalGastos,
        totalCategorias: categorias.length,
        totalMovimientos: movimientos.length,
        totalPresupuestos: presupuestos.length,
      });

      // Datos recientes
      setMovimientosRecientes(movimientos.slice(0, 5));
      setCategoriasRecientes(categorias.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1A1A1A', mb: 1 }}>
          Dashboard Financiero
        </Typography>
        <Typography variant="body2" sx={{ color: '#666666' }}>
          Resumen general de tus finanzas personales
        </Typography>
      </Box>

      {/* Resumen General */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                <Box>
                  <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {formatCurrency(resumen.totalIngresos)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total Ingresos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingDownIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
                <Box>
                  <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                    {formatCurrency(resumen.totalGastos)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total Gastos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BalanceIcon sx={{ color: resumen.balance >= 0 ? 'primary.main' : 'secondary.main', fontSize: 32 }} />
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: resumen.balance >= 0 ? 'primary.main' : 'secondary.main', 
                      fontWeight: 'bold' 
                    }}
                  >
                    {formatCurrency(resumen.balance)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Balance del Mes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BudgetIcon sx={{ color: 'info.main', fontSize: 32 }} />
                <Box>
                  <Typography variant="h4" sx={{ color: 'info.main', fontWeight: 'bold' }}>
                    {resumen.totalPresupuestos}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Presupuestos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Contadores */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {resumen.totalCategorias}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Categorías
                  </Typography>
                </Box>
                <CategoryIcon sx={{ color: 'action.active', fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {resumen.totalMovimientos}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Movimientos
                  </Typography>
                </Box>
                <MovementIcon sx={{ color: 'action.active', fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {movimientosRecientes.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Mov. Recientes
                  </Typography>
                </Box>
                <MovementIcon sx={{ color: 'action.active', fontSize: 24 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Acciones Rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/movimientos')}
            sx={{ py: 2, fontSize: '1rem' }}
          >
            Nuevo Movimiento
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<BudgetIcon />}
            onClick={() => navigate('/presupuestos')}
            sx={{ py: 2, fontSize: '1rem' }}
          >
            Ver Presupuestos
          </Button>
        </Grid>
      </Grid>

      {/* Tablas Recientes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Movimientos Recientes
                </Typography>
                <Button
                  variant="text"
                  onClick={() => navigate('/movimientos')}
                  sx={{ textTransform: 'none' }}
                >
                  Ver todos
                </Button>
              </Box>
              
              {movimientosRecientes.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Descripción</TableCell>
                        <TableCell align="right">Monto</TableCell>
                        <TableCell>Tipo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {movimientosRecientes.map((movimiento) => (
                        <TableRow key={movimiento.id}>
                          <TableCell>{movimiento.descripcion}</TableCell>
                          <TableCell align="right">
                            <Typography
                              sx={{
                                color: movimiento.tipo === 'INGRESO' ? 'primary.main' : 'secondary.main',
                                fontWeight: 600,
                              }}
                            >
                              {formatCurrency(movimiento.monto)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={movimiento.tipo}
                              color={movimiento.tipo === 'INGRESO' ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No hay movimientos recientes
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Categorías Recientes
                </Typography>
                <Button
                  variant="text"
                  onClick={() => navigate('/categorias')}
                  sx={{ textTransform: 'none' }}
                >
                  Ver todas
                </Button>
              </Box>
              
              {categoriasRecientes.length > 0 ? (
                <TableContainer>
                  <Table size="small">
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
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No hay categorías registradas
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
