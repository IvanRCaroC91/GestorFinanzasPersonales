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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import financeService from '../../services/financeService';
import { Categoria } from '../../types/finance';
import CategoriaForm from './CategoriaForm';

const CategoriasPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await financeService.getCategorias();
      if (response.success) {
        setCategorias(response.data);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError('Error al cargar categorías');
      console.error('Error loading categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategoria(null);
    setOpenDialog(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta categoría?')) {
      try {
        const response = await financeService.deleteCategoria(id);
        if (response.success) {
          setCategorias(categorias.filter(cat => cat.id !== id));
          setSnackbar({ open: true, message: 'Categoría eliminada correctamente', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: response.message, severity: 'error' });
        }
      } catch (error: any) {
        setSnackbar({ open: true, message: 'Error al eliminar categoría', severity: 'error' });
        console.error('Error deleting categoria:', error);
      }
    }
  };

  const handleSave = async (categoriaData: Omit<Categoria, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      let response;
      if (editingCategoria) {
        response = await financeService.updateCategoria(editingCategoria.id!, categoriaData);
      } else {
        response = await financeService.createCategoria(categoriaData);
      }

      if (response.success) {
        await loadCategorias();
        setOpenDialog(false);
        setSnackbar({ 
          open: true, 
          message: editingCategoria ? 'Categoría actualizada correctamente' : 'Categoría creada correctamente', 
          severity: 'success' 
        });
      } else {
        setSnackbar({ open: true, message: response.message, severity: 'error' });
      }
    } catch (error: any) {
      setSnackbar({ open: true, message: 'Error al guardar categoría', severity: 'error' });
      console.error('Error saving categoria:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategoria(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
            <Typography variant="h4">Categorías</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Nueva Categoría
            </Button>
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
                  <TableCell>Nombre</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Tipo Gasto</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categorias.map((categoria) => (
                  <TableRow key={categoria.id}>
                    <TableCell>{categoria.nombre}</TableCell>
                    <TableCell>
                      <Chip 
                        label={categoria.tipo} 
                        color={categoria.tipo === 'INGRESO' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{categoria.tipoGasto || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(categoria)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(categoria.id!)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {categorias.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No hay categorías registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent>
          <CategoriaForm
            categoria={editingCategoria}
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

export default CategoriasPage;
