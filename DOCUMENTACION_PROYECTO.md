# Documentación del Proyecto: Gestión Financiera - Presupuesto Personal

## 1. Descripción General del Proyecto

El proyecto "Gestión Financiera - Presupuesto Personal" es una aplicación web diseñada para ayudar a los usuarios a gestionar sus finanzas personales. El sistema permite a los usuarios registrarse, iniciar sesión y acceder a una página de inicio personalizada. El objetivo principal es proporcionar una experiencia sencilla y funcional para aprender los conceptos básicos del desarrollo web.

### **Propósito del sistema**
El propósito del sistema es permitir a los usuarios:
- Registrarse proporcionando un nombre de usuario, correo electrónico, contraseña y número de teléfono.
- Iniciar sesión con su nombre de usuario y contraseña.
- Acceder a una página de inicio personalizada después de iniciar sesión correctamente.

### **Funcionamiento del login**
El sistema de login permite a los usuarios autenticarse mediante su nombre de usuario y contraseña. La contraseña se almacena de forma segura en la base de datos utilizando un hash generado con la biblioteca `bcrypt`. Durante el inicio de sesión, la contraseña ingresada por el usuario se compara con el hash almacenado para verificar su validez.

---

## 2. Arquitectura del Sistema

El sistema sigue una arquitectura cliente-servidor, donde el frontend (React) se comunica con el backend (Node.js + Express) a través de una API. El backend interactúa con la base de datos MySQL para almacenar y recuperar información.

### **Diagrama del flujo de comunicación**
```
Usuario
   ↓
React Frontend
   ↓
Axios HTTP Request
   ↓
API Node.js + Express
   ↓
Consulta MySQL
   ↓
Respuesta JSON
   ↓
React muestra resultado
```

---

## 3. Explicación de cada tecnología utilizada

### **React**
React es una biblioteca de JavaScript para construir interfaces de usuario. Permite crear componentes reutilizables y manejar el estado de la aplicación de manera eficiente.

### **Vite**
Vite es una herramienta de desarrollo que permite crear aplicaciones web modernas con un tiempo de inicio rápido y una experiencia de desarrollo optimizada.

### **Node.js**
Node.js es un entorno de ejecución de JavaScript que permite ejecutar código JavaScript en el servidor.

### **Express**
Express es un framework para Node.js que facilita la creación de aplicaciones web y APIs.

### **Axios**
Axios es una biblioteca de JavaScript que permite realizar solicitudes HTTP desde el frontend al backend de manera sencilla.

### **Material UI**
Material UI es una biblioteca de componentes de interfaz de usuario para React que sigue las directrices de diseño de Google Material Design.

### **bcrypt**
bcrypt es una biblioteca para encriptar contraseñas de manera segura utilizando un algoritmo de hashing.

### **cors**
CORS (Cross-Origin Resource Sharing) es un mecanismo que permite que un servidor acepte solicitudes de recursos desde un dominio diferente al suyo.

### **MySQL**
MySQL es un sistema de gestión de bases de datos relacional que se utiliza para almacenar y gestionar datos estructurados.

---

## 4. Explicación de conceptos fundamentales

### **Frontend**
Es la parte de la aplicación que interactúa directamente con el usuario. En este proyecto, el frontend está desarrollado con React.

### **Backend**
Es la parte de la aplicación que maneja la lógica del servidor, las bases de datos y las APIs. En este proyecto, el backend está desarrollado con Node.js y Express.

### **API**
Una API (Interfaz de Programación de Aplicaciones) permite la comunicación entre el frontend y el backend.

### **Endpoint**
Un endpoint es una URL específica en la API que realiza una acción, como registrar un usuario o iniciar sesión.

### **HTTP Request**
Es una solicitud enviada desde el cliente al servidor para obtener o enviar datos.

### **HTTP Response**
Es la respuesta del servidor a una solicitud HTTP, que incluye datos y un código de estado.

### **JSON**
JSON (JavaScript Object Notation) es un formato de datos ligero utilizado para intercambiar información entre el cliente y el servidor.

### **Hash de Contraseña**
Un hash de contraseña es una representación encriptada de una contraseña que se utiliza para protegerla en la base de datos.

### **Autenticación**
Es el proceso de verificar la identidad de un usuario mediante credenciales como nombre de usuario y contraseña.

### **Componentes**
En React, los componentes son bloques de construcción reutilizables que representan partes de la interfaz de usuario.

### **Hooks de React**
Los hooks son funciones especiales de React que permiten usar el estado y otras características sin escribir una clase. Por ejemplo, `useState` se utiliza para manejar el estado en un componente funcional.

---

## 5. Estructura del Proyecto

### **Carpetas y Archivos**
- **src**: Contiene el código fuente del frontend.
  - **components**: Componentes reutilizables de la interfaz de usuario.
  - **pages**: Páginas principales de la aplicación.
    - **Login.tsx**: Página de inicio de sesión.
    - **Register.tsx**: Página de registro de usuarios.
    - **Home.tsx**: Página de inicio después del login.
  - **App.tsx**: Componente principal que define las rutas de la aplicación.
  - **main.tsx**: Punto de entrada de la aplicación React.
