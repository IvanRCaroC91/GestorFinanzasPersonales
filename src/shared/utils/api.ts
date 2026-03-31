// Constantes para las URLs de la API del backend Spring Boot

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  
  // Usuarios
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  },
  
  // Finanzas
  TRANSACTIONS: {
    LIST: `${API_BASE_URL}/transactions`,
    CREATE: `${API_BASE_URL}/transactions`,
    UPDATE: (id: string) => `${API_BASE_URL}/transactions/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/transactions/${id}`,
  },
  
  CATEGORIES: {
    LIST: `${API_BASE_URL}/categories`,
    CREATE: `${API_BASE_URL}/categories`,
    UPDATE: (id: string) => `${API_BASE_URL}/categories/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/categories/${id}`,
  },
  
  BUDGETS: {
    LIST: `${API_BASE_URL}/budgets`,
    CREATE: `${API_BASE_URL}/budgets`,
    UPDATE: (id: string) => `${API_BASE_URL}/budgets/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/budgets/${id}`,
  },
  
  REPORTS: {
    SUMMARY: `${API_BASE_URL}/reports/summary`,
    MONTHLY: `${API_BASE_URL}/reports/monthly`,
    CATEGORY: `${API_BASE_URL}/reports/category`,
  },
} as const;

export default API_ENDPOINTS;
