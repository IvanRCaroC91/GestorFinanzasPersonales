import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import financeService from '../../shared/services/financeService';
import { Presupuesto, EjecucionPresupuesto, Categoria } from '../../shared/types/finance';
import PresupuestoForm from './components/PresupuestoForm';
import styles from './Presupuestos.module.css';

const PresupuestosPage: React.FC = () => {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [todosLosPresupuestos, setTodosLosPresupuestos] = useState<Presupuesto[]>([]);
  const [ejecuciones, setEjecuciones] = useState<{ [key: string]: EjecucionPresupuesto }>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPresupuesto, setEditingPresupuesto] = useState<Presupuesto | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [filtroAnio, setFiltroAnio] = useState<number | ''>('');
  const [filtroMes, setFiltroMes] = useState<number | ''>('');

  useEffect(() => {
    loadPresupuestos();
    // Agregar una prueba de conexión
    testConnection();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtroAnio, filtroMes, todosLosPresupuestos]);

  const testConnection = async () => {
    try {
      console.log('[PresupuestosPage] Testing connection...');
      const response = await financeService.getPresupuestos();
      console.log('[PresupuestosPage] Connection test response:', response);
    } catch (error) {
      console.error('[PresupuestosPage] Connection test failed:', error);
    }
  };

  const aplicarFiltros = () => {
    let filtrados = [...todosLosPresupuestos];
    
    if (filtroAnio) {
      filtrados = filtrados.filter(p => p.anio === filtroAnio);
    }
    
    if (filtroMes) {
      filtrados = filtrados.filter(p => p.mes === filtroMes);
    }
    
    setPresupuestos(filtrados);
  };

  const limpiarFiltros = () => {
    setFiltroAnio('');
    setFiltroMes('');
  };

  const loadPresupuestos = async () => {
    try {
      setLoading(true);
      console.log('[PresupuestosPage] Loading presupuestos...');
      
      // Cargar todos los presupuestos primero para ver qué existen
      console.log('[PresupuestosPage] Loading ALL presupuestos...');
      const allPresupuestosResponse = await financeService.getPresupuestos();
      console.log('[PresupuestosPage] ALL presupuestos response:', allPresupuestosResponse);
      
      // Cargar categorías primero
      console.log('[PresupuestosPage] Loading categorias...');
      const categoriasResponse = await financeService.getCategorias();
      console.log('[PresupuestosPage] Categorias response:', categoriasResponse);
      
      let categoriasMap: { [key: string]: Categoria } = {};
      if (categoriasResponse.success) {
        setCategorias(categoriasResponse.data);
        categoriasMap = categoriasResponse.data.reduce((map, cat) => {
          map[cat.id!] = cat;
          return map;
        }, {} as { [key: string]: Categoria });
        console.log('[PresupuestosPage] Categorias map:', categoriasMap);
      }
      
      // Mostrar todos los presupuestos existentes sin filtrar por fecha
      let response = allPresupuestosResponse;
      
      // Si hay presupuestos, mostrarlos todos. Si no, intentar filtrar por mes actual
      if (allPresupuestosResponse.success && allPresupuestosResponse.data.length > 0) {
        console.log(`[PresupuestosPage] Using all ${allPresupuestosResponse.data.length} presupuestos`);
        
        // Log de cada presupuesto con sus fechas
        allPresupuestosResponse.data.forEach((presupuesto, index) => {
          console.log(`[PresupuestosPage] Presupuesto ${index + 1}:`, {
            id: presupuesto.id,
            categoriaId: presupuesto.categoriaId,
            montoLimite: presupuesto.montoLimite,
            anio: presupuesto.anio,
            mes: presupuesto.mes,
            periodo: `${presupuesto.anio}-${presupuesto.mes.toString().padStart(2, '0')}`
          });
        });
        
        response = allPresupuestosResponse;
      } else {
        // Si no hay presupuestos, intentar cargar del mes actual
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        console.log(`[PresupuestosPage] No presupuestos found, trying current month: ${currentYear}, month: ${currentMonth}`);
        response = await financeService.getPresupuestos(currentYear, currentMonth);
        console.log('[PresupuestosPage] Current month response:', response);
      }
      
      if (response.success) {
        console.log(`[PresupuestosPage] Loaded ${response.data.length} presupuestos`);
        
        // Mapear categorías con presupuestos
        const presupuestosConCategorias = response.data.map(presupuesto => ({
          ...presupuesto,
          categoria: categoriasMap[presupuesto.categoriaId] || null
        }));
        
        console.log('[PresupuestosPage] Presupuestos con categorías:', presupuestosConCategorias);
        
        // Log detallado de cada presupuesto
        presupuestosConCategorias.forEach((presupuesto, index) => {
          console.log(`[PresupuestosPage] Presupuesto ${index + 1}:`, {
            id: presupuesto.id,
            categoriaId: presupuesto.categoriaId,
            categoria: presupuesto.categoria,
            categoriaNombre: presupuesto.categoria?.nombre || 'Sin categoría',
            montoLimite: presupuesto.montoLimite,
            anio: presupuesto.anio,
            mes: presupuesto.mes
          });
        });
        
        setTodosLosPresupuestos(presupuestosConCategorias);
        setPresupuestos(presupuestosConCategorias);
        setEjecuciones({});
      } else {
        console.error('[PresupuestosPage] Error response:', response.message);
        setError(response.message || 'Error al cargar presupuestos');
      }
    } catch (error: any) {
      console.error('[PresupuestosPage] Error loading presupuestos:', error);
      setError('Error al cargar presupuestos: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    console.log('[PresupuestosPage] handleCreate called');
    setEditingPresupuesto(null);
    setOpenDialog(true);
    console.log('[PresupuestosPage] Dialog should open now');
  };

  const handleEdit = (presupuesto: Presupuesto) => {
    setEditingPresupuesto(presupuesto);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este presupuesto?')) {
      try {
        const response = await financeService.deletePresupuesto(id);
        if (response.success) {
          setPresupuestos(presupuestos.filter(pres => pres.id !== id));
          setSnackbar({ open: true, message: 'Presupuesto eliminado correctamente', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: response.message, severity: 'error' });
        }
      } catch (error: any) {
        setSnackbar({ open: true, message: 'Error al eliminar presupuesto', severity: 'error' });
        console.error('Error deleting presupuesto:', error);
      }
    }
  };

  const handleSave = async (presupuestoData: Omit<Presupuesto, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      let response;
      if (editingPresupuesto) {
        response = await financeService.updatePresupuesto(editingPresupuesto.id!, presupuestoData);
      } else {
        response = await financeService.createPresupuesto(presupuestoData);
      }

      if (response.success) {
        await loadPresupuestos();
        setOpenDialog(false);
        setSnackbar({ 
          open: true, 
          message: editingPresupuesto ? 'Presupuesto actualizado correctamente' : 'Presupuesto creado correctamente', 
          severity: 'success' 
        });
      } else {
        setSnackbar({ open: true, message: response.message, severity: 'error' });
      }
    } catch (error: any) {
      setSnackbar({ open: true, message: 'Error al guardar presupuesto', severity: 'error' });
      console.error('Error saving presupuesto:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPresupuesto(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

  const getAvailableYears = () => {
    const years = [...new Set(todosLosPresupuestos.map(p => p.anio))];
    const sortedYears = years.sort((a, b) => b - a);
    console.log('[PresupuestosPage] Available years:', sortedYears);
    return sortedYears;
  };

  const getAllMonths = () => {
    const allMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    console.log('[PresupuestosPage] All months:', allMonths);
    return allMonths;
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.presupuestosContainer}>
      <Card className={styles.presupuestosTable}>
        <CardContent>
          <Box className={styles.pageHeader}>
            <Typography variant="h4" className={styles.pageTitle}>Presupuestos</Typography>
            <Box className={styles.headerButtons}>
              <Button
                variant="outlined"
                size="small"
                className={styles.testButton}
                onClick={testConnection}
              >
                Probar Conexión
              </Button>
              <Button
                variant="contained"
                className={styles.addButton}
                startIcon={<AddIcon />}
                onClick={() => {
                  console.log('[PresupuestosPage] Button clicked');
                  handleCreate();
                }}
              >
                Nuevo Presupuesto
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" className={styles.errorMessage}>
              {error}
            </Alert>
          )}

          {/* Filtros */}
          <Box className={styles.filtersContainer}>
            <Typography variant="h6">Filtros</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mt: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Año</InputLabel>
                <Select
                  value={filtroAnio}
                  label="Año"
                  onChange={(e) => {
                    console.log('[PresupuestosPage] Año seleccionado:', e.target.value);
                    setFiltroAnio(e.target.value as number | '');
                  }}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {getAvailableYears().map(year => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Mes</InputLabel>
                <Select
                  value={filtroMes}
                  label="Mes"
                  onChange={(e) => {
                    console.log('[PresupuestosPage] Mes seleccionado:', e.target.value);
                    setFiltroMes(e.target.value as number | '');
                  }}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {getAllMonths().map(month => (
                    <MenuItem key={month} value={month}>{getMonthName(month)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  console.log('[PresupuestosPage] Limpiando filtros');
                  limpiarFiltros();
                }}
                disabled={!filtroAnio && !filtroMes}
              >
                Limpiar Filtros
              </Button>
            </Box>
          </Box>

          {/* Indicador de estado para debugging */}
          <Box className={styles.debugInfo}>
            <Typography variant="body2" color="textSecondary">
              Total: {todosLosPresupuestos.length} | 
              Filtrados: {presupuestos.length} | 
              Categorías: {categorias.length} | 
              Ejecuciones: {Object.keys(ejecuciones).length}
              {(filtroAnio || filtroMes) && ` | Filtros: ${filtroAnio || 'Todos'}-${filtroMes ? getMonthName(filtroMes) : 'Todos'}`}
            </Typography>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="center">Mes</TableCell>
                  <TableCell align="center">Año</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {presupuestos.map((presupuesto) => {
                  return (
                    <TableRow key={presupuesto.id}>
                      <TableCell>
                        <Typography className={styles.presupuestoCategoria}>
                          {presupuesto.categoria?.nombre || 'Sin categoría'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography className={styles.presupuestoMonto}>
                          {formatCurrency(presupuesto.montoLimite)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={getMonthName(presupuesto.mes)} 
                          size="small"
                          className={styles.presupuestoPeriodo}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography className={styles.presupuestoAnio}>
                          {presupuesto.anio}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          className={styles.editButton}
                          onClick={() => handleEdit(presupuesto)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          className={styles.deleteButton}
                          onClick={() => handleDelete(presupuesto.id!)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {presupuestos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box className={styles.emptyState}>
                        <Typography variant="body2" className={styles.emptyStateText}>
                          No hay presupuestos registrados
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPresupuesto ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
        </DialogTitle>
        <DialogContent>
          <PresupuestoForm
            presupuesto={editingPresupuesto}
            onSave={handleSave}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PresupuestosPage;
