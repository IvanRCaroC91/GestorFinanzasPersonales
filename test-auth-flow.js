// Test para validar el flujo de autenticación corregido
console.log('🔍 TEST DE FLUJO DE AUTENTICACIÓN CORREGIDO');
console.log('==============================================');

// 1. Simular token expirado
console.log('\n1️⃣ Simulando token expirado...');
const expiredToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY3NDM5MzI2MSwiZXhwIjoxNjc0Mzk2ODYxfQ.Vy4dONWGIGJOCg504qbxtayzJM82BLKEkXPfT2-01Hg';
localStorage.setItem('token', expiredToken);
localStorage.setItem('userId', 'test-user-id');
localStorage.setItem('user', JSON.stringify({ id: 'test-user-id', username: 'test' }));

console.log('📋 Token expirado guardado en localStorage');

// 2. Importar authService para probar validación
import('./src/services/authService.js').then(({ default: authService }) => {
  console.log('\n2️⃣ Probando authService.isAuthenticated()...');
  
  const isValid = authService.isAuthenticated();
  console.log('🔍 Resultado isValid:', isValid);
  console.log('📋 Estado localStorage después de validación:');
  console.log('   - token:', localStorage.getItem('token') || 'ELIMINADO');
  console.log('   - userId:', localStorage.getItem('userId') || 'ELIMINADO');
  console.log('   - user:', localStorage.getItem('user') || 'ELIMINADO');
  
  if (!isValid) {
    console.log('✅ Token expirado detectado correctamente');
  } else {
    console.log('❌ Token expirado NO detectado');
  }
  
  console.log('\n3️⃣ Probando token válido...');
  
  // 3. Simular token válido
  const validToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc3NDM5MzQ5NiwiZXhwIjoxNzc0NDc5ODk2fQ.Vy4dONWGIGJOCg504qbxtayzJM82BLKEkXPfT2-01Hg';
  localStorage.setItem('token', validToken);
  localStorage.setItem('userId', 'valid-user-id');
  localStorage.setItem('user', JSON.stringify({ id: 'valid-user-id', username: 'admin' }));
  
  console.log('📋 Token válido guardado en localStorage');
  
  const isValid2 = authService.isAuthenticated();
  console.log('🔍 Resultado isValid2:', isValid2);
  console.log('📋 Estado localStorage después de validación:');
  console.log('   - token:', localStorage.getItem('token') || 'ELIMINADO');
  console.log('   - userId:', localStorage.getItem('userId') || 'ELIMINADO');
  console.log('   - user:', localStorage.getItem('user') || 'ELIMINADO');
  
  if (isValid2) {
    console.log('✅ Token válido detectado correctamente');
  } else {
    console.log('❌ Token válido NO detectado');
  }
  
  console.log('\n==============================================');
  console.log('🎯 TEST COMPLETADO');
}).catch(err => {
  console.error('❌ Error importando authService:', err);
});
