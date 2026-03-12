# Gestión Financiera - Presupuesto Personal

## 1. Introducción del Proyecto

### ¿Qué es el sistema?
Gestión Financiera - Presupuesto Personal es una aplicación web full-stack desarrollada como proyecto universitario para la materia de Ingeniería de Software. El sistema proporciona una plataforma digital para que los usuarios puedan administrar sus finanzas personales de manera segura y eficiente.

### Problema que resuelve
En la actualidad, muchas personas enfrentan dificultades para llevar un control adecuado de sus ingresos y gastos, lo que resulta en una falta de visibilidad sobre su situación financiera. Este sistema aborda este problema mediante:

- **Centralización de información**: Todos los datos financieros en un solo lugar
- **Accesibilidad**: Disponibilidad 24/7 desde cualquier dispositivo con conexión a internet
- **Seguridad**: Protección de datos personales mediante autenticación robusta
- **Simplicidad**: Interfaz intuitiva que facilita el uso diario

### Público objetivo
El sistema está dirigido a:
- **Estudiantes universitarios**: Para aprender y practicar gestión financiera
- **Profesionales jóvenes**: Que inician su vida financiera independiente
- **Personas interesadas**: En mejorar sus hábitos de consumo y ahorro

### Contexto académico
Este proyecto fue desarrollado como parte del curso de Ingeniería de Software, demostrando la aplicación práctica de conceptos teóricos como:
- Arquitectura cliente-servidor
- Desarrollo full-stack
- Gestión de bases de datos
- Seguridad en aplicaciones web
- Diseño de interfaces de usuario

---

## 2. Arquitectura del Sistema

### Arquitectura Cliente-Servidor

El sistema implementa una arquitectura cliente-servidor tradicional con tres capas bien definidas:

#### **Frontend (Capa de Presentación)**
- **Tecnología**: React 18 + TypeScript + Vite
- **Responsabilidades**: 
  - Renderizado de la interfaz de usuario
  - Validación de datos en el cliente
  - Gestión de estado local
  - Navegación entre vistas
- **Comunicación**: Peticiones HTTP/HTTPS al backend mediante API REST
- **Puerto**: Desarrollo en puerto 5173 (Vite dev server)

#### **Backend (Capa de Negocio)**
- **Tecnología**: Node.js + Express
- **Responsabilidades**:
  - Lógica de negocio y reglas de autenticación
  - Procesamiento de peticiones HTTP
  - Conexión y operaciones con base de datos
  - Encriptación y seguridad de datos
- **Comunicación**: API RESTful endpoints
- **Puerto**: Operación en puerto 3001

#### **Base de Datos (Capa de Persistencia)**
- **Tecnología**: MySQL
- **Responsabilidades**:
  - Almacenamiento persistente de datos
  - Integridad y consistencia de la información
  - Consultas y transacciones SQL
- **Conexión**: Directa desde el backend mediante MySQL2

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
          │ (JSON)
          ▼
┌─────────────────┐
│   Backend       │
│   Node.js +     │
│   Express       │
│   Puerto: 3001  │
└─────────┬───────┘
          │ MySQL
          │ Protocol
          ▼
┌─────────────────┐
│   Base de Datos │
│   MySQL         │
│   Puerto: 3306  │
└─────────────────┘
```

### Flujo de Comunicación

1. **Usuario → Frontend**: Interacción directa mediante la interfaz web
2. **Frontend → Backend**: Peticiones HTTP con formato JSON
3. **Backend → Base de Datos**: Consultas SQL para operaciones CRUD
4. **Base de Datos → Backend**: Resultados de consultas
5. **Backend → Frontend**: Respuestas HTTP con datos JSON
6. **Frontend → Usuario**: Actualización de la interfaz con los datos recibidos

---

## 3. Tecnologías Utilizadas

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

#### **Material UI 7.3.9**
- **Propósito**: Biblioteca de componentes visuales basada en Material Design
- **Ventajas**: Componentes pre-diseñados, responsive, theming avanzado
- **Uso en el proyecto**: Tarjetas, formularios, botones y tipografía

#### **React Router DOM**
- **Propósito**: Gestión de rutas en aplicaciones React single-page
- **Ventajas**: Navegación declarativa, lazy loading, protección de rutas, enrutamiento del lado del cliente
- **Uso en el proyecto**: Navegación entre Login, Register y Home sin recargas de página

#### **Axios**
- **Propósito**: Cliente HTTP basado en promesas para comunicación con APIs
- **Ventajas**: Soporte para cancelación, interceptores, mejor manejo de errores, transformación automática de datos
- **Uso en el proyecto**: Comunicación asíncrona con el backend para autenticación y operaciones CRUD

### Backend

#### **Node.js**
- **Propósito**: Entorno de ejecución JavaScript del lado del servidor
- **Ventajas**: Ecosistema npm, asíncrono por naturaleza, escalable, JavaScript unificado
- **Uso en el proyecto**: Ejecución del servidor Express y lógica de negocio de autenticación

#### **Express**
- **Propósito**: Framework minimalista para construcción de APIs REST y aplicaciones web
- **Ventajas**: Middleware flexible, routing simple, rendimiento optimizado, gran ecosistema
- **Uso en el proyecto**: Creación de endpoints de autenticación, manejo de peticiones HTTP, middleware

#### **MySQL2**
- **Propósito**: Driver mejorado para conexión con base de datos MySQL
- **Ventajas**: Soporte para promesas, mejor rendimiento, seguridad mejorada, API moderna
- **Uso en el proyecto**: Conexión y operaciones con la base de datos mediante consultas parametrizadas

#### **bcrypt**
- **Propósito**: Librería para encriptación segura de contraseñas
- **Ventajas**: Algoritmo de hashing seguro, salt rounds configurables, resistencia a ataques de fuerza bruta
- **Uso en el proyecto**: Encriptación y verificación segura de contraseñas de usuario

#### **cors**
- **Propósito**: Middleware para habilitar Cross-Origin Resource Sharing
- **Ventajas**: Configuración flexible de políticas CORS, seguridad en peticiones cross-origin
- **Uso en el proyecto**: Permitir peticiones desde el frontend al backend de forma segura

---

## 4. Estructura del Proyecto

```
gestion-financiera/
├── src/                           # Código fuente del frontend
│   ├── pages/                     # Componentes de página
│   │   ├── Login.tsx             # Página de inicio de sesión
│   │   ├── Register.tsx          # Página de registro de usuarios
│   │   └── Home.tsx              # Página principal post-autenticación
│   ├── assets/                   # Recursos estáticos (imágenes, iconos)
│   │   └── react.svg             # Logo de React (template)
│   ├── App.tsx                   # Componente principal de React
│   ├── main.tsx                  # Punto de entrada de la aplicación
│   ├── App.css                   # Estilos específicos del componente App
│   └── index.css                 # Estilos globales de la aplicación
├── public/                        # Archivos públicos estáticos
│   └── vite.svg                  # Logo de Vite
├── server.js                      # Servidor backend con Express
├── package.json                   # Dependencias y scripts del proyecto
├── package-lock.json              # Versiones exactas de dependencias
├── vite.config.ts                 # Configuración de Vite
├── tsconfig.json                  # Configuración base de TypeScript
├── tsconfig.app.json              # Configuración TS para aplicación
├── tsconfig.node.json             # Configuración TS para Node.js
├── eslint.config.js               # Configuración de ESLint
├── .gitignore                     # Archivos ignorados por Git
└── README.md                      # Documentación del proyecto
```

### Explicación de Directorios Principales

#### **`src/` - Código Fuente Frontend**
Contiene todo el código TypeScript/React de la aplicación cliente. Es el corazón del frontend donde residen los componentes, lógica de presentación y estilos.

#### **`src/pages/` - Páginas de la Aplicación**
Alberga los componentes principales que representan las diferentes vistas de la aplicación. Cada archivo corresponde a una ruta específica en el sistema de navegación.

#### **`server.js` - Servidor Backend**
Archivo principal del backend que configura el servidor Express, define los endpoints de la API, maneja la conexión con la base de datos e implementa la lógica de autenticación.

#### **`package.json` - Gestión de Dependencias**
Define todas las librerías y herramientas necesarias para el proyecto, incluyendo scripts para desarrollo, construcción y ejecución de la aplicación.

---

## 5. Explicación Detallada de los Archivos Principales

### **1. Login.tsx**

#### Propósito del Archivo
Componente React funcional que implementa la interfaz de autenticación para usuarios existentes en el sistema. Es la puerta de entrada principal para usuarios registrados.

#### Conexión con otras Partes
- **Backend**: Realiza peticiones HTTP POST al endpoint `/login` del servidor Express
- **Base de Datos**: Acceso indirecto a través del servidor para validación de credenciales
- **Frontend**: Navegación programática al componente Home mediante React Router
- **Estado Local**: Gestión de credenciales y mensajes de error mediante hooks

#### Librerías Utilizadas
```typescript
import React, { useState } from 'react';           // Hook de estado
import { useNavigate } from 'react-router-dom';      // Navegación
import axios from 'axios';                          // Cliente HTTP
import { Container, Card, TextField, Button, Typography } from '@mui/material'; // UI Components
```

#### Flujo de Datos
- **Entrada**: Credenciales de usuario (nombre_usuario, password) desde el formulario
- **Procesamiento**: Validación básica y envío asíncrono al backend
- **Salida**: Mensaje de éxito/error y navegación condicional a `/home`

#### Explicación Técnica
```typescript
const [nombreUsuario, setNombreUsuario] = useState('');  // Estado para nombre de usuario
const [contraseña, setContraseña] = useState('');        // Estado para contraseña
const [mensaje, setMensaje] = useState('');              // Estado para mensajes de error
const navigate = useNavigate();                           // Hook de navegación

