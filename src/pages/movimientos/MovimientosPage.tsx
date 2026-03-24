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
  Chip,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import financeService from '../../services/financeService';
import { Movimiento, Categoria } from '../../types/finance';
import MovimientoForm from './MovimientoForm';

const MovimientosPage: React.FC = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMovimiento, setEditingMovimiento] = useState<Movimiento | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [filters, setFilters] = useState({
    categoriaId: '',
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await financeService.getMovimientos();
      if (response.success) {
        setMovimientos(response.data);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError('Error al cargar movimientos');
      console.error('Error loading movimientos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const response = await financeService.getCategorias();
      if (response.success) {
        setCategorias(response.data);
      }
    } catch (error: any) {
      console.error('Error loading categorias:', error);
    }
  };

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
      } catch (error: any) {
        setSnackbar({ open: true, message: 'Error al eliminar movimiento', severity: 'error' });
        console.error('Error deleting movimiento:', error);
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
    } catch (error: any) {
      setSnackbar({ open: true, message: 'Error al guardar movimiento', severity: 'error' });
      console.error('Error saving movimiento:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMovimiento(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredMovimientos = movimientos.filter(movimiento => {
    if (filters.categoriaId && movimiento.categoriaId !== filters.categoriaId) return false;
    if (filters.tipo && movimiento.tipo !== filters.tipo) return false;
    if (filters.fechaInicio && movimiento.fecha < filters.fechaInicio) return false;
    if (filters.fechaFin && movimiento.fecha > filters.fechaFin) return false;
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Cargando...</Typography>
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
            >
              Nuevo Movimiento
            </Button>
          </Box>

          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={filters.categoriaId}
                  onChange={(e) => setFilters(prev => ({ ...prev, categoriaId: e.target.value }))}
                  label="Categoría"
                >
                  <MenuItem value="">Todas</MenuItem>
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filters.tipo}
                  onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
                  label="Tipo"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="INGRESO">Ingresos</MenuItem>
                  <MenuItem value="GASTO">Gastos</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Inicio"
                value={filters.fechaInicio}
                onChange={(e) => setFilters(prev => ({ ...prev, fechaInicio: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Fin"
                value={filters.fechaFin}
                onChange={(e) => setFilters(prev => ({ ...prev, fechaFin: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Monto</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMovimientos.map((movimiento) => (
                  <TableRow key={movimiento.id}>
                    <TableCell>{formatDate(movimiento.fecha)}</TableCell>
                    <TableCell>{movimiento.descripcion}</TableCell>
                    <TableCell>{movimiento.categoria?.nombre || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={movimiento.tipo} 
                        color={movimiento.tipo === 'INGRESO' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        color={movimiento.tipo === 'INGRESO' ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        {formatCurrency(movimiento.monto)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(movimiento)}
                        size="small"
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
                        No hay movimientos registrados
                      </Typography>
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

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MovimientosPage;
