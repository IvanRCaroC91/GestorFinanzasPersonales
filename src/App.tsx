import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CategoriasPage from './pages/categorias/CategoriasPage';
import MovimientosPage from './pages/movimientos/MovimientosPage';
import PresupuestosPage from './pages/presupuestos/PresupuestosPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/categorias" 
              element={
                <ProtectedRoute>
                  <CategoriasPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/movimientos" 
              element={
                <ProtectedRoute>
                  <MovimientosPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/presupuestos" 
              element={
                <ProtectedRoute>
                  <PresupuestosPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
