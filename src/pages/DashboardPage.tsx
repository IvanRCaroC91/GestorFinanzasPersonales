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
  const [presupuestosData, setPresupuestosData] = useState<any[]>([]);
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

      // Calcular presupuesto vs ejecutado
      const presupuestoVsEjecutado = calcularPresupuestoVsEjecutado(presupuestos, movimientos, categorias);
      setPresupuestosData(presupuestoVsEjecutado);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularPresupuestoVsEjecutado = (presupuestos: any[], movimientos: Movimiento[], categorias: Categoria[]) => {
    const fechaActual = new Date();
    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    
    // Filtrar movimientos del mes actual
    const movimientosMes = movimientos.filter(mov => 
      new Date(mov.fecha) >= primerDiaMes
    );

    // Filtrar presupuestos del mes actual
    const presupuestosMes = presupuestos.filter(presupuesto => 
      presupuesto.anio === fechaActual.getFullYear() && 
      presupuesto.mes === fechaActual.getMonth() + 1
    );

    return presupuestosMes.map(presupuestoItem => {
      const categoria = categorias.find(cat => cat.id === presupuestoItem.categoriaId);
      const movimientosCategoria = movimientosMes.filter(mov => 
        mov.categoriaId === presupuestoItem.categoriaId
      );

      const ejecutado = movimientosCategoria
        .filter(mov => mov.tipo === 'EGRESO')
        .reduce((sum, mov) => sum + (mov.valor || 0), 0);

      const presupuesto = presupuestoItem.montoLimite || 0;
      const diferencia = presupuesto - ejecutado;
      const porcentajeUtilizado = presupuesto > 0 ? (ejecutado / presupuesto) * 100 : 0;

      return {
        categoria: categoria?.nombre || 'Sin categoría',
        presupuesto,
        ejecutado,
        diferencia,
        porcentajeUtilizado,
        estado: diferencia >= 0 ? 'Dentro de presupuesto' : 'Excedido',
        colorEstado: diferencia >= 0 ? 'success' : 'error'
      };
    });
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
      <Box sx={{ 
        p: 3, 
        mb: 3,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none'
        }
      }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: '800', 
            color: '#FFFFFF', 
            mb: 1,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '-0.5px',
            position: 'relative',
            zIndex: 1
          }}
        >
          💰 Dashboard Financiero
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255,255,255,0.9)',
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
            fontWeight: '400',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            position: 'relative',
            zIndex: 1
          }}
        >
          📊 Resumen general de tus finanzas personales
        </Typography>
      </Box>

      {/* CARDS DE RESUMEN - GRID SUPERIOR */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
          xl: 'repeat(4, 1fr)'
        },
        gap: 1.5,
        p: 2,
        width: '100%',
        justifyContent: 'center'
      }}>
        <Card
            sx={{
              width: '100%',
              height: '100%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 0
            }}
          >
            <TrendingUpIcon sx={{ color: 'primary.main', fontSize: { xs: 28, sm: 32 }, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <Typography 
                sx={{ 
                  color: 'primary.main', 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '1.6rem', md: '1.7rem', lg: '1.8rem', xl: '1.9rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
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
          </Card>

          <Card
            sx={{
              width: '100%',
              height: '100%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 0
            }}
          >
            <TrendingDownIcon sx={{ color: 'secondary.main', fontSize: { xs: 28, sm: 32 }, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <Typography 
                sx={{ 
                  color: 'secondary.main', 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '1.6rem', md: '1.7rem', lg: '1.8rem', xl: '1.9rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
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
          </Card>

          <Card
            sx={{
              width: '100%',
              height: '100%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 0
            }}
          >
            <BalanceIcon sx={{ color: resumen.balance >= 0 ? 'primary.main' : 'secondary.main', fontSize: { xs: 28, sm: 32 }, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <Typography 
                sx={{ 
                  color: resumen.balance >= 0 ? 'primary.main' : 'secondary.main', 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '1.6rem', md: '1.7rem', lg: '1.8rem', xl: '1.9rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
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
          </Card>

          <Card
            sx={{
              width: '100%',
              height: '100%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 0
            }}
          >
            <CategoryIcon sx={{ color: 'info.main', fontSize: { xs: 28, sm: 32 }, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <Typography 
                sx={{ 
                  color: 'info.main', 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '1.6rem', md: '1.7rem', lg: '1.8rem', xl: '1.9rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
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
          </Card>
      </Box>

      {/* LAYOUT PRINCIPAL - GRID DE 2 COLUMNAS */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: '67% 33%',
        gap: 2,
        width: '100%',
        p: 2
      }}>
        {/* COLUMNA IZQUIERDA - PRESUPUESTO */}
        <Box>
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
                    {presupuestosData.length > 0 ? (
                      presupuestosData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.categoria}</TableCell>
                          <TableCell align="right">{formatCurrency(item.presupuesto)}</TableCell>
                          <TableCell align="right">{formatCurrency(item.ejecutado)}</TableCell>
                          <TableCell align="right" sx={{ color: item.diferencia >= 0 ? 'success.main' : 'error.main' }}>
                            {item.diferencia >= 0 ? '+' : ''}{formatCurrency(item.diferencia)}
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={item.estado} 
                              color={item.colorEstado as 'success' | 'error'} 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            No hay presupuestos registrados para este mes
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* COLUMNA DERECHA - CATEGORÍAS Y MOVIMIENTOS */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

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
