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
import { Presupuesto, Categoria } from '../../../shared/types/finance';
import financeService from '../../../shared/services/financeService';

interface PresupuestoFormProps {
  presupuesto?: Presupuesto | null;
  onSave: (presupuesto: any) => void;
  onCancel: () => void;
}

const PresupuestoForm: React.FC<PresupuestoFormProps> = ({ presupuesto, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    categoriaId: '',
    montoLimite: '',
    anio: new Date().getFullYear().toString(),
    mes: (new Date().getMonth() + 1).toString(),
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const meses = [
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
        montoLimite: presupuesto.montoLimite.toString(),
        anio: presupuesto.anio.toString(),
        mes: presupuesto.mes.toString(),
      });
    }
  }, [presupuesto]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | { value: string }>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const validateForm = () => {
    const monto = parseFloat(formData.montoLimite);
    const anio = parseInt(formData.anio);
    const mes = parseInt(formData.mes);
    
    return (
      formData.categoriaId &&
      !isNaN(monto) && monto > 0 &&
      !isNaN(anio) && anio >= 2000 && anio <= 2100 &&
      !isNaN(mes) && mes >= 1 && mes <= 12
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.error('[PresupuestoForm] Form validation failed');
      return;
    }
    
    console.log('[PresupuestoForm] Submitting form with data:', formData);
    onSave({
      ...formData,
      montoLimite: parseFloat(formData.montoLimite),
      anio: parseInt(formData.anio),
      mes: parseInt(formData.mes),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth required>
          <InputLabel shrink>Categoría</InputLabel>
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
            <InputLabel shrink>Monto Límite</InputLabel>
            <TextField
              fullWidth
              label="Monto Límite"
              type="number"
              value={formData.montoLimite}
              onChange={handleChange('montoLimite')}
              required
              inputProps={{
                min: 0,
                step: 0.01,
              }}
            />
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel shrink>Mes</InputLabel>
            <Select
              value={formData.mes}
              onChange={handleChange('mes')}
              label="Mes"
            >
              {meses.map((mes) => (
                <MenuItem key={mes.value} value={mes.value}>
                  {mes.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel shrink>Año</InputLabel>
            <TextField
              fullWidth
              label="Año"
              type="number"
              value={formData.anio}
              onChange={handleChange('anio')}
              required
              inputProps={{
                min: 2000,
                max: 2100,
              }}
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