const handleLogin = async () => {                         // Función asíncrona de login
  try {
    const response = await axios.post('http://localhost:3001/login', {
      nombre_usuario: nombreUsuario,                     // Envío de credenciales
      password: contraseña,                              // al backend
    });
    
    setMensaje(response.data.message);                   // Actualización de estado con respuesta
    if (response.status === 200) {                       // Verificación de éxito
      navigate('/home');                                 // Redirección a página principal
    }
  } catch (error) {                                      // Manejo de errores
    setMensaje('Credenciales inválidas');                // Mensaje de error al usuario
  }
};
```

#### Rol dentro de la Arquitectura
Actúa como el primer punto de contacto para usuarios autenticados, implementando el flujo inicial de autenticación y estableciendo la sesión del usuario en el sistema.

---

### **2. Register.tsx**

#### Propósito del Archivo
Componente React que facilita el proceso de registro de nuevos usuarios en el sistema, recolectando información personal básica necesaria para la creación de cuentas.

#### Conexión con otras Partes
- **Backend**: Realiza peticiones HTTP POST al endpoint `/register` para crear nuevos usuarios
- **Base de Datos**: Persistencia de datos de usuario a través del servidor
- **Frontend**: Navegación automática al componente Login tras registro exitoso
- **UX**: Implementación de diálogos modales para feedback visual

#### Librerías Utilizadas
```typescript
import { useState } from 'react';                        // Gestión de estado
import { useNavigate } from 'react-router-dom';          // Navegación
import axios from 'axios';                               // Cliente HTTP
import { Container, Card, TextField, Button, Typography, 
         Dialog, DialogActions, DialogContent, 
         DialogContentText, DialogTitle } from '@mui/material'; // UI Components avanzados
```

#### Flujo de Datos
- **Entrada**: Datos de registro (nombre_usuario, email, password, telefono) desde formulario
- **Procesamiento**: Validación y envío asíncrono al backend
- **Salida**: Confirmación de registro, diálogo modal y redirección automática

#### Explicación Técnica
```typescript
const [openDialog, setOpenDialog] = useState(false);     // Estado para control de diálogo

const handleRegister = async () => {                      // Función de registro
  try {
    const response = await axios.post('http://localhost:3001/register', {
      nombre_usuario: nombreUsuario,
      email,                                              // Desestructuración de variables
      password,
      telefono,
    });
    
    setMensaje(response.data.message);                   // Mensaje del servidor
    if (response.status === 201) {                       // Verificación de creación exitosa
      setOpenDialog(true);                               // Apertura de diálogo de confirmación
    }
  } catch {                                               // Manejo simplificado de errores
    setMensaje('Error al registrar el usuario');
  }
};

