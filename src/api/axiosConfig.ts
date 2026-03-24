import axios from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/v1` : '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // userId dinámico del backend
    
    // Determinar si el endpoint requiere autenticación
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
    const isProtectedEndpoint = config.url?.includes('/finance/') || config.url?.includes('/protected/');
    
    // Solo agregar headers en endpoints protegidos (no en login/register)
    if (!isAuthEndpoint && isProtectedEndpoint) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (userId) {
        config.headers['X-User-Id'] = userId;
      }
    }
    
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url} | Auth: ${!isAuthEndpoint && isProtectedEndpoint ? 'YES' : 'NO'} | UserId: ${userId || 'NONE'}`);
    return config;
  },
  (error) => {
    console.error('[API ERROR] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} OK`);
    return response;
  },
  (error) => {
    const { response, request, config } = error;
    
    if (response) {
      const { status, data } = response;
      const url = config?.url || 'unknown';
      
      console.error(`[API ERROR] ${config?.method?.toUpperCase()} ${url} → ${status}: ${data?.message || 'Unknown error'}`);
      
      switch (status) {
        case 401:
          console.log('[API] Unauthorized - clearing session');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
          
        case 403:
          console.log('[API] Forbidden - clearing session');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
          
        case 500:
          console.error('[API] Server Error - controlled');
          break;
          
        default:
          console.error(`[API] Unhandled error: ${status}`);
      }
    } else if (request) {
      console.error('[API ERROR] No response received:', request);
    } else {
      console.error('[API ERROR] Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
