// Utilidad para probar la conexión con el backend
import axiosInstance from '../services/axiosConfig';

// Interfaz para resultados del test de conexión
export interface ConnectionTestResult {
  success: boolean;
  services: {
    auth: boolean;
    finance: boolean;
    gateway: boolean;
  };
  errors: string[];
  timestamp: string;
}

// Función principal para probar la conexión con el backend
export const testBackendConnection = async (): Promise<ConnectionTestResult> => {
  // Inicializar resultado con valores por defecto
  const result: ConnectionTestResult = {
    success: true,
    services: {
      auth: false,
      finance: false,
      gateway: false
    },
    errors: [],
    timestamp: new Date().toISOString()
  };

  try {
    // Test 1: Health check del API Gateway
    console.log('🔍 Testing API Gateway health...');
    try {
      const gatewayResponse = await axiosInstance.get('/actuator/health', { timeout: 5000 });
      if (gatewayResponse.status === 200) {
        result.services.gateway = true;
        console.log('✅ API Gateway is healthy');
      }
    } catch (error: any) {
      result.errors.push(`API Gateway: ${error.message}`);
      console.error('❌ API Gateway health check failed:', error.message);
    }

    // Test 2: Health check del Auth Service (a través del gateway)
    console.log('🔍 Testing Auth Service...');
    try {
      const authResponse = await axiosInstance.post('/auth/login', 
        { username: 'test', password: 'test' }, 
        { timeout: 5000 }
      );
      // No esperamos éxito, solo que el servicio responda
      if (authResponse.status === 200 || authResponse.status === 401) {
        result.services.auth = true;
        console.log('✅ Auth Service is responding');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        result.services.auth = true;
        console.log('✅ Auth Service is responding (401 = service is up)');
      } else {
        result.errors.push(`Auth Service: ${error.message}`);
        console.error('❌ Auth Service test failed:', error.message);
      }
    }

    // Test 3: Health check del Finance Service (a través del gateway)
    console.log('🔍 Testing Finance Service...');
    try {
      const financeResponse = await axiosInstance.get('/finance/categorias', { timeout: 5000 });
      if (financeResponse.status === 200 || financeResponse.status === 401) {
        result.services.finance = true;
        console.log('✅ Finance Service is responding');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        result.services.finance = true;
        console.log('✅ Finance Service is responding (401 = service is up, needs auth)');
      } else {
        result.errors.push(`Finance Service: ${error.message}`);
        console.error('❌ Finance Service test failed:', error.message);
      }
    }

  } catch (error: any) {
    result.errors.push(`General connection error: ${error.message}`);
    result.success = false;
  }

  // Determinar éxito general
  result.success = result.services.gateway && result.services.auth && result.services.finance;

  return result;
};

// Función para ejecutar el test y mostrar resultados en consola
export const runConnectionTest = async () => {
  console.log('🚀 Starting backend connection test...');
  console.log('=====================================');
  
  const result = await testBackendConnection();
  
  console.log('📊 TEST RESULTS:');
  console.log('=====================================');
  console.log(`🕐 Timestamp: ${result.timestamp}`);
  console.log(`🎯 Overall Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log('');
  console.log('🔧 Services Status:');
  console.log(`   API Gateway: ${result.services.gateway ? '✅ UP' : '❌ DOWN'}`);
  console.log(`   Auth Service: ${result.services.auth ? '✅ UP' : '❌ DOWN'}`);
  console.log(`   Finance Service: ${result.services.finance ? '✅ UP' : '❌ DOWN'}`);
  
  if (result.errors.length > 0) {
    console.log('');
    console.log('⚠️ Errors:');
    result.errors.forEach(error => console.log(`   • ${error}`));
  }
  
  console.log('=====================================');
  
  return result;
};

export default { testBackendConnection, runConnectionTest };