const handleCloseDialog = () => {                         // Función de cierre de diálogo
  setOpenDialog(false);                                  // Cierre del modal
  navigate('/');                                         // Redirección a login
};
```

#### Rol dentro de la Arquitectura
Sirve como gateway para nuevos usuarios, implementando el primer paso del ciclo de vida del usuario en el sistema y estableciendo la base para futuras interacciones financieras.

---

### **3. Home.tsx**

#### Propósito del Archivo
Componente React que representa la página principal del sistema después de la autenticación exitosa. Actualmente funciona como página de bienvenida con estructura preparada para expansión.

#### Conexión con otras Partes
- **Frontend**: Componente destino después del login exitoso vía React Router
- **Backend**: Preparado para futuras integraciones con APIs de datos financieros
- **UX**: Base para implementación de dashboard y funcionalidades principales

#### Librerías Utilizadas
```typescript
import { Container, Card, Typography } from '@mui/material'; // Componentes básicos de UI
```

#### Flujo de Datos
- **Entrada**: Navegación desde Login.tsx tras autenticación exitosa
- **Salida**: Interfaz de bienvenida simple, preparada para expansión

#### Explicación Técnica
```typescript
const Home = () => {                                      // Componente funcional simple
  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>  // Contenedor responsive
      <Card style={{ padding: '2rem' }}>                  // Tarjeta con espaciado
        <Typography variant="h5" gutterBottom>            // Título principal
          Bienvenido al sistema de Presupuesto Personal
        </Typography>
      </Card>
    </Container>
  );
};
```

#### Rol dentro de la Arquitectura
Representa el área principal de trabajo del usuario autenticado, diseñada como punto central para futuras implementaciones de gestión financiera como dashboards, reportes y herramientas de análisis.

---

### **4. App.tsx**

#### Propósito del Archivo
Componente raíz de la aplicación React que organiza los componentes principales y controla la estructura base del frontend. Participa activamente en la arquitectura de la aplicación React como componente central.

#### Conexión con otras Partes
- **Frontend**: Componente raíz importado y renderizado desde main.tsx
- **Arquitectura**: Organiza los componentes principales y define el layout base
- **Sistema**: Punto de entrada principal para la estructura de la aplicación
- **Estado**: Gestión de estado global (actualmente demostrativo)

#### Librerías Utilizadas
```typescript
import { useState } from 'react';                        // Hook de estado
import reactLogo from './assets/react.svg';              // Recursos gráficos
import viteLogo from '/vite.svg';                        // Recursos gráficos
import './App.css';                                       // Estilos locales
```

#### Flujo de Datos
- **Entrada**: Renderizado desde main.tsx como componente raíz
- **Salida**: Interfaz de aplicación principal (actualmente demostrativa)

#### Explicación Técnica
```typescript
function App() {                                          // Componente principal
  const [count, setCount] = useState(0)                   // Estado demostrativo
  
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">      // Enlaces externos
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>                              // Título demostrativo
      <div className="card">                               // Contenedor interactivo
        <button onClick={() => setCount((count) => count + 1)}>  // Manejador de eventos
          count is {count}                                // Renderizado condicional
        </button>
      </div>
    </>
  )
}
```

#### Rol dentro de la Arquitectura
Actúa como componente raíz que orquesta toda la aplicación, organizando los componentes principales y controlando la estructura base del frontend. Es el punto central de la arquitectura React que define cómo se organizan y renderizan los componentes de la aplicación.

---

### **5. main.tsx**

#### Propósito del Archivo
Punto de entrada principal de la aplicación React que configura y renderiza la aplicación completa. Establece la conexión entre React y el DOM del navegador.

#### Conexión con otras Partes
- **DOM**: Conecta con el elemento HTML `#root` del navegador
- **React Router**: Configura el sistema de enrutamiento de la aplicación
- **Componentes**: Importa y renderiza los componentes principales (Login, Register, Home)
- **TypeScript**: Configuración de tipado estático para mejor desarrollo

#### Librerías Utilizadas
```typescript
import { StrictMode } from 'react'                        // Modo estricto de React
import { createRoot } from 'react-dom/client'            // API moderna de renderizado
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Sistema de rutas
```

#### Flujo de Datos
- **Entrada**: Archivo HTML principal (index.html) con elemento `#root`
- **Procesamiento**: Configuración de rutas y renderizado de componentes
- **Salida**: Aplicación React completamente renderizada en el DOM

#### Explicación Técnica
```typescript
createRoot(document.getElementById('root')!).render(      // API React 18 moderna
  <StrictMode>                                            // Modo estricto para desarrollo
    <Router>                                               // Configuración de enrutamiento
      <Routes>
        <Route path="/" element={<Login />} />            // Ruta por defecto: Login
        <Route path="/register" element={<Register />} />  // Ruta de registro
        <Route path="/home" element={<Home />} />          // Ruta principal post-login
      </Routes>
    </Router>
  </StrictMode>,
)
```

#### Rol dentro de la Arquitectura
Actúa como el orquestador principal de la aplicación, estableciendo la estructura de navegación y el punto inicial de renderizado. Es el componente que conecta toda la arquitectura frontend con el navegador y define el flujo de navegación de la aplicación.

---

### **6. server.js**

#### Propósito del Archivo
Servidor backend construido con Express que proporciona la API RESTful para autenticación de usuarios. Es el cerebro del sistema backend, manejando lógica de negocio, seguridad y persistencia de datos.

#### Conexión con otras Partes
- **Frontend**: Recibe peticiones HTTP de los componentes React mediante Axios
- **Base de Datos**: Conexión directa con MySQL para operaciones CRUD
- **Seguridad**: Implementa encriptación bcrypt para protección de contraseñas
- **Red**: Escucha peticiones en el puerto 3001 y responde con JSON

#### Librerías Utilizadas
```javascript
import express from 'express';                             // Framework web
import mysql from 'mysql2';                               // Driver de base de datos
import bcrypt from 'bcrypt';                               // Encriptación
import cors from 'cors';                                   // Middleware CORS
```

#### Flujo de Datos
- **Entrada**: Peticiones HTTP POST con datos JSON de autenticación
- **Procesamiento**: Validación, encriptación, consulta a base de datos
- **Salida**: Respuestas JSON con mensajes de estado y códigos HTTP

#### Explicación Técnica
```javascript
// Configuración inicial del servidor
const app = express();
const port = 3001;

// Middleware esenciales
app.use(express.json());                                  // Parseo de JSON
app.use(cors());                                          // Habilitación de CORS

// Configuración de conexión MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'devuser',
  password: 'devuser123!',
  database: 'presupuesto_personal',
});

// Endpoint de registro con encriptación
app.post('/register', async (req, res) => {
  const { nombre_usuario, email, password, telefono } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);  // Encriptación segura
    const query = 'INSERT INTO usuario (nombre_usuario, email, password, telefono) VALUES (?, ?, ?, ?)';
    
    db.query(query, [nombre_usuario, email, hashedPassword, telefono], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Error al registrar el usuario.' });
      }
      res.status(201).json({ message: 'Usuario registrado correctamente.' });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud.' });
  }
});

// Endpoint de login con validación
app.post('/login', (req, res) => {
  const { nombre_usuario, password } = req.body;
  
  if (!nombre_usuario || !password) {
    return res.status(400).json({ message: 'Por favor, complete todos los campos requeridos.' });
  }
  
  const query = 'SELECT * FROM usuario WHERE nombre_usuario = ?';
  db.query(query, [nombre_usuario], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    
    res.status(200).json({ message: `Bienvenido ${user.nombre_usuario}` });
  });
});
```

