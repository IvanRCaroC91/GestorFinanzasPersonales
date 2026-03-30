// Importaciones de componentes y utilidades de enrutamiento
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../shared/components/ProtectedRoute'; // Componente para rutas protegidas
import Layout from '../shared/components/layout/Layout'; // Componente de layout principal
import Login from './Login'; // Página de inicio de sesión
import Register from './Register'; // Página de registro
import DashboardPage from '../features/dashboard/DashboardPage'; // Página principal
import MovimientosPage from '../features/movimientos/MovimientosPageNew'; // Gestión de movimientos
import PresupuestosPage from '../features/presupuestos/PresupuestosPage'; // Gestión de presupuestos
import CategoriasPage from '../features/categorias/CategoriasPage'; // Gestión de categorías
import ThemeDemo from './ThemeDemo'; // Demostración de temas
import ConnectionDiagnostic from '../shared/components/ui/ConnectionDiagnostic'; // Diagnóstico de conexión

// Componente que define todas las rutas de la aplicación
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas sin autenticación */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/theme-demo" element={<ThemeDemo />} />
      <Route path="/diagnostic" element={<ConnectionDiagnostic />} />
      
      {/* Rutas protegidas que requieren autenticación */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/categorias" 
        element={
          <ProtectedRoute>
            <Layout>
              <CategoriasPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/movimientos" 
        element={
          <ProtectedRoute>
            <Layout>
              <MovimientosPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/presupuestos" 
        element={
          <ProtectedRoute>
            <Layout>
              <PresupuestosPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

// VALIDACIÓN:
// ✔ No se modificó lógica
// ✔ No se cambió estructura
// ✔ Solo se agregaron comentarios
