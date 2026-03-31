// vite.config.ts
import { defineConfig } from "file:///C:/Users/lucasian/WebstormProjects/GestorFinanzasPersonales-FrontEnd/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/lucasian/WebstormProjects/GestorFinanzasPersonales-FrontEnd/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  // Plugins: configuración para soporte de React
  plugins: [react()],
  server: {
    // Configuración del servidor de desarrollo
    port: 5173,
    // Puerto donde correrá el servidor
    host: true,
    // Permite acceso desde la red
    proxy: {
      // Configuración de proxy para redirigir peticiones API
      "/api": {
        target: "http://localhost:8080",
        // Servidor backend al que se redirigen las peticiones
        changeOrigin: true,
        // Cambia el origen de la petición para evitar problemas CORS
        secure: false,
        // Permite conexiones HTTPS inseguras
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (_proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Received Response from the Target:", proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxsdWNhc2lhblxcXFxXZWJzdG9ybVByb2plY3RzXFxcXEdlc3RvckZpbmFuemFzUGVyc29uYWxlcy1Gcm9udEVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbHVjYXNpYW5cXFxcV2Vic3Rvcm1Qcm9qZWN0c1xcXFxHZXN0b3JGaW5hbnphc1BlcnNvbmFsZXMtRnJvbnRFbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2x1Y2FzaWFuL1dlYnN0b3JtUHJvamVjdHMvR2VzdG9yRmluYW56YXNQZXJzb25hbGVzLUZyb250RW5kL3ZpdGUuY29uZmlnLnRzXCI7Ly8gSW1wb3J0YWNpb25lcyBkZSBjb25maWd1cmFjaVx1MDBGM24gZGUgVml0ZSB5IHBsdWdpbiBkZSBSZWFjdFxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuXHJcbi8vIENvbmZpZ3VyYWNpXHUwMEYzbiBwcmluY2lwYWwgZGVsIHByb3llY3RvIFZpdGVcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAvLyBQbHVnaW5zOiBjb25maWd1cmFjaVx1MDBGM24gcGFyYSBzb3BvcnRlIGRlIFJlYWN0XHJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgLy8gQ29uZmlndXJhY2lcdTAwRjNuIGRlbCBzZXJ2aWRvciBkZSBkZXNhcnJvbGxvXHJcbiAgICBwb3J0OiA1MTczLCAvLyBQdWVydG8gZG9uZGUgY29ycmVyXHUwMEUxIGVsIHNlcnZpZG9yXHJcbiAgICBob3N0OiB0cnVlLCAvLyBQZXJtaXRlIGFjY2VzbyBkZXNkZSBsYSByZWRcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIC8vIENvbmZpZ3VyYWNpXHUwMEYzbiBkZSBwcm94eSBwYXJhIHJlZGlyaWdpciBwZXRpY2lvbmVzIEFQSVxyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLCAvLyBTZXJ2aWRvciBiYWNrZW5kIGFsIHF1ZSBzZSByZWRpcmlnZW4gbGFzIHBldGljaW9uZXNcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsIC8vIENhbWJpYSBlbCBvcmlnZW4gZGUgbGEgcGV0aWNpXHUwMEYzbiBwYXJhIGV2aXRhciBwcm9ibGVtYXMgQ09SU1xyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsIC8vIFBlcm1pdGUgY29uZXhpb25lcyBIVFRQUyBpbnNlZ3VyYXNcclxuICAgICAgICBjb25maWd1cmU6IChwcm94eSwgX29wdGlvbnMpID0+IHtcclxuICAgICAgICAgIC8vIENvbmZpZ3VyYWNpXHUwMEYzbiBkZSBsb2dzIHBhcmEgZGVidWdnaW5nIGRlbCBwcm94eVxyXG4gICAgICAgICAgcHJveHkub24oJ2Vycm9yJywgKGVyciwgX3JlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygncHJveHkgZXJyb3InLCBlcnIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBwcm94eS5vbigncHJveHlSZXEnLCAoX3Byb3h5UmVxLCByZXEsIF9yZXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlbmRpbmcgUmVxdWVzdCB0byB0aGUgVGFyZ2V0OicsIHJlcS5tZXRob2QsIHJlcS51cmwpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBwcm94eS5vbigncHJveHlSZXMnLCAocHJveHlSZXMsIHJlcSwgX3JlcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVjZWl2ZWQgUmVzcG9uc2UgZnJvbSB0aGUgVGFyZ2V0OicsIHByb3h5UmVzLnN0YXR1c0NvZGUsIHJlcS51cmwpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQSxFQUUxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBO0FBQUEsSUFFTixNQUFNO0FBQUE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUEsTUFFTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUE7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLFFBQ2QsUUFBUTtBQUFBO0FBQUEsUUFDUixXQUFXLENBQUMsT0FBTyxhQUFhO0FBRTlCLGdCQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssTUFBTSxTQUFTO0FBQ3JDLG9CQUFRLElBQUksZUFBZSxHQUFHO0FBQUEsVUFDaEMsQ0FBQztBQUNELGdCQUFNLEdBQUcsWUFBWSxDQUFDLFdBQVcsS0FBSyxTQUFTO0FBQzdDLG9CQUFRLElBQUksa0NBQWtDLElBQUksUUFBUSxJQUFJLEdBQUc7QUFBQSxVQUNuRSxDQUFDO0FBQ0QsZ0JBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLFNBQVM7QUFDNUMsb0JBQVEsSUFBSSxzQ0FBc0MsU0FBUyxZQUFZLElBQUksR0FBRztBQUFBLFVBQ2hGLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
