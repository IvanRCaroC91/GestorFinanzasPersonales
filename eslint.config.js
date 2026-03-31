// Importaciones de configuraciones de ESLint
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// Configuración principal de ESLint para el proyecto
export default defineConfig([
  // Ignora directorios específicos globalmente
  globalIgnores(['dist']),
  {
    // Archivos a los que aplica esta configuración
    files: ['**/*.{ts,tsx}'],
    // Extensiones de configuración base
    extends: [
      js.configs.recommended, // Reglas recomendadas de JavaScript
      tseslint.configs.recommended, // Reglas recomendadas de TypeScript
      reactHooks.configs.flat.recommended, // Reglas para React Hooks
      reactRefresh.configs.vite, // Configuración para React Refresh con Vite
    ],
    // Opciones del lenguaje
    languageOptions: {
      ecmaVersion: 2020, // Versión de ECMAScript
      globals: globals.browser, // Variables globales del navegador
    },
  },
])


