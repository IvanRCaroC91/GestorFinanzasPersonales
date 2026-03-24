import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  LinearProgress,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  AccountBalance as BudgetIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import financeService from '../services/financeService';
import { Presupuesto } from '../types/finance';

const PresupuestosPage: React.FC = () => {
  const navigate = useNavigate();
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPresupuestos();
  }, []);

  const loadPresupuestos = async () => {
    try {
      setLoading(true);
      const response = await financeService.getPresupuestos();
      
      if (response.success) {
        setPresupuestos(response.data);
      }
    } catch (error) {
      console.error('Error loading presupuestos:', error);
    } finally {
      setLoading(false);
    }
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

  const getPorcentajeColor = (porcentaje: number) => {
    if (porcentaje >= 90) return 'error';
    if (porcentaje >= 75) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1A1A1A', mb: 1 }}>
          Presupuestos
        </Typography>
        <Typography variant="body2" sx={{ color: '#666666' }}>
          Gestiona tus límites de gasto por categoría
        </Typography>
      </Box>

      {/* Botón Crear */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate('/presupuestos/create')}
          sx={{ minWidth: 200 }}
        >
          Crear Presupuesto
        </Button>
      </Box>

      {/* Grid de Presupuestos */}
      <Grid container spacing={3}>
        {presupuestos.map((presupuesto) => {
          const porcentajeUsado = Math.min((presupuesto.montoUsado || 0) / presupuesto.montoMaximo * 100, 100);
          const color = getPorcentajeColor(porcentajeUsado);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={presupuesto.id}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {presupuesto.categoria?.nombre || 'Sin categoría'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {presupuesto.periodo}
                      </Typography>
                    </Box>
                    <Chip
                      label={presupuesto.periodo}
                      color={presupuesto.periodo === 'MENSUAL' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </Box>

                  {/* Monto Máximo */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      Límite
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                      {formatCurrency(presupuesto.montoMaximo)}
                    </Typography>
                  </Box>

                  {/* Monto Usado */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Gastado
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingDownIcon sx={{ color: 'secondary.main', fontSize: 16 }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: 'secondary.main', 
                            fontWeight: 600 
                          }}
                        >
                          {formatCurrency(presupuesto.montoUsado || 0)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Barra de Progreso */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Uso
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {porcentajeUsado.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={porcentajeUsado}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: color === 'error' ? '#D32F2F' : 
                                         color === 'warning' ? '#FF9800' : '#2E7D32',
                        },
                      }}
                    />
                  </Box>

                  {/* Disponible */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Disponible
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 16 }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'primary.main', 
                          fontWeight: 600 
                        }}
                      >
                        {formatCurrency(presupuesto.montoMaximo - (presupuesto.montoUsado || 0))}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Fechas */}
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E0E0E0' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Desde: {formatDate(presupuesto.fechaInicio)} - Hasta: {formatDate(presupuesto.fechaFin)}
                    </Typography>
                  </Box>
                </CardContent>

                {/* Indicador de Alerta */}
                {porcentajeUsado >= 90 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: '#D32F2F',
                      animation: 'pulse 2s infinite',
                    }}
                  />
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Estado Vacío */}
      {presupuestos.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <BudgetIcon sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
              No hay presupuestos registrados
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Crea tu primer presupuesto para empezar a controlar tus gastos
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/presupuestos/create')}
              sx={{ minWidth: 200 }}
            >
              Crear Primer Presupuesto
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PresupuestosPage;