#### Rol dentro de la Arquitectura
Funciona como el cerebro del sistema backend, manejando toda la lógica de negocio, seguridad y persistencia de datos. Es el componente central que conecta el frontend con la base de datos y garantiza la integridad y seguridad del sistema mediante implementación de mejores prácticas de autenticación y manejo de errores.

---

## 6. Flujo Completo de Autenticación (Login)

### Paso a Paso del Proceso de Autenticación

#### **1. Ingreso de Datos (Frontend)**
- **Usuario**: Introduce nombre de usuario y contraseña en el formulario de Login.tsx
- **Componente**: Los campos `TextField` capturan la entrada del usuario
- **Estado**: `useState` actualiza las variables `nombreUsuario` y `contraseña`

```typescript
<TextField
  label="Nombre de Usuario"
  value={nombreUsuario}
  onChange={(e) => setNombreUsuario(e.target.value)}
/>
<TextField
  label="Contraseña"
  type="password"
  value={contraseña}
  onChange={(e) => setContraseña(e.target.value)}
/>
```

#### **2. Validación en Frontend**
- **Trigger**: Usuario hace clic en el botón "Iniciar Sesión"
- **Función**: `handleLogin()` se ejecuta
- **Validación**: Verificación básica de campos no vacíos (implícita)

```typescript
<Button onClick={handleLogin}>Iniciar Sesión</Button>
```

#### **3. Petición HTTP (Frontend → Backend)**
- **Cliente**: Axios envía petición POST asíncrona
- **URL**: `http://localhost:3001/login`
- **Headers**: Content-Type: application/json (automático)
- **Body**: JSON con credenciales del usuario

```typescript
const response = await axios.post('http://localhost:3001/login', {
  nombre_usuario: nombreUsuario,
  password: contraseña,
});
```

#### **4. Recepción en Backend (Endpoint)**
- **Servidor**: Express recibe petición en el endpoint `/login`
- **Middleware**: `express.json()` parsea el body a objeto JavaScript
- **Router**: Manejador del endpoint extrae datos del request

```javascript
app.post('/login', (req, res) => {
  const { nombre_usuario, password } = req.body;
  // ... procesamiento
});
```

#### **5. Consulta a la Base de Datos**
- **Conexión**: MySQL2 establece conexión con la base de datos
- **Query**: Ejecuta consulta SQL parametrizada para evitar inyección
- **Parámetros**: Nombre de usuario como parámetro seguro

```javascript
const query = 'SELECT * FROM usuario WHERE nombre_usuario = ?';
db.query(query, [nombre_usuario], async (err, results) => {
  // ... procesamiento de resultados
});
```

#### **6. Validación bcrypt**
- **Comparación**: `bcrypt.compare()` verifica contraseña contra hash almacenado
- **Seguridad**: Comparación timing-safe para prevenir ataques
- **Resultado**: Booleano que indica validez de credenciales

```javascript
const isPasswordValid = await bcrypt.compare(password, user.password);
```

#### **7. Respuesta del Servidor**
- **Éxito**: HTTP 200 con mensaje de bienvenida
- **Error**: HTTP 401 con mensaje de credenciales inválidas
- **Formato**: Respuesta JSON estandarizada

```javascript
// Éxito
res.status(200).json({ message: `Bienvenido ${user.nombre_usuario}` });

// Error
res.status(401).json({ message: 'Credenciales inválidas.' });
```

#### **8. Redirección en Frontend**
- **Recepción**: Axios recibe respuesta del servidor
- **Procesamiento**: Componente actualiza estado con mensaje
- **Navegación**: `useNavigate()` redirige a `/home` si éxito

```typescript
if (response.status === 200) {
  navigate('/home');
}
```

### Diagrama de Flujo de Autenticación

```
Usuario
   │
   ▼ (1. Ingresa datos)
Login.tsx
   │
   ▼ (2. Valida y envía)
Axios POST /login
   │
   ▼ (3. Recibe petición)
Express Server
   │
   ▼ (4. Consulta DB)
MySQL Database
   │
   ▼ (5. Retorna usuario)
Express Server
   │
   ▼ (6. Compara passwords)
bcrypt.compare()
   │
   ▼ (7. Envía respuesta)
Login.tsx
   │
   ▼ (8. Redirige)
Home.tsx
```

---

## 7. Instalación y Ejecución del Proyecto

### Requisitos Previos

- **Node.js**: Versión 18.0 o superior
- **npm**: Versión 8.0 o superior (incluido con Node.js)
- **MySQL**: Versión 8.0 o superior
- **Git**: Para clonar el repositorio

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/gestion-financiera.git
cd gestion-financiera
```

### Paso 2: Instalar Dependencias

```bash
# Instalar todas las dependencias del proyecto
npm install
```

Este comando instalará:
- **Dependencias de producción**: React, TypeScript, Express, MySQL2, bcrypt, etc.
- **Dependencias de desarrollo**: Vite, ESLint, tipos de TypeScript, etc.

### Paso 3: Configurar la Base de Datos

#### 3.1 Crear Base de Datos
```sql
CREATE DATABASE presupuesto_personal;
```

#### 3.2 Crear Tabla de Usuarios
```sql
USE presupuesto_personal;

CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.3 Crear Usuario de Base de Datos (Opcional)
```sql
CREATE USER 'devuser'@'localhost' IDENTIFIED BY 'devuser123!';
GRANT ALL PRIVILEGES ON presupuesto_personal.* TO 'devuser'@'localhost';
FLUSH PRIVILEGES;
```

### Paso 4: Ejecutar el Backend

```bash
# Iniciar el servidor backend
node server.js
```

El servidor se iniciará en `http://localhost:3001` y mostrará:
```
Server running on http://localhost:3001
Connected to MySQL database.
```

### Paso 5: Ejecutar el Frontend

En una nueva terminal:

```bash
# Iniciar el servidor de desarrollo de Vite
npm run dev
```

La aplicación frontend se iniciará en `http://localhost:5173` y mostrará:
```
  VITE v7.3.1  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Scripts Disponibles

El proyecto incluye los siguientes scripts en `package.json`:

```json
{
  "scripts": {
    "dev": "vite",                    // Iniciar servidor de desarrollo
    "build": "tsc -b && vite build",  // Construir para producción
    "lint": "eslint .",               // Ejecutar linting
    "preview": "vite preview"         // Previsualizar build de producción
  }
}
```

### Verificación de Instalación

Para verificar que todo funciona correctamente:

1. **Backend**: Visita `http://localhost:3001` - Debería mostrar un error 404 (normal)
2. **Frontend**: Visita `http://localhost:5173` - Debería mostrar la página de login
3. **Registro**: Crea una cuenta de prueba
4. **Login**: Inicia sesión con las credenciales creadas