- **server.js**: Código del backend que maneja las rutas de la API y la conexión con la base de datos.
- **package.json**: Archivo de configuración del proyecto que define las dependencias y scripts.
- **vite.config.js**: Configuración de Vite para el proyecto.

---

## 6. Explicación de los Tipos de Archivos

- **.tsx**: Archivos de TypeScript con JSX, utilizados para escribir componentes de React.
- **.ts**: Archivos de TypeScript, un superconjunto de JavaScript que incluye tipado estático.
- **.js**: Archivos de JavaScript, utilizados para escribir código ejecutable en el navegador o en Node.js.
- **.json**: Archivos de datos en formato JSON, utilizados para almacenar configuraciones o datos estructurados.
- **.css**: Archivos de hojas de estilo en cascada, utilizados para definir el diseño visual de la aplicación.

---

## 7. Explicación Detallada de los Archivos Principales

### **Login.tsx**
```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, TextField, Button, Typography } from '@mui/material';

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        nombre_usuario: nombreUsuario,
        password: contraseña, // Cambiado de 'contraseña' a 'password'
      });
      setMensaje(response.data.message);
      if (response.status === 200) {
        navigate('/home');
      }
    } catch (error) {
      setMensaje('Credenciales inválidas');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Card style={{ padding: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Iniciar Sesión
        </Typography>
        <TextField
          label="Nombre de Usuario"
          fullWidth
          margin="normal"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1rem' }}
          onClick={handleLogin}
        >
          Iniciar Sesión
        </Button>
        <Button
          variant="text"
          color="secondary"
          fullWidth
          style={{ marginTop: '1rem' }}
          onClick={() => navigate('/register')}
        >
          ¿No tienes una cuenta? Regístrate aquí
        </Button>
        {mensaje && (
          <Typography color="error" style={{ marginTop: '1rem' }}>
            {mensaje}
          </Typography>
        )}
      </Card>
    </Container>
  );
};

export default Login;
```

Explicación:
- Línea 1-2: Importa las bibliotecas necesarias para usar React y React Router.
- Línea 3: Importa Axios, una biblioteca para realizar solicitudes HTTP.
- Línea 4: Importa componentes de Material UI para el diseño de la interfaz.
- Línea 6: Define el componente funcional `Login`.
- Línea 7-9: Define los estados locales para almacenar el nombre de usuario, la contraseña y los mensajes de error o éxito.
- Línea 10: Usa el hook `useNavigate` para redirigir a otras rutas.
- Línea 12-21: Define la función `handleLogin` que envía los datos del formulario al backend usando Axios. Si la respuesta es exitosa, redirige al usuario a la página de inicio (`/home`). Si hay un error, muestra un mensaje de "Credenciales inválidas".
- Línea 23-47: Renderiza el formulario de inicio de sesión con campos de entrada para el nombre de usuario y la contraseña, y botones para iniciar sesión o redirigir al registro. También muestra un mensaje de error si existe.
- Línea 49: Exporta el componente `Login` para que pueda ser usado en otras partes de la aplicación.

### **Register.tsx**
```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Register = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3001/register', {
        nombre_usuario: nombreUsuario,
        email,
        password,
        telefono,
      });
      setMensaje(response.data.message);
      if (response.status === 201) {
        setOpenDialog(true);
      }
    } catch {
      setMensaje('Error al registrar el usuario');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate('/');
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Card style={{ padding: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Registro de Usuario
        </Typography>
        <TextField
          label="Nombre de Usuario"
          fullWidth
          margin="normal"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Teléfono"
          fullWidth
          margin="normal"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1rem' }}
          onClick={handleRegister}
        >
          Registrarse
        </Button>
      </Card>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Registro Exitoso</DialogTitle>
        <DialogContent>
          <DialogContentText>{mensaje}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Register;
```

Explicación:
- Línea 1-2: Importa las bibliotecas necesarias para usar React y React Router.
- Línea 3: Importa Axios para realizar solicitudes HTTP.
- Línea 4: Importa componentes de Material UI para el diseño de la interfaz.
- Línea 6: Define el componente funcional `Register`.
- Línea 7-12: Define los estados locales para almacenar los datos del formulario, el mensaje de respuesta y el estado del diálogo de confirmación.
- Línea 13: Usa el hook `useNavigate` para redirigir a otras rutas.
- Línea 15-24: Define la función `handleRegister` que envía los datos del formulario al backend usando Axios. Si la respuesta es exitosa, muestra un diálogo de confirmación.
- Línea 26-29: Define la función `handleCloseDialog` que cierra el diálogo y redirige al usuario a la página de inicio de sesión.
- Línea 31-95: Renderiza el formulario de registro con campos de entrada para el nombre de usuario, email, contraseña y teléfono. Incluye un botón para enviar el formulario y un diálogo de confirmación que se muestra al completar el registro.
- Línea 97: Exporta el componente `Register` para que pueda ser usado en otras partes de la aplicación.

### **Home.tsx**
```tsx
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí se debe implementar la lógica para cerrar sesión
    navigate('/');
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido a tu Presupuesto Personal
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
      >
        Cerrar Sesión
      </Button>
    </Container>
  );
};

export default Home;
```

