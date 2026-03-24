import axiosInstance from '../api/axiosConfig';

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
  };
}

class AuthService {
  // No más UUID hardcoded - todo viene del backend

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const data = response.data;

      console.log('[AuthService] Response data:', data);

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        
        // Usar el userId del backend
        const userId = data.userId || data.user?.id;
        if (userId) {
          localStorage.setItem('userId', userId);
        }
        
        // Crear userData con información del backend
        const userData = {
          id: userId,
          username: data.username || credentials.username,
          email: data.email || data.user?.email || '',
          nombreCompleto: data.nombreCompleto || '',
          iniciales: data.iniciales || ''
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Asegurar que el response siempre tenga user
        data.user = userData;
        
        console.log('[AuthService] User data stored:', userData);
      }

      return data;
    } catch (error: any) {
      console.error('[AuthService] Login error:', error);
      throw error;
    }
  }

  async register(userData: any): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('[AuthService] Register error:', error);
      throw error;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token || token === '') {
      return false;
    }

    try {
      // Decodificar JWT para verificar expiración
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Verificar si el token ha expirado
      if (payload.exp && payload.exp < currentTime) {
        console.log('[AuthService] Token expired, clearing localStorage');
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[AuthService] Error validating token:', error);
      this.logout();
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
  }

  getUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();
