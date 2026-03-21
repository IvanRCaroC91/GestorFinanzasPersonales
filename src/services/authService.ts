// Servicio de autenticación para manejar la comunicación con el backend Spring Boot
import API_ENDPOINTS from '../constants/api';
import type { LoginRequest, LoginResponse, AuthError, AuthHeaders } from '../types';

class AuthService {
  /**
   * Inicia sesión con las credenciales proporcionadas
   * @param credentials - Credenciales de login (username y password)
   * @returns Promise con la respuesta del login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || 'Error en el inicio de sesión',
          status: response.status,
        } as AuthError;
      }

      // Si el login es exitoso, guardar el token en localStorage
      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
        } as AuthError;
      }
      throw error;
    }
  }

  /**
   * Obtiene el token JWT almacenado en localStorage
   * @returns Token JWT o null si no existe
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Verifica si hay un usuario autenticado
   * @returns true si existe un token, false en caso contrario
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }

  /**
   * Cierra sesión eliminando el token del localStorage
   */
  logout(): void {
    localStorage.removeItem('authToken');
  }

  /**
   * Obtiene los headers para peticiones autenticadas
   * @returns Headers con el token de autorización Bearer
   */
  getAuthHeaders(): AuthHeaders {
    const token = this.getToken();
    const headers: AuthHeaders = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Realiza una petición autenticada al backend
   * @param url - URL del endpoint
   * @param options - Opciones de la petición fetch
   * @returns Promise con la respuesta
   */
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const authHeaders = this.getAuthHeaders();
    
    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
      },
    };

    return fetch(url, fetchOptions);
  }
}

export default new AuthService();
