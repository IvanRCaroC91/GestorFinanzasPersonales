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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import financeService from '../services/financeService';
import { Presupuesto, EjecucionPresupuesto } from '../types/finance';
import PresupuestoForm from './presupuestos/PresupuestoForm';

const PresupuestosPage: React.FC = () => {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [ejecuciones, setEjecuciones] = useState<{ [key: string]: EjecucionPresupuesto }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPresupuesto, setEditingPresupuesto] = useState<Presupuesto | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadPresupuestos();
  }, []);

  const loadPresupuestos = async () => {
    try {
      setLoading(true);
      const response = await financeService.getPresupuestos();
      console.log('[PresupuestosPage] Raw response:', response);
      console.log('[PresupuestosPage] Presupuestos data:', response.data);
      if (response.success) {
        setPresupuestos(response.data);
        await loadEjecuciones(response.data);
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

  const loadEjecuciones = async (presupuestosList: Presupuesto[]) => {
    const ejecucionesData: { [key: string]: EjecucionPresupuesto } = {};
    
    for (const presupuesto of presupuestosList) {
      try {
        const response = await financeService.getEjecucionPresupuesto(presupuesto.id!);
        console.log(`[PresupuestosPage] Ejecucion for ${presupuesto.id}:`, response);
        if (response.success) {
          ejecucionesData[presupuesto.id!] = response.data;
        }
      } catch (error) {
        console.error(`Error loading ejecucion for presupuesto ${presupuesto.id}:`, error);
      }
    }
    
    console.log('[PresupuestosPage] Final ejecuciones data:', ejecucionesData);
    setEjecuciones(ejecucionesData);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
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
              onClick={() => {
                console.log('[PresupuestosPage] Button clicked');
                handleCreate();
              }}
            >
              Nuevo Presupuesto
            </Button>
          </Box>

          {/* Debug info */}
          <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2">
              Debug: presupuestos.length = {presupuestos.length}, loading = {loading.toString()}, error = {error || 'null'}
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
                  <TableCell>Período</TableCell>
                  <TableCell align="right">Monto Máximo</TableCell>
                  <TableCell align="right">Ejecutado</TableCell>
                  <TableCell align="center">Ejecución</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {console.log('[PresupuestosPage] About to render, presupuestos:', presupuestos)}
                {presupuestos.map((presupuesto) => {
                  const ejecucion = ejecuciones[presupuesto.id!];
                  const porcentajeUtilizado = ejecucion ? (ejecucion.porcentajeUtilizado || 0) : 0;
                  
                  console.log('[PresupuestosPage] Rendering presupuesto:', presupuesto, 'ejecucion:', ejecucion);
                  
                  return (
                    <TableRow key={presupuesto.id}>
                      <TableCell>{presupuesto.categoria?.nombre || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label="MENSUAL"
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">
                          {formatCurrency(presupuesto.montoLimite || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={(porcentajeUtilizado || 0) > 100 ? 'error.main' : 'text.primary'}>
                          {ejecucion ? formatCurrency(ejecucion.montoEjecutado) : '$0'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(porcentajeUtilizado || 0, 100)}
                            sx={{ 
                              flex: 1,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: (porcentajeUtilizado || 0) >= 90 ? '#f44336' : 
                                               (porcentajeUtilizado || 0) >= 75 ? '#ff9800' : '#4caf50'
                              }
                            }}
                          />
                          <Typography variant="body2" sx={{ minWidth: 45 }}>
                            {(porcentajeUtilizado || 0).toFixed(1)}%
                          </Typography>
                        </Box>
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
                    <TableCell colSpan={6} align="center">
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
