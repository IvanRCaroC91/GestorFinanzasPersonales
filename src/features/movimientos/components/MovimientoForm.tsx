import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from '@mui/material';
import { Movimiento, Categoria } from '../../../shared/types/finance';
import { tipoMovimientoLabel } from '../../../shared/utils/tipoMovimientoMapper';

interface MovimientoFormProps {
  movimiento?: Movimiento | null;
  categorias: Categoria[];
  onSave: (movimiento: Omit<Movimiento, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const MovimientoForm: React.FC<MovimientoFormProps> = ({ movimiento, categorias, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    monto: '',
    descripcion: '',
    categoriaId: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'EGRESO' as 'INGRESO' | 'EGRESO',
  });

  useEffect(() => {
    if (movimiento) {
      setFormData({
        monto: (movimiento.valor || 0).toString(),
        descripcion: movimiento.descripcion,
        categoriaId: movimiento.categoriaId,
        fecha: movimiento.fecha.split('T')[0],
        tipo: movimiento.tipo,
      });
    }
  }, [movimiento]);

  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement | { value: string }>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }
    
    if (!formData.descripcion.trim()) {
      alert('La descripción es requerida');
      return;
    }
    
    if (!formData.categoriaId) {
      alert('Debe seleccionar una categoría');
      return;
    }
    
    onSave({
      valor: parseFloat(formData.monto),
      descripcion: formData.descripcion,
      categoriaId: formData.categoriaId,
      fecha: formData.fecha,
      tipo: formData.tipo,
    });
  };

  const filteredCategorias = categorias.filter(cat => cat.tipo === formData.tipo);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.tipo}
              onChange={handleChange('tipo')}
              label="Tipo"
            >
              <MenuItem value="INGRESO">{tipoMovimientoLabel.INGRESO}</MenuItem>
              <MenuItem value="EGRESO">{tipoMovimientoLabel.EGRESO}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Fecha"
            value={formData.fecha}
            onChange={handleChange('fecha')}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descripción"
            value={formData.descripcion}
            onChange={handleChange('descripcion')}
            required
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={formData.categoriaId}
              onChange={handleChange('categoriaId')}
              label="Categoría"
            >
              {filteredCategorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Monto"
            type="number"
            value={formData.monto}
            onChange={handleChange('monto')}
            required
            inputProps={{
              min: 0,
              step: 0.01,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {movimiento ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovimientoForm;
