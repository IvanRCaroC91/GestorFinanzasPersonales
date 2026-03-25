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
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import financeService from '../services/financeService';
import { Presupuesto, Categoria } from '../types/finance';
import PresupuestoForm from './presupuestos/PresupuestoForm';

const PresupuestosPage: React.FC = () => {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPresupuesto, setEditingPresupuesto] = useState<Presupuesto | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  useEffect(() => {
    loadCategorias();
    loadPresupuestos();
  }, [selectedYear, selectedMonth]);

  const loadCategorias = async () => {
    try {
      const response = await financeService.getCategorias();
      if (response.success) {
        setCategorias(response.data);
      }
    } catch (error) {
      console.error('Error loading categorias:', error);
    }
  };

  const loadPresupuestos = async () => {
    try {
      setLoading(true);
      const response = await financeService.getPresupuestos(selectedYear, selectedMonth);
      if (response.success) {
        setPresupuestos(response.data);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError('Error al cargar presupuestos');
      console.error('Error loading presupuestos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEjecuciones = async () => {
    // Eliminado - no se necesitan ejecuciones en este formulario
  };

  const handleCreate = () => {
    setEditingPresupuesto(null);
    setOpenDialog(true);
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

  const handleSave = async (presupuestoData: any) => {
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
    return months.find(m => m.value === month)?.label || '';
  };

  const getCategoriaName = (categoriaId: string) => {
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria?.nombre || 'Sin categoría';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
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
            <Typography variant="h4">Presupuestos</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Nuevo Presupuesto
            </Button>
          </Box>

          {/* Filtros de Mes/Año */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Mes</InputLabel>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                label="Mes"
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              size="small"
              label="Año"
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              inputProps={{
                min: 2000,
                max: 2100,
              }}
              sx={{ width: 100 }}
            />
            
            <Typography variant="body2" color="text.secondary">
              {getMonthName(selectedMonth)} {selectedYear}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Mes</TableCell>
                  <TableCell>Año</TableCell>
                  <TableCell align="right">Monto Límite</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {presupuestos.map((presupuesto) => {
                  return (
                    <TableRow key={presupuesto.id}>
                      <TableCell>{getCategoriaName(presupuesto.categoriaId)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getMonthName(presupuesto.mes)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {presupuesto.anio}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">
                          {formatCurrency(presupuesto.montoLimite || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(presupuesto)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
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
                      <Typography variant="body2" color="textSecondary">
                        No hay presupuestos registrados
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
