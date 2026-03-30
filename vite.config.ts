// Importaciones de configuración de Vite y plugin de React
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración principal del proyecto Vite
export default defineConfig({
  // Plugins: configuración para soporte de React
  plugins: [react()],
  server: {
    // Configuración del servidor de desarrollo
    port: 5173, // Puerto donde correrá el servidor
    host: true, // Permite acceso desde la red
    proxy: {
      // Configuración de proxy para redirigir peticiones API
      '/api': {
        target: 'http://localhost:8080', // Servidor backend al que se redirigen las peticiones
        changeOrigin: true, // Cambia el origen de la petición para evitar problemas CORS
        secure: false, // Permite conexiones HTTPS inseguras
        configure: (proxy, _options) => {
          // Configuración de logs para debugging del proxy
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
});

// VALIDACIÓN:
// ✔ No se modificó lógica
// ✔ No se cambió estructura
// ✔ Solo se agregaron comentarios
