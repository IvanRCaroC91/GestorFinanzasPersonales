// Test simple para validar el interceptor de login
import axios from 'axios';

async function testLoginInterceptor() {
  console.log('🔐 Probando Interceptor de Login');
  console.log('==============================');
  
  // Crear instancia con interceptor corregido
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor corregido
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = null; // Simular estado inicial sin token
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
      
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
      console.log(`🔐 Auth Headers: ${!isAuthEndpoint && isProtectedEndpoint ? 'YES' : 'NO'}`);
      console.log(`📋 Headers enviados:`, Object.keys(config.headers));
      
      return config;
    },
    (error) => {
      console.error('[API ERROR] Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  try {
    console.log('\n🔑 Probando login SIN headers de autenticación...');
    
    const loginData = {
      username: 'admin',
      password: 'admin123'
    };
    
    console.log('📋 Payload:', loginData);
    
    const response = await axiosInstance.post('/auth/login', loginData);
    
    console.log('✅ Login Exitoso!');
    console.log('📊 Status:', response.status);
    console.log('📦 Response:', response.data);
    
    if (response.data.token) {
      console.log('🎫 Token recibido:', response.data.token.substring(0, 20) + '...');
    }
    
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📦 Data:', error.response.data);
      console.error('📋 Request Headers:', error.response.config.headers);
    }
  }
  
  console.log('\n==============================');
}

testLoginInterceptor().catch(console.error);