Explicación:
- Línea 1-2: Importa las bibliotecas necesarias para usar React y React Router.
- Línea 3: Importa componentes de Material UI para el diseño de la interfaz.
- Línea 5: Define el componente funcional `Home`.
- Línea 7: Usa el hook `useNavigate` para redirigir a otras rutas.
- Línea 9-11: Define la función `handleLogout` que cierra sesión al usuario (la lógica de cierre de sesión debe ser implementada) y lo redirige a la página de inicio.
- Línea 13-20: Renderiza la página de inicio del usuario con un mensaje de bienvenida y un botón para cerrar sesión.
- Línea 22: Exporta el componente `Home` para que pueda ser usado en otras partes de la aplicación.

### **App.tsx**
```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
```

Explicación:
- Línea 1-2: Importa las bibliotecas necesarias para usar React y React Router.
- Línea 3-5: Importa las páginas principales de la aplicación: Login, Register y Home.
- Línea 7: Define el componente funcional `App`.
- Línea 9-16: Configura las rutas de la aplicación. La ruta raíz (`/`) carga la página de inicio de sesión, `/register` carga la página de registro y `/home` carga la página de inicio del usuario.
- Línea 18: Exporta el componente `App` para que pueda ser usado en otras partes de la aplicación.

### **main.tsx**
```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
```

Explicación:
- Línea 1-2: Importa las bibliotecas necesarias para usar React y ReactDOM.
- Línea 3: Importa el componente principal `App`.
- Línea 4-5: Importa componentes de Material UI para el diseño de la interfaz.
- Línea 7: Crea un tema por defecto de Material UI.
- Línea 9-15: Renderiza la aplicación envolviendo el componente `App` con `ThemeProvider` y `CssBaseline` de Material UI para aplicar el tema y los estilos globales.
- Línea 17: Exporta el componente `main` para que pueda ser usado en otras partes de la aplicación.

### **server.js**
```javascript
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'presupuesto_personal',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

app.post('/register', (req, res) => {
  const { nombre_usuario, email, password, telefono } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO usuarios (nombre_usuario, email, password, telefono) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre_usuario, email, hashedPassword, telefono], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  });
});

app.post('/login', (req, res) => {
  const { nombre_usuario, password } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE nombre_usuario = ?';
  db.query(sql, [nombre_usuario], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    if (result.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const user = result[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  });
});

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
```

Explicación:
- Línea 1-2: Importa las bibliotecas necesarias para usar Express y MySQL.
- Línea 3: Importa CORS para manejar solicitudes de diferentes orígenes.
- Línea 4: Importa bcrypt para comparar hashes de contraseñas.
- Línea 5: Crea una instancia de la aplicación Express.
- Línea 6-7: Configura middleware para habilitar CORS y analizar cuerpos de solicitudes JSON.
- Línea 9-14: Crea una conexión a la base de datos MySQL con las credenciales proporcionadas y maneja el evento de conexión.
- Línea 16-30: Define el endpoint `/register` que maneja el registro de nuevos usuarios. Inserta un nuevo usuario en la base de datos con la contraseña encriptada.
- Línea 32-50: Define el endpoint `/login` que maneja el inicio de sesión de usuarios existentes. Verifica las credenciales y devuelve un mensaje de éxito o error.
- Línea 52-54: Inicia el servidor en el puerto 3001 y muestra un mensaje en la consola.

---

## 8. Flujo Completo del Login

1. El usuario abre la página de inicio de sesión.
2. React carga el formulario de login.
3. El usuario ingresa su nombre de usuario y contraseña.
4. Al hacer clic en "Iniciar Sesión", Axios envía una solicitud HTTP POST al endpoint `/login` del backend.
5. Express recibe la solicitud y extrae los datos del cuerpo.
6. Express consulta la base de datos MySQL para buscar al usuario por su nombre de usuario.
7. bcrypt compara la contraseña ingresada con el hash almacenado en la base de datos.
8. Si las credenciales son válidas, el servidor responde con un mensaje de éxito.
9. React redirige al usuario a la página de inicio.

---

## 9. Conexión con la Base de Datos

Node.js se conecta a MySQL utilizando la biblioteca `mysql2`. La conexión se establece al inicio del servidor con las credenciales proporcionadas. Las consultas SQL se ejecutan utilizando el método `db.query`, que permite interactuar con la base de datos para insertar o recuperar datos.

---

## 10. Explicación de Seguridad

Se utiliza `bcrypt` para proteger las contraseñas de los usuarios. En lugar de almacenar las contraseñas en texto plano, se genera un hash único para cada contraseña. Esto asegura que incluso si la base de datos es comprometida, las contraseñas no serán legibles.

---

## 11. Conclusión

El sistema de inicio de sesión implementado en este proyecto es un ejemplo básico pero funcional de cómo construir una aplicación web con autenticación. Utiliza tecnologías modernas y prácticas recomendadas para garantizar la seguridad y la funcionalidad. Este proyecto es una excelente base para aprender los fundamentos del desarrollo web y sentar las bases para proyectos más avanzados en el futuro.
