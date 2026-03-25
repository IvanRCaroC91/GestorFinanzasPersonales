// Script para probar conexión con el backend
// Ejecutar con: node test-connection.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

async function testConnection() {
  console.log('🚀 Iniciando prueba de conexión con el backend...');
  console.log('=====================================');
  
  const tests = [
    {
      name: 'API Gateway Health Check',
      url: 'http://localhost:8080/actuator/health',
      method: 'GET'
    },
    {
      name: 'Auth Service Test',
      url: `${API_BASE_URL}/auth/login`,
      method: 'POST',
      data: { username: 'test', password: 'test' }
    },
    {
      name: 'Finance Service Test',
      url: `${API_BASE_URL}/finance/categorias`,
      method: 'GET'
    }
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`🔍 Probando: ${test.name}`);
      const config = {
        method: test.method,
        url: test.url,
        timeout: 5000,
        ...(test.data && { data: test.data })
      };

      const response = await axios(config);
      
      results.push({
        name: test.name,
        status: '✅ UP',
        statusCode: response.status,
        message: 'Service is responding'
      });
      
      console.log(`✅ ${test.name}: ${response.status}`);
      
    } catch (error) {
      const statusCode = error.response?.status || 'NO_RESPONSE';
      const isServiceUp = statusCode === 401 || statusCode === 403;
      
      results.push({
        name: test.name,
        status: isServiceUp ? '✅ UP' : '❌ DOWN',
        statusCode: statusCode,
        message: error.message
      });
      
      console.log(`${isServiceUp ? '✅' : '❌'} ${test.name}: ${statusCode} - ${error.message}`);
    }
  }

  console.log('=====================================');
  console.log('📊 RESULTADOS:');
  
  const allUp = results.every(r => r.status.includes('UP'));
  console.log(`🎯 Estado General: ${allUp ? '✅ SISTEMA OPERATIVO' : '❌ HAY PROBLEMAS'}`);
  
  console.log('');
  console.log('🔧 Detalle:');
  results.forEach(result => {
    console.log(`   ${result.status} ${result.name}: ${result.statusCode}`);
  });

  console.log('=====================================');
  
  if (allUp) {
    console.log('🎉 ¡Todos los servicios están operativos!');
    console.log('📱 El frontend debería poder conectarse correctamente.');
    console.log('🌐 Abre http://localhost:5173/ para usar la aplicación.');
  } else {
    console.log('⚠️ Hay servicios que no responden.');
    console.log('🔧 Verifica que todos los microservicios estén corriendo.');
  }
}

// Ejecutar prueba
testConnection().catch(console.error);
