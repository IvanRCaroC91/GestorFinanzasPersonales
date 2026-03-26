# Gestión Financiera - Presupuesto Personal

## 📋 Tabla de Contenidos

1. [Introducción](#1-introducción-del-proyecto)
2. [Estado Actual del Sistema](#2-estado-actual-del-sistema)
3. [Arquitectura](#3-arquitectura-del-sistema)
4. [Tecnologías](#4-tecnologías-utilizadas)
5. [Estructura del Proyecto](#5-estructura-del-proyecto)
6. [Instalación y Configuración](#6-instalación-y-ejecución)
7. [Módulos del Sistema](#7-módulos-del-sistema)
8. [Diseño y Temas](#8-diseño-y-temas)
9. [API REST Endpoints](#9-api-rest-endpoints)
10. [Seguridad](#10-seguridad-del-sistema)
11. [Mejoras Futuras](#11-mejoras-futuras)
12. [Licencia](#12-licencia)

---

## 1. Introducción del Proyecto

### ¿Qué es el sistema?
Gestión Financiera - Presupuesto Personal es una aplicación web full-stack con arquitectura de microservicios desarrollada como proyecto universitario para la materia de Ingeniería de Software. El sistema proporciona una plataforma digital para que los usuarios puedan administrar sus finanzas personales de manera segura y eficiente.

### 🎯 Estado Actual: **PRODUCCIÓN FUNCIONAL**
El sistema ha evolucionado desde un prototipo académico hasta una aplicación financiera completa con dashboard, gestión de movimientos, categorías y presupuestos, utilizando una arquitectura moderna de microservicios con Spring Boot.

### Problema que resuelve
- **Centralización de información**: Todos los datos financieros en un solo lugar
- **Accesibilidad**: Disponibilidad 24/7 desde cualquier dispositivo con conexión a internet
- **Seguridad**: Protección de datos personales mediante autenticación JWT robusta
- **Simplicidad**: Interfaz intuitiva que facilita el uso diario

---

## 2. Estado Actual del Sistema

### 🟢 Sistema Operativo y Completo

#### **Dashboard Modernizado**
- ✅ **Header con diseño gradiente**: Título centrado con efectos visuales modernos
- ✅ **Grid superior responsive**: 4 cards con datos financieros en tiempo real
- ✅ **Layout principal 67%-33%**: Presupuesto vs Ejecutado y Categorías/Movimientos
- ✅ **Datos reales**: Presupuesto vs ejecutado calculado con datos del mes actual
- ✅ **Texto optimizado**: Tamaño ajustado para legibilidad sin saltos de línea

#### **Módulos Completos**
- ✅ **Autenticación**: Login/Register con JWT y manejo de sesiones
- ✅ **Categorías**: CRUD completo para categorías de ingresos/egresos
- ✅ **Movimientos**: Registro y gestión de transacciones financieras
- ✅ **Presupuestos**: Configuración de límites por categoría y período
- ✅ **Dashboard**: Visualización de datos con gráficos y métricas

#### **Estado Técnico**
- ✅ **Frontend**: React 18 + TypeScript + Vite corriendo en puerto 5173
- ✅ **Backend**: Microservicios Spring Boot completamente operativos
- ✅ **API Gateway**: Puerto 8080 con routing y balanceo de carga
- ✅ **Service Registry**: Eureka Server en puerto 8761
- ✅ **Build**: Compilación exitosa sin errores
- ✅ **Git**: Historial limpio con commits versionados

---

## 3. Arquitectura del Sistema

### Arquitectura de Microservicios

#### **Frontend (Capa de Presentación)**
- **Tecnología**: React 18 + TypeScript + Vite + Material-UI
- **Responsabilidades**: 
  - Renderizado de la interfaz de usuario
  - Validación de datos en el cliente
  - Gestión de estado local
  - Navegación entre vistas
- **Comunicación**: Peticiones HTTP/HTTPS al API Gateway mediante API REST
- **Puerto**: Desarrollo en puerto 5173 (Vite dev server)

#### **API Gateway (Puerto 8080)**
- **Tecnología**: Spring Boot + Spring Cloud Gateway
- **Responsabilidades**:
  - Routing de peticiones a microservicios
  - Balanceo de carga
  - Configuración CORS
  - Health checks
- **Estado**: ✅ UP y operativo

#### **Microservicios Backend**

**Auth Service (Puerto 8081)**
- **Tecnología**: Spring Boot + Spring Security
- **Responsabilidades**:
  - Autenticación de usuarios
  - Generación y validación de JWT
  - Registro de usuarios
- **Credenciales de prueba**: admin/admin123

**Finance Service (Puerto 8083)**
- **Tecnología**: Spring Boot + Spring Data JPA
- **Responsabilidades**:
  - Gestión de movimientos financieros
  - Gestión de categorías
  - Gestión de presupuestos
  - Cálculos de ejecución presupuestaria

**Service Registry (Eureka - Puerto 8761)**
- **Tecnología**: Spring Cloud Eureka
- **Responsabilidades**:
  - Descubrimiento automático de servicios
  - Balanceo de carga
  - Health monitoring de servicios
- **Estado**: ✅ UP con 3 servicios registrados

### Diagrama de Arquitectura

```
┌─────────────────┐
│   Usuario       │
│   (Navegador)   │
└─────────┬───────┘
          │ HTTP/HTTPS
          ▼
┌─────────────────┐
│   Frontend      │
│   React + Vite  │
│   Puerto: 5173  │
└─────────┬───────┘
          │ API REST
          │ (Proxy Vite)
          ▼
┌─────────────────┐
│   API Gateway   │
│   Spring Boot   │
│   Puerto: 8080  │
└─────────┬───────┘
          │ Service Discovery
          ▼
┌─────────────────┐
│  Service Registry│
│   Eureka Server │
│   Puerto: 8761  │
└─────────┬───────┘
          │ Routing
          ▼
┌─────────────────┐  ┌─────────────────┐
│   Auth Service  │  │ Finance Service │
│   Spring Boot   │  │   Spring Boot   │
│   Puerto: 8081  │  │   Puerto: 8083  │
└─────────────────┘  └─────────────────┘
```

---

## 4. Tecnologías Utilizadas

### Frontend

#### **React 18**
- **Propósito**: Biblioteca principal para construcción de interfaces de usuario mediante componentes reutilizables
- **Ventajas**: Componentes funcionales con hooks, estado reactivo, ecosistema maduro, API moderna con createRoot
- **Uso en el proyecto**: Creación de componentes funcionales con hooks, gestión de estado local, navegación mediante React Router

#### **TypeScript**
- **Propósito**: Superset de JavaScript que añade tipado estático
- **Ventajas**: Mejor mantenibilidad, detección temprana de errores, autocompletado mejorado
- **Uso en el proyecto**: Tipado de componentes, interfaces y funciones

#### **Vite**
- **Propósito**: Herramienta de construcción y desarrollo rápido que optimiza el flujo de trabajo
- **Ventajas**: Hot Module Replacement (HMR), compilación optimizada, configuración mínima, desarrollo ágil
- **Uso en el proyecto**: Servidor de desarrollo rápido y proceso de build optimizado para producción

#### **Material-UI 5.15.15**
- **Propósito**: Biblioteca de componentes visuales basada en Material Design
- **Ventajas**: Componentes pre-diseñados, responsive, theming avanzado
- **Uso en el proyecto**: Tarjetas, formularios, botones, tablas y tipografía

#### **Axios 1.13.6**
- **Propósito**: Cliente HTTP basado en promesas para comunicación con APIs
- **Ventajas**: Soporte para cancelación, interceptores, mejor manejo de errores, transformación automática de datos
- **Uso en el proyecto**: Comunicación asíncrona con el backend para autenticación y operaciones CRUD

### Backend (Microservicios Spring Boot)

#### **Spring Boot 3.x**
- **Propósito**: Framework para creación de microservicios Java
- **Ventajas**: Autoconfiguración, dependencias inyectadas, producción lista
- **Uso en el proyecto**: Creación de Auth Service y Finance Service

#### **Spring Cloud Gateway**
- **Propósito**: API Gateway para routing y balanceo de carga
- **Ventajas**: Integración con Eureka, configuración dinámica, filtros
- **Uso en el proyecto**: Routing de peticiones a microservicios

#### **Spring Security + JWT**
- **Propósito**: Seguridad y autenticación en microservicios
- **Ventajas**: Integración nativa con Spring, tokens JWT seguros
- **Uso en el proyecto**: Autenticación y autorización en Auth Service

#### **Spring Cloud Eureka**
- **Propósito**: Service Discovery para microservicios
- **Ventajas**: Descubrimiento automático, health checks, balanceo de carga
- **Uso en el proyecto**: Registry de servicios

---

## 5. Estructura del Proyecto

```
GestorFinanzasPersonales-FrontEnd/
├── 📄 Archivos de configuración
│   ├── .env                          # Variables de entorno
│   ├── .gitignore                    # Ignorar archivos Git
│   ├── eslint.config.js              # Configuración ESLint
│   ├── index.html                    # HTML principal
│   ├── package.json                  # Dependencias y scripts
│   ├── package-lock.json             # Lock de dependencias
│   ├── postcss.config.js             # Configuración PostCSS
│   ├── tailwind.config.js            # Configuración Tailwind CSS
│   ├── tsconfig.json                 # Configuración TypeScript
│   ├── tsconfig.app.json             # Configuración TS para app
│   ├── tsconfig.node.json            # Configuración TS para Node
│   └── vite.config.ts                # Configuración Vite + Proxy
│
├── 📁 src/                          # Código fuente principal
│   ├── 📄 App.css                    # Estilos globales
│   ├── 📄 App.tsx                    # Componente principal
│   ├── 📄 index.css                  # Estilos base
│   ├── 📄 main.tsx                   # Punto de entrada
│   │
│   ├── 📁 api/                       # Configuración API
│   │   └── axiosConfig.ts            # Configuración Axios con interceptores
│   │
│   ├── 📁 assets/                    # Recursos estáticos
│   │   └── react.svg                 # Logo React
│   │
│   ├── 📁 components/                # Componentes reutilizables
│   │   ├── ConnectionDiagnostic.tsx  # Diagnóstico de conexión
│   │   ├── FinancialCard.tsx         # Card financiera
│   │   ├── ProtectedRoute.tsx        # Ruta protegida
│   │   ├── ThemeToggle.tsx           # Toggle tema
│   │   │
│   │   └── 📁 layout/                # Componentes de layout
│   │       ├── Layout.tsx            # Layout principal
│   │       ├── Sidebar.tsx           # Barra lateral
│   │       └── Topbar.tsx            # Barra superior
│   │
│   ├── 📁 constants/                 # Constantes de la app
│   │   └── api.ts                    # Constantes API
│   │
│   ├── 📁 contexts/                  # Contextos React
│   │   ├── AuthContext.tsx           # Contexto de autenticación
│   │   └── ThemeContext.tsx          # Contexto de tema
│   │
│   ├── 📁 hooks/                     # Hooks personalizados
│   │   ├── useAuthenticatedApi.ts    # Hook API autenticada
│   │   ├── useLoginForm.ts           # Hook formulario login
│   │   └── useReturnTo.ts            # Hook navegación
│   │
│   ├── 📁 pages/                     # Páginas de la app
│   │   ├── 📄 DashboardPage.tsx       # Dashboard principal (22KB)
│   │   ├── 📄 Home.tsx                # Página de inicio
│   │   ├── 📄 Login.tsx               # Login
│   │   ├── 📄 Register.tsx            # Registro
│   │   ├── 📄 PresupuestosPage.tsx    # Gestión presupuestos
│   │   ├── 📄 MovimientosPage.tsx     # Gestión movimientos
│   │   │
│   │   ├── 📁 categorias/            # Módulo categorías
│   │   │   ├── CategoriaForm.tsx      # Formulario categoría
│   │   │   └── CategoriasPage.tsx     # Lista categorías
│   │   │
│   │   ├── 📁 movimientos/           # Módulo movimientos
│   │   │   ├── MovimientoForm.tsx     # Formulario movimiento
│   │   │   └── MovimientosPage.tsx    # Lista movimientos
│   │   │
│   │   └── 📁 presupuestos/           # Módulo presupuestos
│   │       ├── PresupuestoForm.tsx    # Formulario presupuesto
│   │       └── PresupuestosPage.tsx   # Lista presupuestos
│   │
│   ├── 📁 services/                  # Servicios de API
│   │   ├── authService.ts             # Servicio autenticación
│   │   └── financeService.ts         # Servicio finanzas
│   │
│   ├── 📁 theme/                     # Configuración tema
│   │   ├── README.md                 # Documentación tema
│   │   └── theme.ts                  # Configuración tema Material-UI
│   │
│   ├── 📁 types/                     # Tipos TypeScript
│   │   ├── auth.ts                   # Tipos autenticación
│   │   ├── finance.ts                # Tipos finanzas
│   │   └── index.ts                  # Exportación tipos
│   │
│   └── 📁 utils/                     # Utilidades
│       ├── connectionTest.ts         # Test conexión
│       └── tipoMovimientoMapper.ts   # Mapeo tipos movimiento
│
├── 📁 dist/                          # Build de producción
├── 📁 node_modules/                  # Dependencias npm
├── 📁 public/                        # Archivos públicos
│   └── vite.svg                      # Logo Vite
│
└── 📄 Archivos de documentación
    ├── SYSTEM_STATUS.md              # Estado actual del sistema
    ├── INTEGRATION_README.md         # Integración frontend-backend
    ├── AUTHENTICATION_RESTRUCTURE_SUMMARY.md
    ├── CORS_SOLUTION.md
    └── README.md                     # Este archivo
```

---

## 6. Instalación y Configuración

### Requisitos Previos

- **Node.js**: Versión 18.0 o superior
- **npm**: Versión 8.0 o superior (incluido con Node.js)
- **Java**: JDK 17 o superior (para backend Spring Boot)
- **Git**: Para clonar el repositorio

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/gestion-financiera.git
cd gestion-financiera
```

### Paso 2: Instalar Dependencias Frontend

```bash
# Instalar todas las dependencias del frontend
npm install
```

### Paso 3: Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Configuración de la API
VITE_API_BASE_URL=http://localhost:8080

# Configuración del entorno
NODE_ENV=development
```

### Paso 4: Ejecutar el Backend (Microservicios Spring Boot)

```bash
# Iniciar Eureka Server (Service Registry)
# Puerto: 8761

# Iniciar API Gateway
# Puerto: 8080

# Iniciar Auth Service
# Puerto: 8081

# Iniciar Finance Service
# Puerto: 8083
```

### Paso 5: Ejecutar el Frontend

```bash
# Iniciar el servidor de desarrollo de Vite
npm run dev
```

### Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite",                    // Iniciar servidor de desarrollo
    "build": "tsc && vite build",  // Construir para producción
    "preview": "vite preview"         // Previsualizar build de producción
  }
}
```

---

## 7. Módulos del Sistema

### 🏠 Dashboard Principal

#### **Características Implementadas:**
- ✅ **Header Moderno**: Diseño gradiente con título centrado
- ✅ **Grid Superior**: 4 cards con datos financieros en tiempo real
- ✅ **Layout Principal**: 67% izquierda, 33% derecha
- ✅ **Datos Reales**: Presupuesto vs ejecutado calculado con datos del mes actual
- ✅ **Texto Optimizado**: Tamaño ajustado para legibilidad sin saltos de línea

#### **Componentes Clave:**
```tsx
// DashboardPage.tsx - Componente principal
const calcularPresupuestoVsEjecutado = (presupuestos, movimientos, categorias) => {
  // Filtrar por mes/año actual
  // Calcular ejecutado por categoría
  // Determinar estado (dentro/excedido)
  // Retornar datos para renderizado
};
```

### 🔐 Módulo de Autenticación

#### **Características:**
- ✅ **Login**: Formulario con validación y manejo de errores
- ✅ **Register**: Creación de cuentas con encriptación bcrypt
- ✅ **JWT**: Tokens de autenticación con expiración
- ✅ **Contexto**: Manejo global del estado de autenticación
- ✅ **Rutas Protegidas**: Components que requieren autenticación

#### **Flujo Completo:**
1. **Registro** → Creación de usuario con hash bcrypt
2. **Login** → Validación de credenciales en Auth Service
3. **JWT** → Generación de token para sesiones
4. **Contexto** → Estado global de autenticación
5. **Protección** → Rutas protegidas con validación

### 📊 Módulo de Movimientos

#### **Características:**
- ✅ **CRUD Completo**: Crear, Leer, Actualizar, Eliminar movimientos
- ✅ **Categorización**: Asociación con categorías de ingresos/egresos
- ✅ **Filtros**: Por fecha, categoría, tipo de movimiento
- ✅ **Formato**: Moneda colombiana (COP)
- ✅ **Validación**: Formularios con validación frontend y backend

### 🏷️ Módulo de Categorías

#### **Características:**
- ✅ **CRUD Completo**: Gestión completa de categorías
- ✅ **Tipos**: Categorías de ingresos y egresos
- ✅ **Organización**: Clasificación automática de movimientos
- ✅ **Validación**: Nombres únicos y datos requeridos

### 💰 Módulo de Presupuestos

#### **Características:**
- ✅ **Configuración**: Límites por categoría y período
- ✅ **Seguimiento**: Comparación presupuesto vs ejecutado
- ✅ **Alertas**: Notificación de excesos de presupuesto
- ✅ **Historial**: Gestión de presupuestos mensuales

---

## 8. Diseño y Temas

### 🎨 Sistema de Temas Financieros

La aplicación implementa un sistema de temas completo optimizado para aplicaciones financieras, siguiendo las mejores prácticas de diseño y accesibilidad.

#### **Paleta de Colores Semánticos**

**Colores de Marca**
- **Primario (Indigo)**: `#3F51B5` - Transmite confianza y estructura
- **Secundario (Rosa)**: `#FF4081` - Para acentos y llamadas a la acción

**Colores Financieros**
- **Ingresos (Verde Esmeralda)**: `#00C853` - Crecimiento y abundancia
- **Gastos (Rojo Coral)**: `#D32F2F` - Pérdidas y alertas críticas
- **Advertencia (Ámbar)**: `#FFA000` - Presupuestos por agotarse
- **Información (Azul Claro)**: `#0288D1` - Tips e información neutral

**Colores de Superficie**
- **Fondo Claro**: `#F4F7FE` - Descanso visual
- **Tarjetas**: `#FFFFFF` - Contenedores de datos
- **Fondo Oscuro**: `#121212` - Modo oscuro
- **Tarjetas Oscuras**: `#1E1E1E` - Contenedores en modo oscuro

#### **🌓 Modo Oscuro**

Soporte completo para modo oscuro con colores optimizados:
- **Ingresos**: `#00E676` (Verde neón)
- **Gastos**: `#FF5252` (Rojo brillante)
- **Advertencia**: `#FF9100` (Naranja sunrise)
- **Información**: `#40C4FF` (Azul brillante)

#### **🎯 Regla 60-30-10**

La aplicación sigue la regla de diseño 60-30-10:
- **60%**: Colores neutros (fondos)
- **30%**: Color de marca (botones, navegación)
- **10%**: Colores de acento (datos críticos)

#### **♿ Accesibilidad**

**Contraste WCAG**
- Todos los colores cumplen con el ratio de contraste WCAG de 4.5:1 como mínimo

**Uso Semántico del Color**
- El color nunca es el único indicador de información
- Estados de presupuesto incluyen iconos y texto
- Transacciones usan badges con texto descriptivo
- Indicadores de estado incluyen puntos de color + texto

#### **🛠️ Componentes Temáticos**

**FinancialCard**
```tsx
<FinancialCard
  title="Ingresos del Mes"
  amount={5000000}
  type="income"
  trend={{ value: 12.5, isPositive: true }}
/>
```

**TransactionItem**
```tsx
<TransactionItem
  description="Supermercado"
  amount={250000}
  category="Alimentación"
  date="24/03/2026"
  type="expense"
/>
```

**BudgetProgress**
```tsx
<BudgetProgress
  category="Transporte"
  spent={300000}
  budget={500000}
/>
```

#### **🎨 Clases CSS Disponibles**

**Botones**
- `.btn-primary` - Botón principal (indigo)
- `.btn-secondary` - Botón secundario (rosa)
- `.btn-success` - Botón de éxito (verde ingresos)
- `.btn-danger` - Botón de peligro (rojo gastos)

**Tarjetas**
- `.financial-card` - Tarjeta financiera base
- `.chart-container` - Contenedor para gráficos

**Badges**
- `.badge-income` - Badge de ingresos
- `.badge-expense` - Badge de gastos
- `.badge-warning` - Badge de advertencia

**Utilidades**
- `.text-income` - Texto color ingresos
- `.text-expense` - Texto color gastos
- `.text-warning` - Texto color advertencia
- `.bg-income-soft` - Fondo suave ingresos
- `.bg-expense-soft` - Fondo suave gastos
- `.bg-warning-soft` - Fondo suave advertencia

#### **🔄 Cambio de Tema**

El tema persiste en localStorage y responde a las preferencias del sistema:

```tsx
import { ThemeToggle } from '../components/ThemeToggle';

// Botón de cambio de tema
<ThemeToggle variant="button" />

// Switch de cambio de tema
<ThemeToggle variant="switch" />
```

#### **📱 Mejores Prácticas de Diseño**

1. **Consistencia Semántica**
   - Siempre usar colores `income` para valores positivos
   - Siempre usar colores `expense` para valores negativos
   - Usar `warning` para estados límite (80-90%)

2. **Jerarquía Visual**
   - Títulos más grandes y en color primario
   - Montos financieros en colores semánticos
   - Información secundaria en colores neutros

3. **Estados Interactivos**
   - Hover con cambios sutiles de opacidad
   - Focus con anillos de color primario
   - Loading con skeletons grises neutros

---

## 9. API REST Endpoints

### Arquitectura de APIs

#### **Base URL**: `http://localhost:8080/api/v1`

#### **Autenticación (Auth Service)**
| Método | Endpoint | Propósito | Estado HTTP |
|--------|----------|-----------|-------------|
| POST | `/auth/login` | Autenticación de usuarios | 200 (OK) |
| POST | `/auth/register` | Registro de nuevos usuarios | 201 (Creado) |
| POST | `/auth/refresh` | Refrescar token JWT | 200 (OK) |
| POST | `/auth/logout` | Cierre de sesión | 200 (OK) |

#### **Finanzas (Finance Service)**
| Método | Endpoint | Propósito | Estado HTTP |
|--------|----------|-----------|-------------|
| GET | `/finance/categorias` | Listar categorías | 200 (OK) |
| POST | `/finance/categorias` | Crear categoría | 201 (Creado) |
| PUT | `/finance/categorias/:id` | Actualizar categoría | 200 (OK) |
| DELETE | `/finance/categorias/:id` | Eliminar categoría | 200 (OK) |
| GET | `/finance/movimientos` | Listar movimientos | 200 (OK) |
| POST | `/finance/movimientos` | Crear movimiento | 201 (Creado) |
| PUT | `/finance/movimientos/:id` | Actualizar movimiento | 200 (OK) |
| DELETE | `/finance/movimientos/:id` | Eliminar movimiento | 200 (OK) |
| GET | `/finance/presupuestos` | Listar presupuestos | 200 (OK) |
| POST | `/finance/presupuestos` | Crear presupuesto | 201 (Creado) |
| PUT | `/finance/presupuestos/:id` | Actualizar presupuesto | 200 (OK) |
| DELETE | `/finance/presupuestos/:id` | Eliminar presupuesto | 200 (OK) |
| GET | `/finance/presupuestos/ejecucion` | Ejecución presupuestaria | 200 (OK) |

#### **Health Checks**
| Método | Endpoint | Propósito | Estado HTTP |
|--------|----------|-----------|-------------|
| GET | `/actuator/health` | Health check API Gateway | 200 (OK) |

### Formato de Respuestas

**Éxito (200 OK)**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

**Error (400 Bad Request)**
```json
{
  "success": false,
  "message": "Datos inválidos o incompletos"
}
```

**Autenticación Exitosa**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-del-usuario",
    "username": "admin",
    "email": "admin@example.com"
  },
  "userId": "uuid-del-usuario",
  "message": "Login exitoso"
}
```

---

## 10. Seguridad del Sistema

### 🔐 Encriptación y Autenticación
- **JWT**: Tokens JSON Web Tokens con expiración configurable
- **bcrypt**: Algoritmo de hashing seguro para contraseñas
- **Spring Security**: Integración nativa con Spring Boot
- **Autorización**: Headers `Authorization: Bearer <token>`

### 🛡️ Protección Contra Ataques
- **SQL Injection**: Uso de Spring Data JPA con consultas seguras
- **XSS**: React automáticamente escapa contenido
- **CORS**: Configuración adecuada en API Gateway
- **JWT**: Tokens con expiración y validación

### 🔄 Manejo de Sesiones
- **Tokens JWT**: Generados con expiración configurable
- **Refresh Token**: Mecanismo para renovación automática
- **Contexto Global**: Estado centralizado de autenticación en React
- **Interceptores Axios**: Manejo automático de headers de autorización

---

## 11. Mejoras Futuras

### 🚀 Mejoras Técnicas

#### **Corto Plazo (1-3 meses)**
1. **Testing Automatizado**: Jest para componentes y Cypress para E2E
2. **Optimización de Build**: Code splitting y lazy loading
3. **Error Boundaries**: Manejo robusto de errores en React
4. **Monitoring**: Integración con herramientas de observabilidad

#### **Mediano Plazo (3-6 meses)**
1. **Dashboard Avanzado**: Gráficos interactivos con Chart.js
2. **Sistema de Roles**: Admin, Usuario, Invitado con permisos diferenciados
3. **Aplicación Móvil**: React Native para iOS y Android
4. **Notificaciones**: Email y push notifications
5. **Rate Limiting**: Implementación en API Gateway

#### **Largo Plazo (6+ meses)**
1. **Event Sourcing**: Arquitectura basada en eventos
2. **Machine Learning**: Categorización automática de movimientos
3. **Sincronización Bancaria**: Integración con APIs bancarias
4. **Analytics**: Sistema completo de métricas y reportes
5. **Multi-tenant**: Soporte para múltiples organizaciones

### 📊 Mejoras de Funcionalidad

#### **Gestión Financiera Avanzada**
1. **Metas de Ahorro**: Configuración y seguimiento de objetivos
2. **Inversiones**: Registro y seguimiento de portafolio
3. **Reportes Personalizados**: Generación de informes personalizados
4. **Exportación**: PDF, Excel para datos financieros
5. **Calendario Financiero**: Vista temporal de movimientos y presupuestos

#### **Mejoras de Arquitectura**
1. **Circuit Breaker**: Resiliencia en microservicios
2. **Distributed Tracing**: Seguimiento de peticiones entre servicios
3. **Message Queue**: Comunicación asíncrona entre servicios
4. **Caching**: Redis para mejorar rendimiento

---

## 12. Licencia

### Propósito del Proyecto
- **Educativo**: Demostrar la aplicación práctica de conceptos de ingeniería de software
- **Formativo**: Servir como portafolio de competencias técnicas desarrolladas
- **Académico**: Cumplir con los requisitos del programa de estudios

### Restricciones de Uso
- **No Comercial**: Este proyecto no tiene fines comerciales ni lucrativos
- **Uso Educativo**: Puede ser utilizado como referencia para proyectos académicos similares
- **Atribución**: Se solicita reconocer la autoría original en caso de ser referenciado

### Tecnologías y Licencias
- **React**: MIT License
- **Spring Boot**: Apache License 2.0
- **Material-UI**: MIT License
- **Axios**: MIT License

---

## 🎯 Estado Final del Proyecto

### ✅ Sistema Completo y Funcional
El proyecto "Gestión Financiera - Presupuesto Personal" representa una implementación completa y profesional de los principios de ingeniería de software modernos con arquitectura de microservicios.

### 🏆 Logros Alcanzados
- ✅ **Dashboard Moderno**: Interfaz atractiva con datos en tiempo real
- ✅ **Módulos Completos**: Autenticación, movimientos, categorías, presupuestos
- ✅ **Arquitectura Microservicios**: Spring Boot + API Gateway + Eureka
- ✅ **Seguridad Robusta**: JWT, Spring Security, validación completa
- ✅ **API RESTful**: Endpoints bien definidos y documentados
- ✅ **Calidad de Código**: TypeScript, ESLint, buenas prácticas

### 📈 Impacto y Aplicabilidad
- **Académico**: Síntesis de conocimientos adquiridos en el programa
- **Profesional**: Portafolio que demuestra competencias técnicas integrales
- **Práctico**: Herramienta funcional con potencial de uso real

---

## 📞 Contacto y Soporte

Para consultas académicas o colaboraciones educativas, este proyecto puede ser referenciado como ejemplo de implementación de prácticas modernas de desarrollo de software con arquitectura de microservicios en contextos universitarios.

**Nota**: Este software se proporciona "tal cual" sin garantías explícitas o implícitas, siendo su principal objetivo el aprendizaje y la demostración de competencias técnicas.
