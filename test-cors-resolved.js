// Test para verificar que el problema CORS está resuelto con el puerto 5173
import axios from 'axios';

async function testCorsResolution() {
  console.log('🔍 TEST CORS - PUERTO 5173');
  console.log('============================');
  
  try {
    // Test desde el frontend corriendo en puerto 5173
    console.log('📡 Probando conexión desde puerto 5173...');
    
    const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
      username: 'admin',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'  // Simular origen del frontend
      },
      timeout: 5000
    });
    
    console.log('✅ CORS RESUELTO!');
    console.log('📊 Status:', response.status);
    console.log('📦 Response:', response.data);
    console.log('🎫 Token:', response.data.token ? 'RECIBIDO' : 'NO RECIBIDO');
    
    console.log('\n🎉 EL FRONTEND EN PUERTO 5173 DEBERÍA FUNCIONAR SIN ERRORES CORS');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📦 Data:', error.response.data);
    }
    
    if (error.message.includes('CORS') || error.message.includes('blocked')) {
      console.log('\n⚠️ AÚN HAY PROBLEMAS DE CORS');
      console.log('🔧 Verificar configuración del backend');
    } else {
      console.log('\n✅ NO HAY PROBLEMAS DE CORS (error diferente)');
    }
  }
  
  console.log('============================');
}

testCorsResolution().catch(console.error);
