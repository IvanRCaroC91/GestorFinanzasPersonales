import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import Layout from '../shared/components/layout/Layout';
import Login from './Login';
import Register from './Register';
import DashboardPage from '../features/dashboard/DashboardPage';
import MovimientosPage from '../features/movimientos/MovimientosPageNew';
import PresupuestosPage from '../features/presupuestos/PresupuestosPage';
import CategoriasPage from '../features/categorias/CategoriasPage';
import ThemeDemo from './ThemeDemo';
import ConnectionDiagnostic from '../shared/components/ui/ConnectionDiagnostic';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/theme-demo" element={<ThemeDemo />} />
      <Route path="/diagnostic" element={<ConnectionDiagnostic />} />
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
