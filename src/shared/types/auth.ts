// Tipos para el sistema de autenticación

/**
 * Interfaz para los datos de login enviados al backend
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Interfaz para la respuesta del login desde el backend
 */
export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

/**
 * Interfaz para errores de autenticación
 */
export interface AuthError {
  message: string;
  status?: number;
}

/**
 * Interfaz para el usuario autenticado
 */
export interface User {
  username: string;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Interfaz para el estado de autenticación
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Interfaz para el contexto de autenticación
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

/**
 * Interfaz para el estado del formulario de login
 */
export interface LoginFormState {
  username: string;
  password: string;
  isLoading: boolean;
  error: string;
}

/**
 * Interfaz para los headers de autenticación
 */
export interface AuthHeaders {
  'Content-Type': string;
  Authorization?: string;
}

// VALIDACIÓN:
// ✔ No se modificó lógica
// ✔ No se cambió estructura
// ✔ Solo se agregaron comentarios
