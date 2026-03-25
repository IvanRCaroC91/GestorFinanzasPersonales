// Script para probar el login exactamente como lo hace el formulario
// Simula el comportamiento del frontend con el interceptor corregido

import axios from 'axios';

// Crear instancia de axios igual que la del frontend
const axiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor corregido (igual que en axiosConfig.ts)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const userId = '1454bf34-4592-48e1-9653-5479c839dc0f';
    
    // Determinar si el endpoint requiere autenticación
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
    const isProtectedEndpoint = config.url?.includes('/finance/') || config.url?.includes('/protected/');
    
    // Solo agregar headers en endpoints protegidos (no en login/register)
    if (!isAuthEndpoint && isProtectedEndpoint) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['X-User-Id'] = userId;
    }
    
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url} | Auth: ${!isAuthEndpoint && isProtectedEndpoint ? 'YES' : 'NO'}`);
    console.log(`[API] Headers enviados:`, config.headers);
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
    } else if (request) {
      console.error('[API ERROR] No response received:', request);
    } else {
      console.error('[API ERROR] Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

async function testLoginForm() {
  console.log('🔐 Probando Login con Interceptor Corregido');
  console.log('==========================================');
  
  // Limpiar cualquier token existente para simular estado inicial
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  try {
    // Login exactamente como lo hace el formulario
    console.log('📤 Enviando login con solo username y password...');
    
    const loginData = {
      username: 'admin',
      password: 'admin123'
    };
    
    console.log('📋 Payload:', loginData);
    
    const response = await axiosInstance.post('/auth/login', loginData);
    
    console.log('✅ Login Exitoso!');
    console.log('📊 Status:', response.status);
    console.log('📦 Response Data:', response.data);
    
    // Verificar que el token se guardó correctamente
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('💾 Token guardado en localStorage');
    }
    
    // Probar una petición protegida para verificar que el token funciona
    console.log('\n🔒 Probando endpoint protegido con token...');
    
    const protectedResponse = await axiosInstance.get('/finance/categorias');
    
    console.log('✅ Endpoint protegido funcionando!');
    console.log('📊 Status:', protectedResponse.status);
    console.log('📦 Data:', protectedResponse.data);
    
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📦 Data:', error.response.data);
    }
  }
  
  console.log('==========================================');
}

// Ejecutar test
testLoginForm().catch(console.error);
