import axios from 'axios';
import authService from '../services/authService';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Lista de endpoints que no requieren autenticación
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/health',
  '/public'
];

// Lista de endpoints que requieren headers especiales
const PROTECTED_ENDPOINTS = [
  '/finance/',
  '/protected/',
  '/user/',
  '/admin/'
];

// Función para determinar si un endpoint es público
const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Función para determinar si un endpoint requiere headers especiales
const isProtectedEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return PROTECTED_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

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
    const url = config.url || '';
    const shouldAddAuth = !isPublicEndpoint(url) && isProtectedEndpoint(url);
    
    if (shouldAddAuth) {
      const token = authService.getToken();
      const userId = authService.getUserId();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      if (userId) {
        config.headers['X-User-Id'] = userId;
      }
    }
    
    console.log(`[API] ${config.method?.toUpperCase()} ${url} | Auth: ${shouldAddAuth ? 'YES' : 'NO'} | UserId: ${authService.getUserId() || 'NONE'}`);
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
    const url = config?.url || 'unknown';
    
    if (response) {
      const { status, data } = response;
      
      console.error(`[API ERROR] ${config?.method?.toUpperCase()} ${url} → ${status}: ${data?.message || 'Unknown error'}`);
      
      // Manejar errores de autenticación
      if (status === 401 || status === 403) {
        console.log(`[API] ${status === 401 ? 'Unauthorized' : 'Forbidden'} - clearing session`);
        authService.logout();
        
        // Evitar redirección infinita
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
      
      // Manejar otros errores HTTP
      switch (status) {
        case 400:
          console.error('[API] Bad Request - validation error');
          break;
        case 404:
          console.error('[API] Not Found - resource does not exist');
          break;
        case 429:
          console.error('[API] Too Many Requests - rate limit exceeded');
          break;
        case 500:
          console.error('[API] Server Error - internal server error');
          break;
        case 502:
        case 503:
        case 504:
          console.error('[API] Service Unavailable - server down');
          break;
        default:
          console.error(`[API] Unhandled error: ${status}`);
      }
    } else if (request) {
      console.error('[API ERROR] No response received:', request);
      // Error de red o conexión
      if (request.code === 'ECONNABORTED') {
        console.error('[API] Request timeout');
      } else if (request.code === 'ERR_NETWORK') {
        console.error('[API] Network error');
      }
    } else {
      console.error('[API ERROR] Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
