# Integración Frontend - Backend Spring Boot

## Arquitectura de Autenticación

### Estructura de Archivos

```
src/
├── services/
│   └── authService.ts          # Servicio de autenticación
├── contexts/
│   └── AuthContext.tsx         # Contexto global de autenticación
├── hooks/
│   ├── useLoginForm.ts         # Hook para formulario de login
│   └── useAuthenticatedApi.ts  # Hook para peticiones autenticadas
├── components/
│   └── ProtectedRoute.tsx      # Componente para rutas protegidas
├── constants/
│   └── api.ts                  # Constantes de endpoints de API
└── pages/
    ├── Login.tsx               # Página de login actualizada
    └── Home.tsx                # Página principal con logout
```

## Flujo de Autenticación

### 1. Login
- Usuario ingresa credenciales en `/login`
- `useLoginForm` maneja el estado del formulario
- `authService.login()` consume `POST http://localhost:8080/api/v1/auth/login`
- Backend retorna `{ success: boolean, token?: string, message?: string }`
- Token JWT se almacena en `localStorage`
- Usuario redirigido a `/home`

### 2. Rutas Protegidas
- `ProtectedRoute` verifica autenticación via `useAuth()`
- Si no está autenticado, redirige a `/login`
- Si está autenticado, renderiza el componente hijo

### 3. Peticiones Autenticadas
- `authService.getAuthHeaders()` añade `Authorization: Bearer <token>`
- `useAuthenticatedApi` hooks manejan estado automáticamente
- Soporte para GET, POST, PUT, DELETE autenticados

## Endpoints de API

### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/refresh` - Refrescar token
- `POST /api/v1/auth/logout` - Cerrar sesión

### Finanzas (Ejemplos)
- `GET /api/v1/transactions` - Listar transacciones
- `POST /api/v1/transactions` - Crear transacción
- `PUT /api/v1/transactions/:id` - Actualizar transacción
- `DELETE /api/v1/transactions/:id` - Eliminar transacción

## Uso de Hooks

### useLoginForm
```typescript
const {
  username,
  password,
  isLoading,
  error,
  updateField,
  handleSubmit,
  clearError,
} = useLoginForm();
```

### useAuth
```typescript
const {
  user,
  isAuthenticated,
  isLoading,
  login,
  logout,
} = useAuth();
```

### useAuthenticatedApi
```typescript
const { data, isLoading, error, execute } = useAuthenticatedApi<ResponseType>();
await execute('/api/v1/endpoint', { method: 'POST', body: JSON.stringify(payload) });
```

## Manejo de Errores

- Errores de red: "Error de conexión. Intente nuevamente."
- Credenciales inválidas: Mensaje del backend
- Errores de validación: Mensajes específicos del formulario

## Seguridad

- Token almacenado en localStorage (considerar HttpOnly cookies para producción)
- Headers de autorización automáticos
- Rutas protegidas a nivel de componente
- Limpieza de token al hacer logout

## Configuración del Backend

El frontend espera que el backend Spring Boot con API Gateway esté corriendo en:
- Gateway: `http://localhost:8080`
- Endpoint login: `POST http://localhost:8080/api/v1/auth/login`

## Próximos Pasos

1. Implementar decodificación de JWT para obtener información del usuario
2. Agregar refresh token automático
3. Implementar manejo de expiración de sesión
4. Agregar interceptor para redirigir al login cuando el token expire
5. Considerar migrar localStorage a cookies seguras
