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
  IconButton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
  Category as CategoryIcon,
  SwapHoriz as MovementIcon,
  AccountBalanceWallet as BudgetIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import financeService from '../services/financeService';
import { Categoria, Movimiento } from '../types/finance';
import { tipoMovimientoLabel, tipoCategoriaLabel } from '../utils/tipoMovimientoMapper';

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
        .reduce((sum, mov) => sum + (mov.valor || 0), 0);

      const totalGastos = movimientosMes
        .filter(mov => mov.tipo === 'EGRESO')
        .reduce((sum, mov) => sum + (mov.valor || 0), 0);

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
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#1A1A1A', 
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Dashboard Financiero
        </Typography>
        <Typography variant="body2" sx={{ color: '#666666' }}>
          Resumen general de tus finanzas personales
        </Typography>
      </Box>

      {/* Resumen General */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <TrendingUpIcon sx={{ color: 'primary.main', fontSize: { xs: 28, sm: 32 } }} />
                <Box sx={{ flex: 1, minWidth: 0, overflow: 'visible' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 'bold',
                      fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem' },
                      whiteSpace: 'nowrap',
                      overflow: 'visible',
                      lineHeight: 1.2
                    }}
                  >
                    {formatCurrency(resumen.totalIngresos)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Total Ingresos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <TrendingDownIcon sx={{ color: 'secondary.main', fontSize: { xs: 28, sm: 32 } }} />
                <Box sx={{ flex: 1, minWidth: 0, overflow: 'visible' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'secondary.main', 
                      fontWeight: 'bold',
                      fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem' },
                      whiteSpace: 'nowrap',
                      overflow: 'visible',
                      lineHeight: 1.2
                    }}
                  >
                    {formatCurrency(resumen.totalGastos)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Total Gastos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <BalanceIcon sx={{ color: resumen.balance >= 0 ? 'primary.main' : 'secondary.main', fontSize: { xs: 28, sm: 32 } }} />
                <Box sx={{ flex: 1, minWidth: 0, overflow: 'visible' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: resumen.balance >= 0 ? 'primary.main' : 'secondary.main', 
                      fontWeight: 'bold',
                      fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem' },
                      whiteSpace: 'nowrap',
                      overflow: 'visible',
                      lineHeight: 1.2
                    }}
                  >
                    {formatCurrency(resumen.balance)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Balance
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <CategoryIcon sx={{ color: 'info.main', fontSize: { xs: 28, sm: 32 } }} />
                <Box sx={{ flex: 1, minWidth: 0, overflow: 'visible' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'info.main', 
                      fontWeight: 'bold',
                      fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem', lg: '1.75rem' },
                      whiteSpace: 'nowrap',
                      overflow: 'visible',
                      lineHeight: 1.2
                    }}
                  >
                    {resumen.totalCategorias}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    Categorías
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
                  {/* Movimientos Recientes */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Movimientos Recientes
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => navigate('/movimientos')}
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Ver Todos
                </Button>
              </Box>
              
              {movimientosRecientes.length > 0 ? (
                <TableContainer>
                  <Table sx={{ minWidth: { xs: 300, sm: 400, lg: 600 } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Descripción</TableCell>
                        <TableCell align="right" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Monto</TableCell>
                        <TableCell align="center" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, display: { xs: 'none', sm: 'table-cell' } }}>Tipo</TableCell>
                        <TableCell align="center" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, display: { xs: 'none', md: 'table-cell' } }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {movimientosRecientes.map((movimiento) => (
                        <TableRow key={movimiento.id}>
                          <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                {movimiento.descripcion}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                {formatDate(movimiento.fecha)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              sx={{
                                color: movimiento.tipo === 'INGRESO' ? 'primary.main' : 'secondary.main',
                                fontWeight: 600,
                                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: { xs: '80px', sm: '120px', md: '150px' }
                              }}
                            >
                              {formatCurrency(movimiento.valor)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            <Chip
                              label={tipoMovimientoLabel[movimiento.tipo as keyof typeof tipoMovimientoLabel]}
                              color={movimiento.tipo === 'INGRESO' ? 'success' : 'warning'}
                              size="small"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                            <IconButton
                              color="primary"
                              onClick={() => navigate(`/movimientos/edit/${movimiento.id}`)}
                              size="small"
                            >
                              <EditIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No hay movimientos registrados
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/movimientos/new')}
                    size="small"
                  >
                    Crear Primer Movimiento
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Categorías Recientes
              </Typography>
              
              {categoriasRecientes.length > 0 ? (
                <Box>
                  {categoriasRecientes.map((categoria) => (
                    <Box key={categoria.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          {categoria.nombre}
                        </Typography>
                        <Chip
                          label={tipoCategoriaLabel[categoria.tipo as keyof typeof tipoCategoriaLabel]}
                          color={categoria.tipo === 'INGRESO' ? 'success' : 'warning'}
                          size="small"
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, mt: 0.5 }}
                        />
                      </Box>
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/categorias/edit/${categoria.id}`)}
                        size="small"
                      >
                        <EditIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No hay categorías registradas
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/categorias/new')}
                    size="small"
                  >
                    Crear Primera Categoría
                  </Button>
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
