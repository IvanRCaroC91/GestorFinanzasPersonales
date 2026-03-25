// Script específico para probar el Auth Service
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

async function testAuthService() {
  console.log('🔐 Probando Auth Service en detalle...');
  console.log('=====================================');
  
  // Test 1: Health check directo
  try {
    console.log('🔍 Health check directo al Auth Service...');
    const response = await axios.get('http://localhost:8081/actuator/health', { timeout: 5000 });
    console.log(`✅ Auth Service Health: ${response.status} - ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.log(`❌ Auth Service Health: ${error.response?.status || 'NO_RESPONSE'} - ${error.message}`);
  }

  // Test 2: Login a través del gateway con diferentes payloads
  const loginTests = [
    {
      name: 'Login con credenciales válidas',
      data: { username: 'admin', password: 'admin123' }
    },
    {
      name: 'Login con credenciales de prueba',
      data: { username: 'test', password: 'test' }
    },
    {
      name: 'Login con payload mínimo',
      data: { username: 'user', password: 'pass' }
    }
  ];

  for (const test of loginTests) {
    try {
      console.log(`🔍 ${test.name}...`);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, test.data, { 
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ ${test.name}: ${response.status} - Token: ${response.data.token ? 'RECIBIDO' : 'NO RECIBIDO'}`);
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.response?.status || 'NO_RESPONSE'} - ${error.response?.data?.message || error.message}`);
      if (error.response?.data) {
        console.log(`   Data: ${JSON.stringify(error.response.data)}`);
      }
    }
  }

  // Test 3: Verificar endpoint de registro
  try {
    console.log('🔍 Probando endpoint de registro...');
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass123'
    }, { timeout: 5000 });
    console.log(`✅ Register endpoint: ${response.status}`);
  } catch (error) {
    console.log(`❌ Register endpoint: ${error.response?.status || 'NO_RESPONSE'} - ${error.response?.data?.message || error.message}`);
  }

  console.log('=====================================');
}

testAuthService().catch(console.error);
