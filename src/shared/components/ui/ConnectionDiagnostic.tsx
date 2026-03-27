import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Router as RouterIcon,
  Security as SecurityIcon,
  AccountBalance as FinanceIcon,
} from '@mui/icons-material';
import { runConnectionTest, ConnectionTestResult } from '../../utils/connectionTest';

const ConnectionDiagnostic: React.FC = () => {
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await runConnectionTest();
      setTestResult(result);
    } catch (err: any) {
      setError(err.message || 'Error al ejecutar prueba de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ejecutar prueba automáticamente al montar el componente
    handleTestConnection();
  }, []);

  const getStatusColor = (status: boolean) => status ? 'success' : 'error';
  const getStatusIcon = (status: boolean) => status ? <CheckIcon /> : <ErrorIcon />;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              🔍 Diagnóstico de Conexión
            </Typography>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              onClick={handleTestConnection}
              disabled={loading}
            >
              {loading ? 'Probando...' : 'Refrescar'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {testResult && (
            <Box>
              {/* Estado General */}
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📊 Estado General del Sistema
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      icon={getStatusIcon(testResult.success)}
                      label={testResult.success ? 'SISTEMA OPERATIVO' : 'SISTEMA CON ERRORES'}
                      color={testResult.success ? 'success' : 'error'}
                      variant="outlined"
                    />
                    <Typography variant="body2" color="textSecondary">
                      Última verificación: {new Date(testResult.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Estado de Servicios */}
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🔧 Estado de Microservicios
                  </Typography>
                  <List>
                    <ListItem>
                      <RouterIcon sx={{ mr: 2, color: testResult.services.gateway ? 'success.main' : 'error.main' }} />
                      <ListItemText
                        primary="API Gateway (localhost:8080)"
                        secondary="Punto de entrada único para todas las peticiones"
                      />
                      <Chip
                        icon={getStatusIcon(testResult.services.gateway)}
                        label={testResult.services.gateway ? 'UP' : 'DOWN'}
                        color={getStatusColor(testResult.services.gateway)}
                        size="small"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <SecurityIcon sx={{ mr: 2, color: testResult.services.auth ? 'success.main' : 'error.main' }} />
                      <ListItemText
                        primary="Auth Service"
                        secondary="Autenticación JWT y gestión de usuarios"
                      />
                      <Chip
                        icon={getStatusIcon(testResult.services.auth)}
                        label={testResult.services.auth ? 'UP' : 'DOWN'}
                        color={getStatusColor(testResult.services.auth)}
                        size="small"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <FinanceIcon sx={{ mr: 2, color: testResult.services.finance ? 'success.main' : 'error.main' }} />
                      <ListItemText
                        primary="Finance Service"
                        secondary="Gestión de movimientos, categorías y presupuestos"
                      />
                      <Chip
                        icon={getStatusIcon(testResult.services.finance)}
                        label={testResult.services.finance ? 'UP' : 'DOWN'}
                        color={getStatusColor(testResult.services.finance)}
                        size="small"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              {/* Errores */}
              {testResult.errors.length > 0 && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="error">
                      ⚠️ Errores Detectados
                    </Typography>
                    <List dense>
                      {testResult.errors.map((error, index) => (
                        <ListItem key={index}>
                          <ErrorIcon sx={{ mr: 2, color: 'error.main' }} />
                          <ListItemText primary={error} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

              {/* Instrucciones */}
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Nota:</strong> Si todos los servicios muestran "UP", el sistema está listo para usar.
                  Los errores 401 en Auth/Finance Service son normales (indican que el servicio responde pero requiere autenticación).
                </Typography>
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConnectionDiagnostic;
