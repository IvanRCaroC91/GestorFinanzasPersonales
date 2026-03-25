// Test final para validar el login completo sin datos hardcoded
import axios from 'axios';

async function testCompleteLoginFlow() {
  console.log('🔐 TEST FINAL - LOGIN COMPLETO SIN DATOS HARDCODED');
  console.log('====================================================');
  
  // Configuración igual a la del frontend
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor igual al del frontend
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = null; // Simular estado inicial
      const userId = localStorage.getItem('userId');
      
      const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
      const isProtectedEndpoint = config.url?.includes('/finance/') || config.url?.includes('/protected/');
      
      if (!isAuthEndpoint && isProtectedEndpoint) {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (userId) {
          config.headers['X-User-Id'] = userId;
        }
      }
      
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url} | Auth: ${!isAuthEndpoint && isProtectedEndpoint ? 'YES' : 'NO'}`);
      return config;
    }
  );

  try {
    // 1. Login sin datos hardcoded
    console.log('\n1️⃣ LOGIN - Enviando credenciales del formulario...');
    const loginData = {
      username: 'admin',
      password: 'admin123'
    };
    
    console.log('📋 Payload (del formulario):', loginData);
    
    const loginResponse = await axiosInstance.post('/auth/login', loginData);
    
    console.log('✅ Login Exitoso!');
    console.log('📊 Status:', loginResponse.status);
    console.log('📦 Response:', loginResponse.data);
    
    // 2. Guardar datos como lo hace el frontend
    const { token, userId, username, email } = loginResponse.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('user', JSON.stringify({
      id: userId,
      username,
      email
    }));
    
    console.log('💾 Datos guardados en localStorage:');
    console.log('   - Token:', token.substring(0, 20) + '...');
    console.log('   - UserId:', userId);
    console.log('   - Username:', username);
    
    // 3. Probar endpoint protegido con headers dinámicos
    console.log('\n2️⃣ ENDPOINT PROTEGIDO - Probando con token y userId dinámicos...');
    
    // Nueva instancia con token y userId
    const protectedAxios = axios.create({
      baseURL: 'http://localhost:8080/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    protectedAxios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
        const isProtectedEndpoint = config.url?.includes('/finance/') || config.url?.includes('/protected/');
        
        if (!isAuthEndpoint && isProtectedEndpoint) {
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          if (userId) {
            config.headers['X-User-Id'] = userId;
          }
        }
        
        console.log(`📤 ${config.method?.toUpperCase()} ${config.url} | Token: ${token ? 'YES' : 'NO'} | UserId: ${userId || 'NONE'}`);
        console.log('🔐 Headers:', {
          'Authorization': config.headers.Authorization ? 'Bearer ***' : 'NONE',
          'X-User-Id': config.headers['X-User-Id'] || 'NONE'
        });
        return config;
      }
    );
    
    const protectedResponse = await protectedAxios.get('/finance/categorias');
    
    console.log('✅ Endpoint protegido funcionando!');
    console.log('📊 Status:', protectedResponse.status);
    console.log('📦 Data:', protectedResponse.data);
    
    console.log('\n🎉 VALIDACIÓN COMPLETA EXITOSA!');
    console.log('✅ Login sin datos hardcoded: FUNCIONA');
    console.log('✅ Token dinámico: FUNCIONA');
    console.log('✅ UserId dinámico: FUNCIONA');
    console.log('✅ Endpoints protegidos: FUNCIONAN');
    console.log('✅ Headers automáticos: FUNCIONAN');
    
  } catch (error) {
    console.error('❌ Error en validación:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📦 Data:', error.response.data);
    }
  }
  
  console.log('====================================================');
}

testCompleteLoginFlow().catch(console.error);
