import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
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
    fechaInicio: '',
    fechaFin: '',
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
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

    loadCategorias();
  }, []);

  useEffect(() => {
    if (presupuesto) {
      setFormData({
        categoriaId: presupuesto.categoriaId || '',
        montoMaximo: presupuesto.montoMaximo.toString(),
        periodo: presupuesto.periodo,
        fechaInicio: presupuesto.fechaInicio,
        fechaFin: presupuesto.fechaFin,
      });
    }
  }, [presupuesto]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | { value: string }>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handlePeriodoChange = (periodo: 'MENSUAL' | 'ANUAL') => {
    setFormData(prev => ({
      ...prev,
      periodo,
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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

        <Box sx={{ display: 'flex', gap: 2 }}>
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

          <FormControl fullWidth required>
            <InputLabel>Monto Máximo</InputLabel>
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
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Fecha Inicio</InputLabel>
            <TextField
              fullWidth
              type="date"
              label="Fecha Inicio"
              value={formData.fechaInicio}
              onChange={handleChange('fechaInicio')}
              required
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Fecha Fin</InputLabel>
            <TextField
              fullWidth
              type="date"
              label="Fecha Fin"
              value={formData.fechaFin}
              onChange={handleChange('fechaFin')}
              required
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ minWidth: 120 }}
          >
            {presupuesto ? 'Actualizar' : 'Guardar'}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            sx={{ minWidth: 120 }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PresupuestoForm;
