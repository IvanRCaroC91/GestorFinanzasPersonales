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
import { Categoria } from '../../types/finance';

interface CategoriaFormProps {
  categoria?: Categoria | null;
  onSave: (categoria: Omit<Categoria, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({ categoria, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'GASTO' as 'INGRESO' | 'GASTO',
    tipoGasto: '',
  });

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre,
        tipo: categoria.tipo,
        tipoGasto: categoria.tipoGasto || '',
      });
    }
  }, [categoria]);

  const handleChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre de la Categoría"
            value={formData.nombre}
            onChange={handleChange('nombre')}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.tipo}
              onChange={handleChange('tipo')}
              label="Tipo"
            >
              <MenuItem value="INGRESO">Ingreso</MenuItem>
              <MenuItem value="GASTO">Gasto</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Tipo de Gasto"
            value={formData.tipoGasto}
            onChange={handleChange('tipoGasto')}
            helperText="Opcional, solo para gastos"
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
              {categoria ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoriaForm;