### Solución de Problemas Comunes

#### Error de Conexión a MySQL
```bash
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solución**: Asegúrate de que MySQL esté corriendo y que las credenciales en `server.js` sean correctas.

#### Error de Puerto en Uso
```bash
Error: listen EADDRINUSE :::3001
```
**Solución**: Cambia el puerto en `server.js` o detén el proceso que usa el puerto.

#### Error de Dependencias
```bash
npm ERR! peer dep missing
```
**Solución**: Ejecuta `npm install --force` o revisa las versiones compatibles.

---

## 8. Configuración de la Base de Datos

### Creación de la Base de Datos

#### 1. Conexión a MySQL
```bash
mysql -u root -p
```

#### 2. Creación de la Base de Datos
```sql
CREATE DATABASE presupuesto_personal 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

#### 3. Selección de la Base de Datos
```sql
USE presupuesto_personal;
```

### Estructura de la Tabla `usuario`

```sql
CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nombre_usuario (nombre_usuario),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Descripción de Campos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identificador único del usuario |
| `nombre_usuario` | VARCHAR(50) | UNIQUE, NOT NULL | Nombre de usuario para login |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | Correo electrónico del usuario |
| `password` | VARCHAR(255) | NOT NULL | Hash bcrypt de la contraseña |
| `telefono` | VARCHAR(20) | NULL | Número de teléfono (opcional) |
| `fecha_creacion` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Fecha de creación del registro |
| `fecha_actualizacion` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Última actualización del registro |

### Índices y Optimización

La tabla incluye índices para optimizar las consultas más frecuentes:

```sql
-- Índice para búsquedas por nombre de usuario (usado en login)
CREATE INDEX idx_nombre_usuario ON usuario(nombre_usuario);

-- Índice para búsquedas por email (usado en registro)
CREATE INDEX idx_email ON usuario(email);
```

### Configuración en el Backend

La conexión a la base de datos se configura en `server.js`:

```javascript
const db = mysql.createConnection({
  host: 'localhost',              // Servidor MySQL
  user: 'devuser',               // Usuario de la base de datos
  password: 'devuser123!',        // Contraseña del usuario
  database: 'presupuesto_personal', // Nombre de la base de datos
  charset: 'utf8mb4',            // Conjunto de caracteres
});
```

### Verificación de la Configuración

Para verificar que la base de datos está correctamente configurada:

```sql
-- Verificar que la base de datos existe
SHOW DATABASES LIKE 'presupuesto_personal';

-- Verificar la estructura de la tabla
DESCRIBE usuario;

-- Verificar los índices
SHOW INDEX FROM usuario;
```

### Datos de Prueba (Opcional)

Para pruebas iniciales, puedes insertar un usuario de prueba:

```sql
-- Insertar usuario de prueba (la contraseña será encriptada por el backend)
INSERT INTO usuario (nombre_usuario, email, telefono) 
VALUES ('testuser', 'test@example.com', '1234567890');
```

**Nota**: No insertes contraseñas directamente. El backend se encargará de encriptarlas cuando los usuarios se registren a través de la interfaz web.

---

## 9. Documentación de la API (Endpoints)

### Resumen de Endpoints

El servidor Express proporciona dos endpoints principales para la gestión de autenticación de usuarios:

| Método | Endpoint | Propósito | Estado HTTP |
|--------|----------|-----------|-------------|
| POST | `/register` | Registro de nuevos usuarios | 201 (Creado) |
| POST | `/login` | Autenticación de usuarios existentes | 200 (OK) |

---

### POST /register

#### Propósito
Crear una nueva cuenta de usuario en el sistema con encriptación segura de contraseña.

#### URL
```
http://localhost:3001/register
```

#### Método
```
POST
```

#### Headers
```
Content-Type: application/json
```

#### Body (JSON)
```json
{
  "nombre_usuario": "string",
  "email": "string", 
  "password": "string",
  "telefono": "string"
}
```

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `nombre_usuario` | string | Sí | Nombre único de usuario (3-50 caracteres) |
| `email` | string | Sí | Correo electrónico válido y único |
| `password` | string | Sí | Contraseña (mínimo 6 caracteres) |
| `telefono` | string | No | Número de teléfono (formato libre) |

#### Respuestas

**Éxito (201 Created)**
```json
{
  "message": "Usuario registrado correctamente."
}
```

**Error (400 Bad Request)**
```json
{
  "message": "Error al registrar el usuario."
}
```

**Error (500 Internal Server Error)**
```json
{
  "message": "Error al procesar la solicitud."
}
```

#### Ejemplo de Uso

```bash
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_usuario": "juanperez",
    "email": "juan@example.com",
    "password": "password123",
    "telefono": "1234567890"
  }'
```

---

### POST /login

#### Propósito
Autenticar un usuario existente mediante nombre de usuario y contraseña.

#### URL
```
http://localhost:3001/login
```

#### Método
```
POST
```

#### Headers
```
Content-Type: application/json
```

#### Body (JSON)
```json
{
  "nombre_usuario": "string",
  "password": "string"
}
```

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `nombre_usuario` | string | Sí | Nombre de usuario registrado |
| `password` | string | Sí | Contraseña del usuario |

#### Respuestas

**Éxito (200 OK)**
```json
{
  "message": "Bienvenido juanperez"
}
```

**Error (400 Bad Request)**
```json
{
  "message": "Por favor, complete todos los campos requeridos."
}
```

**Error (401 Unauthorized)**
```json
{
  "message": "Credenciales inválidas."
}
```

**Error (500 Internal Server Error)**
```json
{
  "message": "Error al procesar la solicitud."
}
```

#### Ejemplo de Uso

```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_usuario": "juanperez",
    "password": "password123"
  }'
```

---

### Códigos de Estado HTTP

| Código | Significado | Contexto |
|--------|-------------|----------|
| 200 | OK | Login exitoso |
| 201 | Created | Usuario registrado exitosamente |
| 400 | Bad Request | Datos incompletos o inválidos |
| 401 | Unauthorized | Credenciales incorrectas |
| 500 | Internal Server Error | Error del servidor |

### Manejo de Errores

El API implementa un manejo consistente de errores:

```javascript
// Validación de entrada
if (!nombre_usuario || !password) {
  return res.status(400).json({ 
    message: 'Por favor, complete todos los campos requeridos.' 
  });
}

