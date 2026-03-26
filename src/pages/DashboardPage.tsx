import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
  Category as CategoryIcon,
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
    (async () => {
      await loadDashboardData();
    })();
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
    <Box sx={{ 
      width: '100%',
      height: '100%',
      p: 0,
      m: 0
    }}>
      {/* Header */}
      <Box sx={{ p: 2, mb: 2 }}>
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

      {/* LAYOUT PRINCIPAL - GRID DE 2 COLUMNAS */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 2,
        width: '100%',
        p: 2,
        height: '100%'
      }}>
        {/* COLUMNA IZQUIERDA - RESUMEN Y PRESUPUESTO */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* CARDS DE RESUMEN */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
              },
              gap: 1
            }}
          >
        <Card
            sx={{
              width: '100%',
              height: '100%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <TrendingUpIcon sx={{ color: 'primary.main', fontSize: { xs: 28, sm: 32 } }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.3rem', md: '1.6rem', lg: '2rem', xl: '2.5rem' },
                  whiteSpace: 'nowrap'
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
          </Card>

          <Card
            sx={{
              width: '100%',
              height: '100%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <TrendingDownIcon sx={{ color: 'secondary.main', fontSize: { xs: 28, sm: 32 } }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                sx={{ 
                  color: 'secondary.main', 
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.3rem', md: '1.6rem', lg: '2rem', xl: '2.5rem' },
                  whiteSpace: 'nowrap'
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
          </Card>

          <Card
            sx={{
              width: '100%',
              height: '100%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <BalanceIcon sx={{ color: resumen.balance >= 0 ? 'primary.main' : 'secondary.main', fontSize: { xs: 28, sm: 32 } }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                sx={{ 
                  color: resumen.balance >= 0 ? 'primary.main' : 'secondary.main', 
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.3rem', md: '1.6rem', lg: '2rem', xl: '2.5rem' },
                  whiteSpace: 'nowrap'
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
          </Card>

          <Card
            sx={{
              width: '100%',
              height: '100%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <CategoryIcon sx={{ color: 'info.main', fontSize: { xs: 28, sm: 32 } }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                sx={{ 
                  color: 'info.main', 
                  fontWeight: 'bold',
                  fontSize: { xs: '1rem', sm: '1.3rem', md: '1.6rem', lg: '2rem', xl: '2.5rem' },
                  whiteSpace: 'nowrap'
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
          </Card>
          </Box>

          {/* PRESUPUESTO VS EJECUTADO */}
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Presupuesto vs Ejecutado por Categoría
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Categoría</TableCell>
                      <TableCell align="right">Presupuestado</TableCell>
                      <TableCell align="right">Ejecutado</TableCell>
                      <TableCell align="right">Diferencia</TableCell>
                      <TableCell align="center">Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Alimentación</TableCell>
                      <TableCell align="right">$2.000.000</TableCell>
                      <TableCell align="right">$1.800.000</TableCell>
                      <TableCell align="right" sx={{ color: 'success.main' }}>$200.000</TableCell>
                      <TableCell align="center">
                        <Chip label="Dentro de presupuesto" color="success" size="small" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Transporte</TableCell>
                      <TableCell align="right">$500.000</TableCell>
                      <TableCell align="right">$650.000</TableCell>
                      <TableCell align="right" sx={{ color: 'error.main' }}>-$150.000</TableCell>
                      <TableCell align="center">
                        <Chip label="Excedido" color="error" size="small" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* COLUMNA DERECHA - CATEGORÍAS Y MOVIMIENTOS */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: '400px' }}>

        {/* CATEGORÍAS RECIENTES */}
        <Card>
          <CardContent sx={{ p: 1.5 }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Categorías Recientes
            </Typography>
            {categoriasRecientes.length > 0 ? (
              <Box>
                {categoriasRecientes.map((categoria) => (
                  <Box key={categoria.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' }, flex: 1 }}>
                      {categoria.nombre}
                    </Typography>
                    <Chip
                      label={tipoCategoriaLabel[categoria.tipo as keyof typeof tipoCategoriaLabel]}
                      color={categoria.tipo === 'INGRESO' ? 'success' : 'warning'}
                      size="small"
                      sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                    />
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

        {/* MOVIMIENTOS RECIENTES */}
        <Card>
          <CardContent sx={{ p: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
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
                <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, width: '50%' }}>Descripción</TableCell>
                      <TableCell align="right" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, width: '25%' }}>Monto</TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, display: { xs: 'none', sm: 'table-cell' }, width: '25%' }}>Tipo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movimientosRecientes.map((movimiento) => (
                      <TableRow key={movimiento.id}>
                        <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, width: '50%' }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                              {movimiento.descripcion}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              {formatDate(movimiento.fecha)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' }, width: '25%' }}>
                          <Typography
                            sx={{
                              color: movimiento.tipo === 'INGRESO' ? 'primary.main' : 'secondary.main',
                              fontWeight: 600,
                              fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {formatCurrency(movimiento.valor)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' }, width: '25%' }}>
                          <Chip
                            label={tipoMovimientoLabel[movimiento.tipo as keyof typeof tipoMovimientoLabel]}
                            color={movimiento.tipo === 'INGRESO' ? 'success' : 'warning'}
                            size="small"
                            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
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

        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
