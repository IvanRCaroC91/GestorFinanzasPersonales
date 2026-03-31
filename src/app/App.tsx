// Importaciones de componentes y proveedores de la aplicación
import { AppProviders } from './providers'; // Proveedores de contexto globales
import { AppRoutes } from './routes'; // Configuración de rutas
import './App.css'; // Estilos específicos del componente App

// Componente principal de la aplicación
function App() {
  return (
    // Proveedores que envuelven toda la aplicación (contextos, temas, etc.)
    <AppProviders>
      {/* Sistema de enrutamiento de la aplicación */}
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
