import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import MovimientosPage from './pages/MovimientosPageNew';
import PresupuestosPage from './pages/PresupuestosPage';
import CategoriasPage from './pages/categorias/CategoriasPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
    </AuthProvider>
  );
}

export default App;
