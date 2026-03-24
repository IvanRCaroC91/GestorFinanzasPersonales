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
import { Presupuesto, Categoria } from '../../types/finance';
import financeService from '../../services/financeService';

interface PresupuestoFormProps {
  presupuesto?: Presupuesto | null;
  onSave: (presupuesto: Omit<Presupuesto, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const PresupuestoForm: React.FC<PresupuestoFormProps> = ({ presupuesto, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    categoriaId: '',
    montoMaximo: '',
    periodo: 'MENSUAL' as 'MENSUAL' | 'ANUAL',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    if (presupuesto) {
      setFormData({
        categoriaId: presupuesto.categoriaId,
        montoMaximo: presupuesto.montoMaximo.toString(),
        periodo: presupuesto.periodo,
        fechaInicio: presupuesto.fechaInicio.split('T')[0],
        fechaFin: presupuesto.fechaFin.split('T')[0],
      });
    }
  }, [presupuesto]);

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

  const handleChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handlePeriodoChange = (periodo: 'MENSUAL' | 'ANUAL') => {
    const today = new Date();
    let fechaFin: Date;

    if (periodo === 'MENSUAL') {
      fechaFin = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else {
      fechaFin = new Date(today.getFullYear() + 1, 0, 0);
    }

    setFormData(prev => ({
      ...prev,
      periodo,
      fechaFin: fechaFin.toISOString().split('T')[0],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      montoMaximo: parseFloat(formData.montoMaximo),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={formData.categoriaId}
              onChange={handleChange('categoriaId')}
              label="Categoría"
            >
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Período</InputLabel>
            <Select
              value={formData.periodo}
              onChange={(e) => handlePeriodoChange(e.target.value as 'MENSUAL' | 'ANUAL')}
              label="Período"
            >
              <MenuItem value="MENSUAL">Mensual</MenuItem>
              <MenuItem value="ANUAL">Anual</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Monto Máximo"
            type="number"
            value={formData.montoMaximo}
            onChange={handleChange('montoMaximo')}
            required
            inputProps={{
              min: 0,
              step: 0.01,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Fecha Inicio"
            value={formData.fechaInicio}
            onChange={handleChange('fechaInicio')}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Fecha Fin"
            value={formData.fechaFin}
            onChange={handleChange('fechaFin')}
            required
            InputLabelProps={{ shrink: true }}
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
              {presupuesto ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PresupuestoForm;
