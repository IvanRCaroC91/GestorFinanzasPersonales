import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'devuser',
  password: 'devuser123!',
  database: 'presupuesto_personal',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Routes

// Register
app.post('/register', async (req, res) => {
  const { nombre_usuario, email, password, telefono } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // encripta la contraseña -----------------------------------------------------
    console.log('Contraseña original:', password); // Depuración
    console.log('Hashed Password generado:', hashedPassword); // Depuración
    const query = 'INSERT INTO usuario (nombre_usuario, email, password, telefono) VALUES (?, ?, ?, ?)';
    const values = [nombre_usuario, email, hashedPassword, telefono];

    db.query(query, values, (err, result) => {
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

// Login
app.post('/login', (req, res) => {
  const { nombre_usuario, password } = req.body;

  if (!nombre_usuario || !password) {
    console.error('Faltan datos en la solicitud:', req.body); // Depuración
    return res.status(400).json({ message: 'Por favor, complete todos los campos requeridos.' });
  }

  const query = 'SELECT * FROM usuario WHERE nombre_usuario = ?';
  db.query(query, [nombre_usuario], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }

    if (results.length === 0) {
      console.log('Usuario no encontrado'); // Depuración
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const user = results[0];
    console.log('Usuario encontrado:', user); // Depuración

    const hashedPassword = user['password']; // Asegurar acceso correcto al campo
    console.log('Contraseña ingresada:', password); // Depuración
    console.log('Hashed Password desde la base de datos:', hashedPassword); // Depuración

    try {
      const isPasswordValid = await bcrypt.compare(password, hashedPassword); // compara la contraseña ingresa encriptada ------------------------------
      console.log('Resultado de la comparación de contraseñas:', isPasswordValid); // Depuración

      if (!isPasswordValid) {
        console.log('Contraseña incorrecta'); // Depuración
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }

      console.log('Contraseña correcta'); // Depuración
      res.status(200).json({ message: `Bienvenido ${user.nombre_usuario}` });
    } catch (error) {
      console.error('Error comparing passwords:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
