# Configuración de Rama en Vercel

## Para que Vercel detecte la rama feature/configuracion-vercel

### Opción 1: Cambiar Production Branch
1. Ir al dashboard de Vercel
2. Seleccionar el proyecto
3. Ir a Settings -> Git
4. Cambiar "Production Branch" de "main" a "feature/configuracion-vercel"

### Opción 2: Usar Preview Deployments
1. Crear Pull Request de feature/configuracion-vercel a main
2. Vercel creará automáticamente un preview deployment
3. Probar en el preview URL antes de merge

### Opción 3: Forzar detección con nuevo commit
Este archivo se crea para forzar un nuevo commit y que Vercel detecte la rama.

## Variables de Entorno para Vercel
```
VITE_API_BASE_URL=https://eureka-copy-production.up.railway.app
```

## URLs de Prueba
- Preview: https://tu-app-branch-name.vercel.app
- Producción: https://tu-app.vercel.app
