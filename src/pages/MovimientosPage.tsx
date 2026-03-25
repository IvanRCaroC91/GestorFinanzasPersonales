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
  DialogActions,
  Snackbar,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import financeService from '../services/financeService';
import { Movimiento, Categoria } from '../types/finance';
import { tipoMovimientoLabel } from '../utils/tipoMovimientoMapper';
import MovimientoForm from './movimientos/MovimientoForm';

const MovimientosPage: React.FC = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMovimiento, setEditingMovimiento] = useState<Movimiento | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [filters, setFilters] = useState({
    search: '',
    tipo: '',
    categoriaId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [movimientosResponse, categoriasResponse] = await Promise.all([
        financeService.getMovimientos(),
        financeService.getCategorias(),
      ]);

      if (movimientosResponse.success) {
        setMovimientos(movimientosResponse.data);
      }

      if (categoriasResponse.success) {
        setCategorias(categoriasResponse.data);
      }
    } catch (error) {
      setError('Error al cargar los datos');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string) => (event: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const filteredMovimientos = movimientos.filter(movimiento => {
    const matchesSearch = movimiento.descripcion.toLowerCase().includes(filters.search.toLowerCase());
    const matchesTipo = !filters.tipo || movimiento.tipo === filters.tipo;
    const matchesCategoria = !filters.categoriaId || movimiento.categoriaId === filters.categoriaId;
    
    return matchesSearch && matchesTipo && matchesCategoria;
  });

  const handleCreate = () => {
    setEditingMovimiento(null);
    setOpenDialog(true);
  };

  const handleEdit = (movimiento: Movimiento) => {
    setEditingMovimiento(movimiento);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este movimiento?')) {
      try {
        const response = await financeService.deleteMovimiento(id);
        if (response.success) {
          setMovimientos(movimientos.filter(mov => mov.id !== id));
          setSnackbar({ open: true, message: 'Movimiento eliminado correctamente', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: response.message, severity: 'error' });
        }
      } catch (error) {
        setSnackbar({ open: true, message: 'Error al eliminar movimiento', severity: 'error' });
      }
    }
  };

  const handleSave = async (movimientoData: Omit<Movimiento, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      let response;
      
      if (editingMovimiento) {
        response = await financeService.updateMovimiento(editingMovimiento.id!, movimientoData);
      } else {
        response = await financeService.createMovimiento(movimientoData);
      }

      if (response.success) {
        await loadData();
        setOpenDialog(false);
        setSnackbar({ 
          open: true, 
          message: editingMovimiento ? 'Movimiento actualizado correctamente' : 'Movimiento creado correctamente', 
          severity: 'success' 
        });
      } else {
        setSnackbar({ open: true, message: response.message, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al guardar movimiento', severity: 'error' });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMovimiento(null);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const getCategoriaNombre = (categoriaId: string) => {
    const categoria = categorias.find(cat => cat.id === categoriaId);
    return categoria?.nombre || 'Sin categoría';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Movimientos</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{ minWidth: 160 }}
            >
              Nuevo Movimiento
            </Button>
          </Box>

          {/* Filtros */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Buscar"
                value={filters.search}
                onChange={handleFilterChange('search')}
                placeholder="Buscar por descripción..."
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filters.tipo}
                  onChange={handleFilterChange('tipo')}
                  label="Tipo"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="INGRESO">Ingresos</MenuItem>
                  <MenuItem value="GASTO">Gastos</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={filters.categoriaId}
                  onChange={handleFilterChange('categoriaId')}
                  label="Categoría"
                >
                  <MenuItem value="">Todas</MenuItem>
                  {categorias
                    .filter(cat => !filters.tipo || cat.tipo === filters.tipo)
                    .map((categoria) => (
                      <MenuItem key={categoria.id} value={categoria.id!}>
                        {categoria.nombre}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setFilters({ search: '', tipo: '', categoriaId: '' })}
                sx={{ height: '56px' }}
              >
                Limpiar Filtros
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Tabla */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Monto</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMovimientos.map((movimiento) => (
                  <TableRow key={movimiento.id}>
                    <TableCell>{formatDate(movimiento.fecha)}</TableCell>
                    <TableCell>{movimiento.descripcion}</TableCell>
                    <TableCell>{getCategoriaNombre(movimiento.categoriaId)}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        {movimiento.tipo === 'INGRESO' ? (
                          <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 16 }} />
                        ) : (
                          <TrendingDownIcon sx={{ color: 'secondary.main', fontSize: 16 }} />
                        )}
                        <Typography
                          sx={{
                            color: movimiento.tipo === 'INGRESO' ? 'primary.main' : 'secondary.main',
                            fontWeight: 600,
                          }}
                        >
                          {formatCurrency(movimiento.valor)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tipoMovimientoLabel[movimiento.tipo as keyof typeof tipoMovimientoLabel]}
                        color={movimiento.tipo === 'INGRESO' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(movimiento)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(movimiento.id!)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMovimientos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="textSecondary">
                        {movimientos.length === 0 
                          ? 'No hay movimientos registrados' 
                          : 'No hay movimientos que coincidan con los filtros'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog Form */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMovimiento ? 'Editar Movimiento' : 'Nuevo Movimiento'}
        </DialogTitle>
        <DialogContent>
          <MovimientoForm
            movimiento={editingMovimiento}
            categorias={categorias}
            onSave={handleSave}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MovimientosPage;