// Error de base de datos
if (err) {
  console.error('Error fetching user:', err);
  return res.status(500).json({ 
    message: 'Error al procesar la solicitud.' 
  });
}

// Usuario no encontrado
if (results.length === 0) {
  return res.status(401).json({ 
    message: 'Credenciales inválidas.' 
  });
}
```

### Consideraciones de Seguridad

- **Encriptación**: Todas las contraseñas se almacenan como hashes bcrypt
- **SQL Injection**: Se usan consultas parametrizadas para prevenir inyección SQL
- **CORS**: Configurado para permitir peticiones desde el frontend
- **Logging**: Los errores se registran en consola para depuración

---

## Configuración de Variables de Entorno

### Importancia de las Variables de Entorno

Las variables de entorno son fundamentales para mantener la seguridad y portabilidad de la aplicación. Permiten separar la configuración sensible del código fuente, evitando exponer credenciales y otros datos sensibles en el repositorio.

### Archivo .env de Ejemplo

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Configuración de la Base de Datos
DB_HOST=localhost
DB_USER=devuser
DB_PASSWORD=devuser123!
DB_NAME=presupuesto_personal

# Configuración del Servidor
PORT=3001

# Configuración de Entorno
NODE_ENV=development

# Configuración de Frontend (opcional)
VITE_API_URL=http://localhost:3001
```

### Modificación del server.js para Usar Variables de Entorno

Actualiza el archivo `server.js` para utilizar las variables de entorno:

```javascript
import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware esenciales
app.use(express.json());
app.use(cors());

// Configuración de conexión MySQL con variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
});

// Resto del código del servidor...
```

### Instalación del Paquete dotenv

Instala el paquete necesario para manejar variables de entorno:

```bash
npm install dotenv
```

### Archivo .gitignore Actualizado

Asegúrate de que el archivo `.gitignore` incluya:

```gitignore
# Variables de entorno
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Dependencias
node_modules

# Logs
logs
*.log
npm-debug.log*

# Build
dist
build

# IDE
.vscode
.idea

# OS
.DS_Store
Thumbs.db
```

### Por Qué No Es Buena Práctica Guardar Credenciales en el Código

#### **Riesgos de Seguridad**
1. **Exposición en Repositorios**: Las credenciales quedan expuestas en el historial de Git
2. **Acceso No Autorizado**: Cualquiera con acceso al código puede ver las credenciales
3. **Dificultad de Rotación**: Cambiar credenciales requiere modificar y desplegar código
4. **Ambientes Diferentes**: Mismas credenciales en desarrollo y producción

#### **Ventajas de Usar Variables de Entorno**
1. **Seguridad**: Las credenciales no están en el código fuente
2. **Flexibilidad**: Diferentes configuraciones para cada ambiente
3. **Portabilidad**: La aplicación puede desplegarse en diferentes entornos sin cambios
4. **Mantenimiento**: Las credenciales pueden rotarse sin modificar el código

### Configuración por Ambiente

#### Desarrollo (.env.development)
```env
DB_HOST=localhost
DB_USER=devuser
DB_PASSWORD=devuser123!
DB_NAME=presupuesto_personal_dev
NODE_ENV=development
PORT=3001
```

#### Producción (.env.production)
```env
DB_HOST=prod-db-server.com
DB_USER=produser
DB_PASSWORD=superSecurePassword123!
DB_NAME=presupuesto_personal_prod
NODE_ENV=production
PORT=3001
```

#### Testing (.env.test)
```env
DB_HOST=localhost
DB_USER=testuser
DB_PASSWORD=testuser123!
DB_NAME=presupuesto_personal_test
NODE_ENV=test
PORT=3002
```

### Buenas Prácticas Adicionales

1. **Documentación**: Documenta todas las variables de entorno necesarias
2. **Validación**: Valida que las variables requeridas estén presentes al iniciar
3. **Valores por Defecto**: Proporciona valores seguros por defecto cuando sea posible
4. **Secretos**: Para producción, considera usar servicios de gestión de secretos

### Validación de Variables de Entorno

Agrega validación al inicio del servidor:

```javascript
// Validar variables de entorno requeridas
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Error: La variable de entorno ${varName} es requerida`);
    process.exit(1);
  }
});
```

---

## 10. Seguridad del Sistema

### Encriptación de Contraseñas con bcrypt

#### Implementación
El sistema utiliza bcrypt para el almacenamiento seguro de contraseñas:

```javascript
// Encriptación durante el registro
const hashedPassword = await bcrypt.hash(password, 10);

// Verificación durante el login
const isPasswordValid = await bcrypt.compare(password, hashedPassword);
```

#### Características de bcrypt
- **Salt Rounds**: Configurado en 10 para balance entre seguridad y rendimiento
- **Algoritmo Blowfish**: Resistente a ataques de fuerza bruta
- **Salting Automático**: Cada contraseña tiene un salt único
- **Timing Attack Safe**: Protección contra ataques de temporización

#### Proceso de Encriptación
1. **Registro**: La contraseña original se convierte en un hash irreversible
2. **Almacenamiento**: Solo el hash se almacena en la base de datos
3. **Verificación**: bcrypt.compare() compara la contraseña ingresada con el hash almacenado

### Almacenamiento Seguro de Contraseñas

#### Estructura en Base de Datos
```sql
CREATE TABLE usuario (
  password VARCHAR(255) NOT NULL  -- Longitud suficiente para hashes bcrypt
);
```

#### Ejemplo de Hash Almacenado
```
$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

**Componentes del Hash**:
- `$2b$`: Versión del algoritmo bcrypt
- `10`: Salt rounds utilizados
- `N9qo8uLOickgx2ZMRZoMye`: Salt (22 caracteres)
- `IjZAgcfl7p92ldGxad68LJZdL17lhWy`: Hash resultante

### Validación de Credenciales

#### Validación en Backend
```javascript
// Validación de campos requeridos
if (!nombre_usuario || !password) {
  return res.status(400).json({ 
    message: 'Por favor, complete todos los campos requeridos.' 
  });
}

// Validación de longitud (ejemplo)
if (nombre_usuario.length < 3 || nombre_usuario.length > 50) {
  return res.status(400).json({ 
    message: 'El nombre de usuario debe tener entre 3 y 50 caracteres.' 
  });
}
```

#### Validación en Frontend
```typescript
// Validación básica antes de envío
const handleLogin = async () => {
  if (!nombreUsuario.trim() || !contraseña.trim()) {
    setMensaje('Por favor, complete todos los campos');
    return;
  }
  // ... resto del código
};
```

### Manejo de Errores del Backend

