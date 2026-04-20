// Importaciones de configuración de Vite y plugin de React
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración principal del proyecto Vite
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (development/production)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // Plugins: configuración para soporte de React
    plugins: [react()],
    
    // Configuración del servidor de desarrollo (solo en modo development)
    server: mode === 'development' ? {
      // Configuración del servidor de desarrollo
      port: 5173, // Puerto donde correrá el servidor
      host: true, // Permite acceso desde la red
      proxy: {
        // Configuración de proxy para redirigir peticiones API
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080', // Servidor backend al que se redirigen las peticiones
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
    } : undefined,
    
    // Configuración de build para producción
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
            router: ['react-router-dom']
          }
        }
      }
    },
    
    // Definir variables globales para la aplicación
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_NAME || 'Gestión Financiera'),
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0')
    }
  };
});

