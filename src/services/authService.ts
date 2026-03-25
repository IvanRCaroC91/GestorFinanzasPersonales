import axiosInstance from '../api/axiosConfig';

// Interfaces mejoradas
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    nombreCompleto?: string;
    iniciales?: string;
  };
  userId?: string;
}

interface JWTPayload {
  sub: string;
  username: string;
  email: string;
  exp: number;
  iat: number;
  userId?: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  private readonly USER_ID_KEY = 'userId';

  /**
   * Iniciar sesión
   * @param credentials - Credenciales del usuario
   * @returns Respuesta del login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('[AuthService] Attempting login...');
      const response = await axiosInstance.post('/auth/login', credentials);
      const data = response.data;

      console.log('[AuthService] Login response:', data);

      if (data.success && data.token) {
        // Guardar token
        this.setToken(data.token);
        
        // Extraer y guardar userId
        const userId = data.userId || data.user?.id || this.extractUserIdFromToken(data.token);
        
        // 🔧 CLAVE: Asegurar que userId sea un UUID válido
        const validUserId = this.isValidUUID(userId) ? userId : this.generateUUID();
        
        if (validUserId) {
          this.setUserId(validUserId);
        }
        
        // Crear y guardar userData
        const userData = {
          id: validUserId,
          username: data.user?.username || credentials.username,
          email: data.user?.email || '',
          nombreCompleto: data.user?.nombreCompleto || '',
          iniciales: data.user?.iniciales || ''
        };
        
        this.setUser(userData);
        
        // Asegurar que el response siempre tenga user
        data.user = userData;
        
        console.log('[AuthService] Login successful, user data stored:', userData);
      }

      return data;
    } catch (error: any) {
      console.error('[AuthService] Login error:', error);
      
      // Manejar diferentes tipos de error
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          throw new Error(data?.message || 'Credenciales inválidas');
        } else if (status === 429) {
          throw new Error('Demasiados intentos. Por favor, espere unos minutos.');
        } else if (status >= 500) {
          throw new Error('Error del servidor. Intente nuevamente más tarde.');
        }
        
        throw new Error(data?.message || 'Error en la autenticación');
      } else if (error.request) {
        throw new Error('Error de conexión. Verifique su red.');
      } else {
        throw new Error(error.message || 'Error desconocido');
      }
    }
  }

  /**
   * Registrar usuario
   * @param userData - Datos del usuario
   * @returns Respuesta del registro
   */
  async register(userData: any): Promise<{ success: boolean; message: string }> {
    try {
      console.log('[AuthService] Attempting registration...');
      const response = await axiosInstance.post('/auth/register', userData);
      console.log('[AuthService] Registration successful');
      return response.data;
    } catch (error: any) {
      console.error('[AuthService] Register error:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400) {
          throw new Error(data?.message || 'Datos inválidos');
        } else if (status === 409) {
          throw new Error('El usuario ya existe');
        } else if (status >= 500) {
          throw new Error('Error del servidor. Intente nuevamente más tarde.');
        }
        
        throw new Error(data?.message || 'Error en el registro');
      } else if (error.request) {
        throw new Error('Error de conexión. Verifique su red.');
      } else {
        throw new Error(error.message || 'Error desconocido');
      }
    }
  }

  /**
   * Obtener token del localStorage
   * @returns Token JWT o null
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('[AuthService] Error getting token:', error);
      return null;
    }
  }

  /**
   * Guardar token en localStorage
   * @param token - Token JWT
   */
  private setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('[AuthService] Error setting token:', error);
    }
  }

  /**
   * Obtener userId del localStorage
   * @returns userId o null
   */
  getUserId(): string | null {
    try {
      return localStorage.getItem(this.USER_ID_KEY);
    } catch (error) {
      console.error('[AuthService] Error getting userId:', error);
      return null;
    }
  }

  /**
   * Guardar userId en localStorage
   * @param userId - ID del usuario
   */
  private setUserId(userId: string): void {
    try {
      localStorage.setItem(this.USER_ID_KEY, userId);
    } catch (error) {
      console.error('[AuthService] Error setting userId:', error);
    }
  }

  /**
   * Obtener datos del usuario del localStorage
   * @returns Datos del usuario o null
   */
  getUser(): any | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('[AuthService] Error getting user:', error);
      return null;
    }
  }

  /**
   * Guardar datos del usuario en localStorage
   * @param user - Datos del usuario
   */
  private setUser(user: any): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('[AuthService] Error setting user:', error);
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns true si está autenticado, false si no
   */
  isAuthenticated(): boolean {
    try {
      const token = this.getToken();
      
      if (!token || token.trim() === '') {
        console.log('[AuthService] No token found');
        return false;
      }

      // Verificar estructura del token JWT
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('[AuthService] Invalid token structure');
        this.logout();
        return false;
      }

      // Decodificar JWT para verificar expiración
      const payload = this.decodeToken(token);
      if (!payload) {
        console.log('[AuthService] Failed to decode token');
        this.logout();
        return false;
      }

      // Verificar expiración
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = payload.exp;
      
      if (!expirationTime) {
        console.log('[AuthService] Token has no expiration');
        return true; // Tokens sin expiración se consideran válidos
      }

      // Considerar válido si falta menos de 5 minutos para expirar
      const timeUntilExpiry = expirationTime - currentTime;
      const isExpired = timeUntilExpiry <= 0;
      const isNearExpiry = timeUntilExpiry <= 300; // 5 minutos
      
      if (isNearExpiry && !isExpired) {
        console.log('[AuthService] Token expires soon, consider refreshing');
        // TODO: Implementar refresh token cuando el backend lo soporte
      }
      
      if (isExpired) {
        console.log('[AuthService] Token expired, clearing session');
        this.logout();
        return false;
      }

      console.log('[AuthService] Token is valid');
      return true;
    } catch (error) {
      console.error('[AuthService] Error validating token:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Decodificar token JWT
   * @param token - Token JWT
   * @returns Payload decodificado o null
   */
  private decodeToken(token: string): JWTPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('[AuthService] Error decoding token:', error);
      return null;
    }
  }

  /**
   * Extraer userId del token JWT
   * @param token - Token JWT
   * @returns userId o null
   */
  private extractUserIdFromToken(token: string): string | null {
    try {
      const payload = this.decodeToken(token);
      return payload?.userId || payload?.sub || null;
    } catch (error) {
      console.error('[AuthService] Error extracting userId from token:', error);
      return null;
    }
  }

  /**
   * Cerrar sesión y limpiar localStorage
   */
  logout(): void {
    try {
      console.log('[AuthService] Logging out...');
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_ID_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('[AuthService] Error during logout:', error);
    }
  }

  /**
   * Validar si un string es UUID válido
   */
  private isValidUUID(uuid: string | null): boolean {
    if (!uuid) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Generar UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Verificar si el token está por expirar (opcional: refresh token)
   * @returns true si está por expirar en menos de 5 minutos
   */
  isTokenExpiringSoon(): boolean {
    try {
      const token = this.getToken();
      if (!token) return false;

      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) return false;

      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;
      
      return timeUntilExpiry <= 300 && timeUntilExpiry > 0; // Menos de 5 minutos
    } catch (error) {
      console.error('[AuthService] Error checking token expiry:', error);
      return false;
    }
  }
}

export default new AuthService();