#### Principios de Seguridad
- **No exponer información sensible**: Los errores no revelan detalles del sistema
- **Logging seguro**: Los errores se registran para depuración pero no se muestran al usuario
- **Respuestas consistentes**: Mensajes genéricos para errores de autenticación

#### Implementación
```javascript
// Error genérico para el usuario
res.status(500).json({ 
  message: 'Error al procesar la solicitud.' 
});

// Logging detallado para desarrolladores
console.error('Error hashing password:', error);
```

### Configuración de CORS

#### Implementación en Backend
```javascript
import cors from 'cors';
app.use(cors());  // Permitir todas las origins (desarrollo)
```

#### Configuración Recomendada para Producción
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://tu-dominio.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Protección Contra Ataques Comunes

#### SQL Injection
- **Prevención**: Uso de consultas parametrizadas
- **Implementación**: MySQL2 con placeholders `?`

```javascript
// Seguro: Consulta parametrizada
const query = 'SELECT * FROM usuario WHERE nombre_usuario = ?';
db.query(query, [nombre_usuario], callback);

// Inseguro: Concatenación directa (NO USAR)
const query = `SELECT * FROM usuario WHERE nombre_usuario = '${nombre_usuario}'`;
```

#### XSS (Cross-Site Scripting)
- **Prevención**: React automáticamente escapa el contenido
- **Material UI**: Los componentes sanitizan la entrada del usuario

#### CSRF (Cross-Site Request Forgery)
- **Protección básica**: CORS restringe peticiones de otros dominios
- **Mejora futura**: Implementar tokens CSRF para producción

### Mejores Prácticas de Seguridad Implementadas

1. **Contraseñas nunca en texto plano**: Siempre encriptadas con bcrypt
2. **Validación de entrada**: Tanto en frontend como en backend
3. **Principio de menor privilegio**: Usuario de base de datos con permisos limitados
4. **Logging seguro**: Información sensible no expuesta al usuario
5. **CORS configurado**: Restricción de peticiones cross-origin
6. **HTTPS recomendado**: Para producción (pendiente de implementación)

### Consideraciones para Producción

- **Variables de entorno**: Mover credenciales a `.env`
- **Rate limiting**: Implementar límite de peticiones por IP
- **JWT**: Considerar tokens para manejo de sesiones
- **HTTPS**: Configurar certificado SSL/TLS
- **Auditoría**: Implementar logging de accesos

---

## 11. Posibles Mejoras Futuras

### Mejoras de Autenticación y Seguridad

#### **1. Implementación de JWT (JSON Web Tokens)**
- **Propósito**: Manejo de sesiones sin estado y escalable
- **Beneficios**: Reducción de carga en base de datos, mejor rendimiento
- **Implementación**:
```javascript
import jwt from 'jsonwebtoken';

// Generación de token
const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });

// Verificación de token
const decoded = jwt.verify(token, 'secret_key');
```

#### **2. Sistema de Roles y Permisos**
- **Roles**: Admin, Usuario, Invitado
- **Permisos**: Lectura, escritura, eliminación
- **Implementación**: Middleware de autorización

#### **3. Autenticación de Dos Factores (2FA)**
- **Métodos**: SMS, Email, Google Authenticator
- **Seguridad**: Capa adicional de protección

### Mejoras de Gestión Financiera

#### **4. Módulo Completo de Ingresos y Egresos**
- **Categorización**: Clasificación automática y manual
- **Presupuestos**: Límites por categoría y período
- **Alertas**: Notificaciones de excesos

#### **5. Dashboard Interactivo**
- **Gráficos**: Visualización de datos con Chart.js o D3.js
- **Métricas**: Balance mensual, tendencias, proyecciones
- **Widgets**: Personalización del panel principal

#### **6. Sistema de Cuentas Bancarias**
- **Múltiples cuentas**: Soporte para varias cuentas bancarias
- **Sincronización**: Conexión con APIs bancarias (Plaid, Yodlee)
- **Conciliación**: Reconciliación automática de transacciones

### Mejoras Técnicas

#### **7. Optimización de Base de Datos**
- **Indexación avanzada**: Índices compuestos para consultas complejas
- **Particionamiento**: División de tablas por fecha o usuario
- **Caching**: Redis para consultas frecuentes

#### **8. Arquitectura Microservicios**
- **Separación**: Servicio de autenticación, servicio financiero, servicio de reportes
- **Comunicación**: API Gateway y mensajería asíncrona
- **Escalabilidad**: Escalado independiente por servicio

#### **9. Testing Automatizado**
- **Unit Tests**: Jest para componentes React y funciones backend
- **Integration Tests**: Pruebas de flujo completo
- **E2E Tests**: Cypress para pruebas de usuario real

### Mejoras de Experiencia de Usuario

#### **10. Aplicación Móvil (React Native)**
- **Multiplataforma**: iOS y Android desde una base de código
- **Sincronización**: Datos sincronizados con versión web
- **Funcionalidades offline**: Modo sin conexión básico

#### **11. Sistema de Notificaciones**
- **Email**: Reportes semanales y alertas
- **Push**: Notificaciones en tiempo real
- **SMS**: Alertas críticas de seguridad

#### **12. Internacionalización (i18n)**
- **Múltiples idiomas**: Español, inglés, portugués
- **Localización**: Formatos de moneda y fecha
- **Accesibilidad**: WCAG 2.1 compliance

### Mejoras de Infraestructura

#### **13. Despliegue en la Nube**
- **Opciones**: AWS, Google Cloud, Azure
- **Contenerización**: Docker y Kubernetes
- **CI/CD**: GitHub Actions para despliegue automático

#### **14. Monitoreo y Analytics**
- **Métricas**: Prometheus y Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Analytics**: Google Analytics o Mixpanel

#### **15. Backup y Recuperación**
- **Automatización**: Backups diarios automáticos
- **Redundancia**: Réplicas geográficas
- **Disaster Recovery**: Plan de recuperación ante fallos

### Roadmap de Implementación

#### **Corto Plazo (1-3 meses)**
1. JWT y manejo de sesiones
2. Módulo básico de ingresos/egresos
3. Dashboard con gráficos simples
4. Testing unitario básico

#### **Mediano Plazo (3-6 meses)**
1. Sistema de roles y permisos
2. Categorización avanzada
3. Aplicación móvil básica
4. Despliegue en producción

#### **Largo Plazo (6+ meses)**
1. Microservicios
2. Sincronización bancaria
3. Machine Learning para categorización
4. Expansión a múltiples mercados

### Priorización por Valor y Esfuerzo

