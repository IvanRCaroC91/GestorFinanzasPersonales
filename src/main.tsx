// Importaciones necesarias para la aplicación React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/globals.css' // Estilos globales
import App from './app/App.tsx' // Componente principal de la aplicación

// Punto de entrada principal de la aplicación
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Proveedor de enrutamiento para la navegación */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

