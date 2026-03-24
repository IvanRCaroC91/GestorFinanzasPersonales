import axios from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const userId = '1454bf34-4592-48e1-9653-5479c839dc0f';
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers['X-User-Id'] = userId;
    
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
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