| Mejora | Valor | Esfuerzo | Prioridad |
|--------|-------|----------|-----------|
| JWT | Alto | Medio | 1 |
| Dashboard | Alto | Medio | 2 |
| Testing | Medio | Bajo | 3 |
| Móvil | Alto | Alto | 4 |
| Microservicios | Medio | Alto | 5 |

---

## 12. Conclusión Técnica

### Conceptos de Ingeniería de Software Demostrados

#### **1. Arquitectura Cliente-Servidor**
El proyecto implementa una arquitectura clásica cliente-servidor con clara separación de responsabilidades:
- **Frontend**: Responsable de la presentación y experiencia de usuario
- **Backend**: Encargado de la lógica de negocio y persistencia de datos
- **Base de Datos**: Capa de almacenamiento persistente

Esta separación permite desarrollo paralelo, escalabilidad independiente y mantenimiento simplificado.

#### **2. Desarrollo Full-Stack**
El sistema demuestra competencias integrales en:
- **Frontend**: React, TypeScript, Material UI, gestión de estado
- **Backend**: Node.js, Express, APIs RESTful
- **Base de Datos**: MySQL, diseño de esquemas, consultas optimizadas
- **Integración**: Comunicación efectiva entre capas mediante APIs

#### **3. Seguridad en Aplicaciones Web**
Implementación de prácticas de seguridad fundamentales:
- **Encriptación**: bcrypt para almacenamiento seguro de contraseñas
- **Validación**: Protección contra inyección SQL y XSS
- **CORS**: Configuración adecuada de políticas cross-origin
- **Manejo de errores**: Respuestas seguras que no exponen información sensible

#### **4. Diseño Modular y Escalable**
El código sigue principios de diseño que facilitan la expansión:
- **Componentes React**: Reutilizables y mantenibles
- **Modularidad**: Separación clara entre componentes y servicios
- **API RESTful**: Endpoints bien definidos y versionables
- **Configuración**: Separación de configuración y código

#### **5. Comunicación REST API**
Implementación profesional de comunicación cliente-servidor:
- **Métodos HTTP**: Uso apropiado de POST para creación y autenticación
- **Códigos de estado**: Respuestas HTTP semánticamente correctas
- **Formato JSON**: Estructura consistente de datos
- **Manejo de errores**: Estrategia unificada de gestión de excepciones

### Tecnologías Modernas Aplicadas

#### **Frontend Moderno**
- **React 18**: Uso de la API moderna con `createRoot()`
- **TypeScript**: Tipado estático para mayor robustez
- **Vite**: Herramienta de construcción rápida y moderna
- **Material UI**: Sistema de diseño profesional y consistente

#### **Backend Eficiente**
- **Node.js**: JavaScript asíncrono y escalable
- **Express**: Framework minimalista y flexible
- **MySQL2**: Driver optimizado con soporte para promesas
- **bcrypt**: Encriptación segura y probada en producción

### Prácticas de Desarrollo Profesional

#### **1. Gestión de Dependencias**
- **package.json**: Definición clara de dependencias y scripts
- **Versiones específicas**: Control preciso de versiones para reproducibilidad
- **Separación**: Dependencias de producción vs desarrollo

#### **2. Configuración de Herramientas**
- **TypeScript**: Configuración múltiple para aplicación y Node.js
- **ESLint**: Calidad de código y consistencia de estilo
- **Vite**: Configuración optimizada para desarrollo y producción

#### **3. Estructura de Proyecto**
- **Organización lógica**: Separación clara de componentes, páginas y utilidades
- **Nomenclatura consistente**: Convenciones claras para archivos y directorios
- **Documentación**: README completo y código auto-documentado

### Aprendizajes y Competencias Desarrolladas

#### **Técnicas**
- **Integración de tecnologías**: Combinación efectiva de múltiples herramientas
- **Resolución de problemas**: Debugging y optimización de rendimiento
- **Testing**: Estrategias de validación de funcionalidades

#### **Conceptuales**
- **Arquitectura software**: Diseño de sistemas escalables y mantenibles
- **Seguridad**: Implementación de medidas de protección de datos
- **UX/UI**: Diseño centrado en el usuario con Material UI

#### **Profesionales**
- **Documentación**: Creación de documentación técnica completa
- **Versionamiento**: Uso de Git para control de cambios
- **Colaboración**: Estructura de proyecto facilita trabajo en equipo

### Impacto y Aplicabilidad

El proyecto demuestra la aplicación práctica de conceptos teóricos de ingeniería de software en un contexto real:

- **Académico**: Síntesis de conocimientos adquiridos en el programa
- **Profesional**: Portafolio que demuestra competencias técnicas
- **Práctico**: Herramienta funcional con potencial de uso real

### Base para Futuros Desarrollos

La arquitectura establecida proporciona una base sólida para expansiones futuras:

- **Escalabilidad**: Capacidad para agregar nuevas funcionalidades
- **Mantenibilidad**: Código organizado para fácil evolución
- **Extensibilidad**: Puntos de extensión claramente definidos

### Conclusión Final

Este proyecto de Gestión Financiera representa una implementación completa y profesional de los principios de ingeniería de software modernos. Demuestra no solo competencia técnica en múltiples tecnologías, sino también una comprensión profunda de cómo integrar estas tecnologías en un sistema coherente, seguro y escalable.

La calidad del código, la completitud de la documentación y la robustez de la arquitectura lo convierten en un excelente ejemplo de desarrollo full-stack que sirve como base sólida para futuros proyectos profesionales y académicos.

---

## Licencia

Este proyecto fue desarrollado con fines académicos como parte de un proyecto universitario para la materia de Ingeniería de Software. 

### Propósito del Proyecto
- **Educacional**: Demostrar la aplicación práctica de conceptos de ingeniería de software
- **Formativo**: Servir como portafolio de competencias técnicas desarrolladas
- **Académico**: Cumplir con los requisitos del programa de estudios

### Restricciones de Uso
- **No Comercial**: Este proyecto no tiene fines comerciales ni lucrativos
- **Uso Educativo**: Puede ser utilizado como referencia para proyectos académicos similares
- **Atribución**: Se solicita reconocer la autoría original en caso de ser referenciado

### Tecnologías y Licencias
Las tecnologías utilizadas en este proyecto tienen sus propias licencias:
- **React**: MIT License
- **Node.js**: MIT License  
- **Express**: MIT License
- **MySQL**: GPL v2
- **Material UI**: MIT License

### Contacto y Colaboración
Para consultas académicas o colaboraciones educativas, este proyecto puede ser referenciado como ejemplo de implementación de prácticas modernas de desarrollo de software en contextos universitarios.

**Nota**: Este software se proporciona "tal cual" sin garantías explícitas o implícitas, siendo su principal objetivo el aprendizaje y la demostración de competencias técnicas.
