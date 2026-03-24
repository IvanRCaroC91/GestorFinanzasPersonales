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
  private readonly userId = '1454bf34-4592-48e1-9653-5479c839dc0f';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post('/api/v1/auth/login', credentials);
      const data = response.data;

      console.log('[AuthService] Response data:', data);

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', this.userId);
        
        // Si no hay user en la respuesta, crear uno básico
        const userData = data.user || { 
          id: this.userId, 
          username: credentials.username,
          email: ''
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
      const response = await axiosInstance.post('/api/v1/auth/register', userData);
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
    return localStorage.getItem('userId') || this.userId;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
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
