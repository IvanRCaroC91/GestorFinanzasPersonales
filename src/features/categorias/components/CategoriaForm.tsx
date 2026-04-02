import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import { Categoria } from '../../../shared/types/finance';
import { tipoCategoriaLabel } from '../../../shared/utils/tipoMovimientoMapper';

interface CategoriaFormProps {
    categoria?: Categoria | null;
    onSave: (data: Omit<Categoria, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({ categoria, onSave, onCancel }) => {
    const [nombre, setNombre] = useState(categoria?.nombre || '');
    const [tipo, setTipo] = useState<'INGRESO' | 'EGRESO'>(categoria?.tipo === 'INGRESO' ? 'INGRESO' : 'EGRESO');
    const [tipoGasto, setTipoGasto] = useState<'NECESARIO' | 'NO_NECESARIO' | 'OCASIONAL' | ''>(categoria?.tipoGasto as 'NECESARIO' | 'NO_NECESARIO' | 'OCASIONAL' | '' || '');
    const [errors, setErrors] = useState<{ nombre?: string }>({});

    useEffect(() => {
        if (tipo === 'INGRESO') {
            setTipoGasto(''); // Limpiar tipoGasto si es INGRESO
        }
    }, [tipo]);

    const validate = (): boolean => {
        const newErrors: { nombre?: string } = {};
        if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        onSave({
            nombre: nombre.trim(),
            tipo,
            tipoGasto: tipo === 'EGRESO' ? (tipoGasto || 'NECESARIO') : undefined,
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                label="Nombre de la Categoría"
                fullWidth
                margin="normal"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
            />

            <FormControl fullWidth margin="normal">
                <InputLabel>Tipo</InputLabel>
                <Select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as 'INGRESO' | 'EGRESO')}
                    label="Tipo"
                >
                    <MenuItem value="INGRESO">{tipoCategoriaLabel.INGRESO}</MenuItem>
                    <MenuItem value="EGRESO">{tipoCategoriaLabel.EGRESO}</MenuItem>
                </Select>
            </FormControl>

            {tipo === 'EGRESO' && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>Tipo de Gasto</InputLabel>
                    <Select
                        value={tipoGasto}
                        onChange={(e) => setTipoGasto(e.target.value as 'NECESARIO' | 'NO_NECESARIO' | 'OCASIONAL')}
                        label="Tipo de Gasto"
                    >
                        <MenuItem value="NECESARIO">Necesario</MenuItem>
                        <MenuItem value="NO_NECESARIO">No necesario</MenuItem>
                        <MenuItem value="OCASIONAL">Ocasional</MenuItem>
                    </Select>
                </FormControl>
            )}

            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                <Button onClick={onCancel} color="inherit" variant="outlined">
                    Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    Guardar
                </Button>
            </Box>
        </Box>
    );
};

export default CategoriaForm;