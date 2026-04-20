# 🚀 Guía de Despliegue en Vercel

## 📋 Requisitos Previos

1. **Backend en producción** con URL pública accesible
2. **Cuenta en Vercel** (https://vercel.com)
3. **Repositorio Git** con el código del frontend

## 🔧 Configuración Realizada

### ✅ Archivos Creados/Modificados

- **`.env.example`** - Plantilla de variables de entorno
- **`.env.production`** - Variables para producción
- **`vercel.json`** - Configuración específica de Vercel
- **`vite.config.ts`** - Actualizado para manejo dual local/producción
- **`src/shared/services/axiosConfig.ts`** - Lógica mejorada para entornos

### 🌍 Variables de Entorno

#### Desarrollo Local (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080
```

#### Producción Vercel (Configurar en dashboard de Vercel)
```env
VITE_API_BASE_URL=https://eureka-copy-production.up.railway.app
```

## 🚀 Pasos para Despliegue

### 1. Push de la Rama
```bash
git add .
git commit -m "feat: configuración para Vercel"
git push origin feature/configuracion-vercel
```

### 2. Crear Pull Request
1. Ir a GitHub/GitLab
2. Crear PR desde `feature/configuracion-vercel` hacia `main`
3. Esperar aprobación y merge

### 3. Conectar con Vercel
1. Iniciar sesión en [Vercel](https://vercel.com)
2. Hacer click en "Add New Project"
3. Conectar el repositorio Git
4. Seleccionar la rama `main`

### 4. Configurar Variables de Entorno en Vercel
1. En el dashboard del proyecto Vercel
2. Ir a "Settings" → "Environment Variables"
3. Agregar:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://eureka-copy-production.up.railway.app`
   - **Environments**: Production, Preview, Development

### 5. Despliegue Automático
Vercel detectará los cambios y desplegará automáticamente.

## 🔄 Funcionamiento Dual

### Desarrollo Local
- Usa proxy en `vite.config.ts` para redirigir `/api` → `http://localhost:8080`
- Variables de entorno desde archivo `.env`
- Hot reload y debugging completo

### Producción Vercel
- Usa `VITE_API_BASE_URL` directamente
- Sin proxy (no funciona en producción)
- Build optimizado con chunks separados

## 🛠️ Configuración del Backend

### CORS Requerido
El backend debe permitir CORS desde el dominio de Vercel:

```javascript
// Ejemplo en Express.js
app.use(cors({
  origin: ['https://tu-app.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### Headers de Seguridad
El frontend envía headers adicionales:
- `Authorization: Bearer <token>`
- `X-User-Id: <userId>`

## 🐛 Troubleshooting

### Error: "Network Error"
- Verificar que `VITE_API_BASE_URL` esté configurada en Vercel
- Confirmar que el backend esté accesible públicamente
- Revisar configuración CORS en el backend

### Error: "CORS Policy"
- Agregar dominio Vercel a la configuración CORS del backend
- Verificar que las credenciales estén permitidas

### Error: "401 Unauthorized"
- Verificar implementación JWT en backend
- Confirmar headers de autenticación

## 📱 URLs Finales

- **Frontend**: `https://tu-app.vercel.app`
- **Backend**: `https://eureka-copy-production.up.railway.app`
- **API**: `https://eureka-copy-production.up.railway.app/api/v1`

## 🔄 Actualizaciones Futuras

Cada push a la rama `main` desencadenará un nuevo despliegue automático en Vercel.

## 📞 Soporte

Para problemas de despliegue:
1. Revisar logs de Vercel en el dashboard
2. Verificar configuración de variables de entorno
3. Comprobar estado del backend
4. Validar configuración CORS
