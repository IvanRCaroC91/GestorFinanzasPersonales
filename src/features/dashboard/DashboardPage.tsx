// Importaciones de React, hooks y componentes Material-UI
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
} from '@mui/icons-material';

// Importaciones de hooks y servicios personalizados
import { useNavigate } from 'react-router-dom';
import financeService from '../../shared/services/financeService'; // Servicio de finanzas
import { Categoria, Movimiento } from '../../shared/types/finance'; // Tipos de datos
import { tipoMovimientoLabel } from '../../shared/utils/tipoMovimientoMapper'; // mapeado de tipos

// Interfaz para datos del resumen financiero
interface ResumenData {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  totalCategorias: number;
  totalMovimientos: number;
  totalPresupuestos: number;
}

// Componente de página de dashboard
const DashboardPage: React.FC = () => {
  // Hook de navegación
  const navigate = useNavigate();
  
  // Estado para datos del resumen financiero
  const [resumen, setResumen] = useState<ResumenData>({
    totalIngresos: 0,
    totalGastos: 0,
    balance: 0,
    totalCategorias: 0,
    totalMovimientos: 0,
    totalPresupuestos: 0,
  });
  
  // Estados para movimientos recientes y presupuestos
  const [movimientosRecientes, setMovimientosRecientes] = useState<Movimiento[]>([]);
  interface PresupuestoEjecutado {
  categoriaId: string;
  categoriaNombre: string;
  categoria: string;
  presupuesto: number;
  presupuestado: number;
  ejecutado: number;
  diferencia: number;
  porcentajeUso: number;
  estado: string;
  colorEstado: 'success' | 'error' | 'default' | 'warning' | 'info';
}

const [presupuestosData, setPresupuestosData] = useState<PresupuestoEjecutado[]>([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<{ anio: number; mes: number } | null>(null);
  const [filtroEjecucion, setFiltroEjecucion] = useState<'anio' | 'mes'>('mes');
  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(new Date().getFullYear());
  const [mesSeleccionado, setMesSeleccionado] = useState<number>(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  
  // Estados para datos principales
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [presupuestos, setPresupuestos] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData().catch(console.error);
  }, []);

  const getPeriodoFechas = (filtro: 'anio' | 'mes', anio: number, mes: number) => {
    let fechaInicio: Date;
    let fechaFin: Date;
    let tituloPeriodo: string;

    // Determinar rango de fechas según el filtro
    switch (filtro) {
      case 'anio':
        // Todo el año seleccionado
        fechaInicio = new Date(anio, 0, 1); // 1 de enero del año seleccionado
        fechaFin = new Date(anio, 11, 31); // 31 de diciembre del año seleccionado
        tituloPeriodo = `Año ${anio}`;
        break;
      
      case 'mes':
      default:
        // Mes específico seleccionado
        fechaInicio = new Date(anio, mes - 1, 1);
        fechaFin = new Date(anio, mes, 0);
        tituloPeriodo = `${getMonthName(mes)} ${anio}`;
        break;
    }

    return { fechaInicio, fechaFin, tituloPeriodo };
  };

  useEffect(() => {
    // Recalcular ejecuciones cuando cambia el filtro
    if (movimientos.length > 0 && categorias.length > 0 && presupuestos.length > 0) {
      const presupuestoVsEjecutado = calcularPresupuestoVsEjecutado(presupuestos, movimientos, categorias);
      setPresupuestosData(presupuestoVsEjecutado);
    }
  }, [filtroEjecucion, anioSeleccionado, mesSeleccionado, movimientos.length, categorias.length, presupuestos.length]);

  useEffect(() => {
    // Recalcular resumen cuando cambia el filtro
    if (movimientos.length > 0) {
      calcularResumenPorPeriodo();
    }
  }, [filtroEjecucion, anioSeleccionado, mesSeleccionado, movimientos.length]);

  const calcularResumenPorPeriodo = () => {
    const { fechaInicio, fechaFin } = getPeriodoFechas(filtroEjecucion, anioSeleccionado, mesSeleccionado);
    
    // Filtrar movimientos del período seleccionado
    const movimientosPeriodo = movimientos.filter(mov => {
      const fechaMov = new Date(mov.fecha);
      return fechaMov >= fechaInicio && fechaMov <= fechaFin;
    });

    const totalIngresos = movimientosPeriodo
      .filter(mov => mov.tipo === 'INGRESO')
      .reduce((sum, mov) => sum + (mov.valor || 0), 0);

    const totalGastos = movimientosPeriodo
      .filter(mov => mov.tipo === 'EGRESO')
      .reduce((sum, mov) => sum + (mov.valor || 0), 0);

    console.log('[Dashboard] Resumen recalculado para período:', {
      filtro: filtroEjecucion,
      anioSeleccionado,
      mesSeleccionado,
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
      movimientosPeriodo: movimientosPeriodo.length,
      totalIngresos,
      totalGastos,
      balance: totalIngresos - totalGastos
    });

    setResumen(prev => ({
      ...prev,
      totalIngresos,
      totalGastos,
      balance: totalIngresos - totalGastos,
      totalCategorias: categorias.length,
      totalMovimientos: movimientos.length,
      totalPresupuestos: presupuestos.length,
    }));
  };

  // Carga todos los datos del dashboard desde el backend (movimientos, categorías, presupuestos).
  // Procesa los datos para calcular resúmenes y preparar la visualización.
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

      // Guardar datos principales en el estado
      setMovimientos(movimientos);
      setCategorias(categorias);
      setPresupuestos(presupuestos);

      // Calcular resumen inicial usando la función existente
      calcularResumenPorPeriodo();

      // Datos recientes - ordenar movimientos por fecha descendente (más reciente primero)
      // Primero mapear categorías con movimientos
      console.log('[Dashboard] Categorías cargadas:', categorias.length);
      console.log('[Dashboard] Movimientos cargados:', movimientos.length);
      
      const categoriasMap = categorias.reduce((map, cat) => {
        map[cat.id!] = cat;
        return map;
      }, {} as { [key: string]: Categoria });
      
      console.log('[Dashboard] Mapa de categorías:', Object.keys(categoriasMap));
      
      const movimientosConCategorias = movimientos.map(movimiento => ({
        ...movimiento,
        categoria: categoriasMap[movimiento.categoriaId] || null
      }));
      
      console.log('[Dashboard] Movimientos con categorías mapeadas:', movimientosConCategorias.slice(0, 3).map(m => ({
        descripcion: m.descripcion,
        categoriaId: m.categoriaId,
        categoriaEncontrada: !!m.categoria,
        categoriaNombre: m.categoria?.nombre
      })));
      
      const movimientosOrdenados = movimientosConCategorias.sort((a, b) => {
        // Convertir fechas a objetos Date para comparación correcta
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return fechaB.getTime() - fechaA.getTime(); // Orden descendente
      });
      
      console.log('[Dashboard] Movimientos ordenados por fecha:', movimientosOrdenados.slice(0, 5).map(m => ({
        descripcion: m.descripcion,
        fecha: m.fecha,
        fechaFormateada: new Date(m.fecha).toLocaleString(),
        categoria: m.categoria?.nombre,
        categoriaId: m.categoriaId
      })));

      setMovimientosRecientes(movimientosOrdenados.slice(0, 5));

      // Calcular presupuesto versus ejecutado
      const presupuestoVsEjecutado = calcularPresupuestoVsEjecutado(presupuestos, movimientos, categorias);
      setPresupuestosData(presupuestoVsEjecutado);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Compara los presupuestos mensuales con los gastos reales ejecutados por categoría.
  // Calcula la diferencia y porcentaje de uso para mostrar el estado de cumplimiento.
  const calcularPresupuestoVsEjecutado = (presupuestos: any[], movimientos: Movimiento[], categorias: Categoria[]) => {
    // Si no hay presupuestos, retornar array vacío
    if (presupuestos.length === 0) {
      console.log('[Dashboard] No hay presupuestos para calcular ejecuciones');
      return [];
    }

    const { fechaInicio, fechaFin, tituloPeriodo } = getPeriodoFechas(filtroEjecucion, anioSeleccionado, mesSeleccionado);

    // Guardar período seleccionado para mostrar en el título
    setPeriodoSeleccionado({ anio: anioSeleccionado, mes: mesSeleccionado });

    console.log('[Dashboard] Período seleccionado para cálculo:', {
      filtro: filtroEjecucion,
      titulo: tituloPeriodo,
      anioSeleccionado,
      mesSeleccionado,
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0]
    });
    
    // Filtrar movimientos del período seleccionado
    const movimientosPeriodo = movimientos.filter(mov => {
      const fechaMov = new Date(mov.fecha);
      return fechaMov >= fechaInicio && fechaMov <= fechaFin;
    });

    // Para presupuestos, necesitamos manejarlos diferente según el filtro
    const presupuestosPeriodo = filtroEjecucion === 'mes'
      ? presupuestos.filter(presupuesto => 
          presupuesto.anio === anioSeleccionado && 
          presupuesto.mes === mesSeleccionado
        )
      : presupuestos.filter(presupuesto => 
          presupuesto.anio === anioSeleccionado
        );

    console.log('[Dashboard] Datos para cálculo:', {
      filtro: filtroEjecucion,
      anioSeleccionado,
      mesSeleccionado,
      categoriasCount: categorias.length,
      movimientosPeriodoCount: movimientosPeriodo.length,
      presupuestosPeriodoCount: presupuestosPeriodo.length,
      tituloPeriodo
    });

    // Log detallado de los datos brutos
    console.log('[Dashboard] Categorías:', categorias.map(c => ({ id: c.id, nombre: c.nombre })));
    console.log('[Dashboard] Movimientos del período:', movimientosPeriodo.map(m => ({ 
      categoriaId: m.categoriaId, 
      categoriaNombre: m.categoria?.nombre, 
      valor: m.valor, 
      tipo: m.tipo 
    })));
    console.log('[Dashboard] Presupuestos del período:', presupuestosPeriodo.map(p => ({ 
      categoriaId: p.categoriaId, 
      montoLimite: p.montoLimite,
      categoria: p.categoria?.nombre 
    })));

    // PASO 1: Crear mapa de presupuestos por categoriaId (solo para categorías de EGRESOS)
    const presupuestosMap = presupuestosPeriodo.reduce((map, presupuesto) => {
      const categoria = categorias.find(cat => cat.id === presupuesto.categoriaId);
      console.log(`[Dashboard] Verificando presupuesto categoriaId=${presupuesto.categoriaId}:`, {
        categoria,
        categoriaTipo: categoria?.tipo,
        montoLimite: presupuesto.montoLimite
      });
      
      // Intentar diferentes valores para el tipo
      if (categoria && (categoria.tipo === 'GASTO' || categoria.tipo === 'EGRESO')) {
        const categoriaId = presupuesto.categoriaId;
        const montoPresupuesto = Number(presupuesto.montoLimite) || 0;
        map[categoriaId] = montoPresupuesto;
        console.log(`[Dashboard] Presupuesto agregado: ${categoriaId} = ${montoPresupuesto}`);
      } else {
        console.log(`[Dashboard] Presupuesto descartado: ${presupuesto.categoriaId}, tipo=${categoria?.tipo}`);
      }
      return map;
    }, {} as { [key: string]: number });

    console.log('[Dashboard] Mapa de presupuestos (solo GASTOS):', presupuestosMap);

    // PASO 2: Identificar todas las categorías que tienen movimientos en el período (solo EGRESOS)
    const categoriasConMovimientos = new Set<string>();
    movimientosPeriodo.forEach(movimiento => {
      // Solo incluir categorías con movimientos de EGRESO
      if (movimiento.tipo === 'EGRESO') {
        categoriasConMovimientos.add(movimiento.categoriaId);
      }
    });

    console.log('[Dashboard] Categorías con movimientos de EGRESO:', Array.from(categoriasConMovimientos));

    // PASO 3: Crear mapa de ejecutado por categoría
    const ejecutadoPorCategoria = movimientosPeriodo.reduce((map, movimiento) => {
      // Solo sumar egresos para comparación con presupuestos
      if (movimiento.tipo === 'EGRESO') {
        const categoriaId = movimiento.categoriaId;
        const valorMovimiento = Number(movimiento.valor) || 0;
        map[categoriaId] = (map[categoriaId] || 0) + valorMovimiento;
      }
      return map;
    }, {} as { [key: string]: number });

    console.log('[Dashboard] Ejecutado por categoría:', ejecutadoPorCategoria);

    // PASO 4: Generar resultado combinando presupuestos y ejecutados
    const resultado: any[] = [];

    // 4.1: Primero procesar categorías con movimientos
    categoriasConMovimientos.forEach(categoriaId => {
      const categoria = categorias.find(cat => cat.id === categoriaId);
      const presupuestado = Number(presupuestosMap[categoriaId]) || 0;
      const ejecutado = Number(ejecutadoPorCategoria[categoriaId]) || 0;
      
      // Sin operaciones complejas - solo valores básicos
      const diferencia = presupuestado - ejecutado;
      
      // Porcentaje simple y seguro
      let porcentajeUtilizado = 0;
      if (presupuestado > 0) {
        porcentajeUtilizado = Math.round((ejecutado / presupuestado) * 100);
      } else if (ejecutado > 0) {
        porcentajeUtilizado = 100; // Sin presupuesto pero con gastos
      }

      resultado.push({
        categoria: categoria?.nombre,
        presupuestado,
        ejecutado,
        diferencia,
        porcentajeUtilizado,
        estado: diferencia >= 0 ? 'Dentro de presupuesto' : 'Excedido',
        colorEstado: diferencia >= 0 ? 'success' : 'error'
      });
    });

    // 4.2: Luego agregar categorías con presupuesto pero sin movimientos (opcional)
    Object.keys(presupuestosMap).forEach(categoriaId => {
      if (!categoriasConMovimientos.has(categoriaId)) {
        const categoria = categorias.find(cat => cat.id === categoriaId);
        const presupuestado = Number(presupuestosMap[categoriaId]) || 0;
        
        resultado.push({
          categoria: categoria?.nombre,
          presupuestado,
          ejecutado: 0,
          diferencia: presupuestado,
          porcentajeUtilizado: 0,
          estado: 'Dentro de presupuesto',
          colorEstado: 'success'
        });
      }
    });

    console.log('[Dashboard] Resultado final combinado:', resultado);

    // Verificar que ningún valor sea NaN
    resultado.forEach((item, index) => {
      console.log(`[Dashboard] Item ${index}:`, {
        categoria: item.categoria,
        presupuestado: item.presupuestado,
        ejecutado: item.ejecutado,
        diferencia: item.diferencia,
        porcentajeUtilizado: item.porcentajeUtilizado,
        isNaN: {
          presupuestado: isNaN(item.presupuestado),
          ejecutado: isNaN(item.ejecutado),
          diferencia: isNaN(item.diferencia),
          porcentajeUtilizado: isNaN(item.porcentajeUtilizado)
        }
      });
    });

    return resultado;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1] || 'Mes desconocido';
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
            <BalanceIcon sx={{ color: 'info.main', fontSize: { xs: 28, sm: 32 }, flexShrink: 0 }} />
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Presupuesto vs Ejecutado por Categoría
                  {periodoSeleccionado && (
                    <Typography component="span" variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                      ({getMonthName(periodoSeleccionado.mes)} {periodoSeleccionado.anio})
                    </Typography>
                  )}
                </Typography>
                
                {/* Filtros de ejecución */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Período</InputLabel>
                    <Select
                      value={filtroEjecucion}
                      label="Período"
                      onChange={(e) => {
                        console.log('[Dashboard] Filtro ejecución cambiado:', e.target.value);
                        setFiltroEjecucion(e.target.value as 'anio' | 'mes');
                      }}
                    >
                      <MenuItem value="mes">Mes específico</MenuItem>
                      <MenuItem value="anio">Año completo</MenuItem>
                    </Select>
                  </FormControl>

                  {filtroEjecucion === 'mes' && (
                    <>
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Mes</InputLabel>
                        <Select
                          value={mesSeleccionado}
                          label="Mes"
                          onChange={(e) => {
                            console.log('[Dashboard] Mes seleccionado:', e.target.value);
                            setMesSeleccionado(e.target.value as number);
                          }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(mes => (
                            <MenuItem key={mes} value={mes}>{getMonthName(mes)}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Año</InputLabel>
                        <Select
                          value={anioSeleccionado}
                          label="Año"
                          onChange={(e) => {
                            console.log('[Dashboard] Año seleccionado:', e.target.value);
                            setAnioSeleccionado(e.target.value as number);
                          }}
                        >
                          {[2024, 2025, 2026, 2027].map(anio => (
                            <MenuItem key={anio} value={anio}>{anio}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                  )}

                  {filtroEjecucion === 'anio' && (
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <InputLabel>Año</InputLabel>
                      <Select
                        value={anioSeleccionado}
                        label="Año"
                        onChange={(e) => {
                          console.log('[Dashboard] Año seleccionado:', e.target.value);
                          setAnioSeleccionado(e.target.value as number);
                        }}
                      >
                        {[2024, 2025, 2026, 2027].map(anio => (
                          <MenuItem key={anio} value={anio}>{anio}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>
              </Box>
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
                          <TableCell align="right">{formatCurrency(item.presupuestado)}</TableCell>
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

        {/* COLUMNA DERECHA - MOVIMIENTOS */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

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
                      <TableCell sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, width: '35%' }}>Descripción</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, width: '20%' }}>Categoría</TableCell>
                      <TableCell align="right" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, width: '20%' }}>Monto</TableCell>
                      <TableCell align="center" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, display: { xs: 'none', sm: 'table-cell' }, width: '25%' }}>Tipo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movimientosRecientes.map((movimiento) => (
                      <TableRow key={movimiento.id}>
                        <TableCell sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, width: '35%' }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                              {movimiento.descripcion}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.5rem', sm: '0.6rem' } }}>
                              {formatDate(movimiento.fecha)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, width: '20%' }}>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
                            {movimiento.categoria?.nombre}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' }, width: '20%' }}>
                          <Typography
                            sx={{
                              color: movimiento.tipo === 'INGRESO' ? 'primary.main' : 'secondary.main',
                              fontWeight: 600,
                              fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
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
                            sx={{ fontSize: { xs: '0.5rem', sm: '0.6rem' } }}
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

