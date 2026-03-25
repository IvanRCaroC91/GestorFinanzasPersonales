# Solución al Problema de CORS

## Problema
El error de CORS ocurre cuando el frontend (React) se ejecuta en un dominio/puerto diferente al backend (Spring Boot) y el backend no está configurado para permitir peticiones desde el origen del frontend.

## Solución Implementada (Proxy de Vite)

### 1. Configuración del Proxy en Vite
Se ha configurado un proxy en `vite.config.ts` para redirigir todas las peticiones `/api` al backend:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### 2. Configuración de Axios
Se ha actualizado `axiosConfig.ts` para usar URLs relativas:

```typescript
const axiosInstance = axios.create({
  baseURL: '/api/v1',  // URL relativa, el proxy la redirigirá
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 3. Actualización de Servicios
Se han actualizado los servicios para usar rutas relativas:
- `authService.ts`: `/auth/login` en lugar de `/api/v1/auth/login`
- `financeService.ts`: `/finance` en lugar de `/api/v1/finance`

## Si el Problema Persiste

### Opción A: Configurar CORS en el Backend (Spring Boot)
Agrega esta configuración a tu API Gateway:

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### Opción B: Verificar que el Backend esté Corriendo
Asegúrate de que el backend esté corriendo en `http://localhost:8080`:

```bash
# Verificar si el puerto está en uso
netstat -an | findstr :8080

# O probar la conexión directamente
curl http://localhost:8080/api/v1/auth/login
```

### Opción C: Revisar Logs del Proxy
El proxy de Vite está configurado para mostrar logs detallados. Revisa la consola del servidor de desarrollo para ver:
- Errores de conexión
- Peticiones enviadas al backend
- Respuestas recibidas

## Flujo de Petición con Proxy

1. **Frontend**: `axios.post('/auth/login', data)`
2. **Vite Proxy**: Redirige a `http://localhost:8080/api/v1/auth/login`
3. **Backend**: Procesa la petición y responde
4. **Vite Proxy**: Devuelve la respuesta al frontend

## Verificación

Para verificar que todo funciona correctamente:

1. Inicia el backend en `http://localhost:8080`
2. Inicia el frontend (debería correr en `http://localhost:5173`)
3. Intenta iniciar sesión
4. Revisa la consola del navegador y del servidor de desarrollo

## Notas Importantes

- El proxy solo funciona en modo desarrollo
- Para producción, el frontend y backend deberían estar en el mismo dominio o configurar CORS en el servidor
- Los logs del proxy ayudan a diagnosticar problemas de conexión
