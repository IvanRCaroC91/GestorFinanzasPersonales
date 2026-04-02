// Importamos las herramientas necesarias de React y Material-UI
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
import { Presupuesto, Categoria } from '../../../shared/types/finance'; // Tipos de datos para presupuestos y categorías
import financeService from '../../../shared/services/financeService'; // Servicio para comunicarse con el backend

// Definimos las propiedades que nuestro componente necesita recibir
interface PresupuestoFormProps {
  presupuesto?: Presupuesto | null; // El presupuesto a editar (puede ser null si es nuevo)
  onSave: (presupuesto: any) => void; // Función que se ejecuta al guardar
  onCancel: () => void; // Función que se ejecuta al cancelar
}

// Componente principal del formulario de presupuestos
const PresupuestoForm: React.FC<PresupuestoFormProps> = ({ presupuesto, onSave, onCancel }) => {
  // Estado para guardar los datos del formulario
  const [formData, setFormData] = useState({
    categoriaId: '', // ID de la categoría seleccionada
    montoLimite: '', // Monto máximo que se puede gastar
    anio: new Date().getFullYear().toString(), // Año actual por defecto
    mes: (new Date().getMonth() + 1).toString(), // Mes actual por defecto
  });

  // Estado para guardar la lista de categorías disponibles
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Lista de meses del año para el selector
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

  // Efecto para cargar las categorías cuando el componente se monta
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        // Llamamos al servicio para obtener todas las categorías
        const response = await financeService.getCategorias();
        if (response.success) {
          // Si la respuesta es exitosa, guardamos las categorías en el estado
          setCategorias(response.data);
        }
      } catch (error) {
        // Si hay error, lo mostramos en la consola
        console.error('Error loading categorias:', error);
      }
    };

    // Ejecutamos la función para cargar las categorías
    loadCategorias();
  }, []); // El array vacío significa que solo se ejecuta una vez cuando el componente se monta

  // Efecto para cargar los datos del presupuesto si estamos editando
  useEffect(() => {
    if (presupuesto) {
      // Si hay un presupuesto, cargamos sus datos en el formulario
      setFormData({
        categoriaId: presupuesto.categoriaId || '', // ID de la categoría del presupuesto
        montoLimite: presupuesto.montoLimite.toString(), // Monto límite convertido a texto
        anio: presupuesto.anio.toString(), // Año del presupuesto
        mes: presupuesto.mes.toString(), // Mes del presupuesto
      });
    }
  }, [presupuesto]); // El array [presupuesto] significa que se ejecuta cada vez que el presupuesto cambia

  // Función para manejar los cambios en los campos del formulario
  // field: el nombre del campo que cambió (categoriaId, montoLimite, etc.)
  // event: el evento del input que contiene el nuevo valor
  const handleChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target?.value || event, // Usamos el valor del evento
    }));
  };

  // Función para validar que los datos del formulario sean correctos
  const validateForm = () => {
    const monto = parseFloat(formData.montoLimite); // Convertimos el monto a número
    const anio = parseInt(formData.anio); // Convertimos el año a número
    const mes = parseInt(formData.mes); // Convertimos el mes a número
    
    // Verificamos que todos los campos sean válidos
    return (
      formData.categoriaId && // Debe seleccionar una categoría
      !isNaN(monto) && monto > 0 && // El monto debe ser un número mayor a 0
      !isNaN(anio) && anio >= 2000 && anio <= 2100 && // El año debe estar entre 2000 y 2100
      !isNaN(mes) && mes >= 1 && mes <= 12 // El mes debe estar entre 1 y 12
    );
  };

  // Función que se ejecuta cuando el usuario envía el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evitamos que la página se recargue
    
    // Validamos que el formulario esté correcto
    if (!validateForm()) {
      console.error('[PresupuestoForm] Form validation failed'); // Mostramos error en consola
      return; // Salimos de la función si hay error
    }
    
    console.log('[PresupuestoForm] Submitting form with data:', formData); // Mostramos los datos que vamos a guardar
    onSave({
      ...formData, // Guardamos todos los datos del formulario
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
              onChange={handleChange('montoLimite')} // Función que se ejecuta al cambiar el monto
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
              value={formData.mes} // Mes seleccionado del presupuesto
              onChange={handleChange('mes')} // Función que se ejecuta al cambiar el mes
              label="Mes" // Etiqueta visible del campo
            >
              {meses.map((mes) => (
                <MenuItem key={mes.value} value={mes.value}>
                  {mes.label} {/* Nombre del mes */}
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
              value={formData.anio} // Año seleccionado del presupuesto
              onChange={handleChange('anio')} // Función que se ejecuta al cambiar el año
              required
              inputProps={{
                min: 2000, // Año mínimo permitido
                max: 2100, // Año máximo permitido
              }}
            />
          </FormControl>
        </Box>

        {/* Botones de acción del formulario */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            type="submit" // Tipo de botón para enviar formulario
            variant="contained" // Estilo del botón
            color="primary" // Color principal del tema
            sx={{ minWidth: 120 }}
          >
            {presupuesto ? 'Actualizar' : 'Guardar'} {/* Texto dinámico según si es nuevo o edición */}
          </Button>
          <Button
            type="button" // Botón que no envía formulario
            variant="outlined" // Estilo del botón (borde)
            onClick={onCancel} // Función que se ejecuta al hacer clic
            sx={{ minWidth: 120 }}
          >
            Cancelar {/* Texto fijo del botón */}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PresupuestoForm;
