// Script para limpiar datos de autenticación del localStorage
console.log('🧹 Limpiando datos de autenticación...');

// Limpiar todos los datos de autenticación
localStorage.removeItem('token');
localStorage.removeItem('userId');
localStorage.removeItem('user');
localStorage.removeItem('authToken'); // Por si existe

console.log('✅ Datos de autenticación eliminados');
console.log('🔄 Recarga la página para ver el login');

// Verificar que se eliminaron
console.log('📋 Estado actual del localStorage:');
console.log('   - token:', localStorage.getItem('token') || 'ELIMINADO');
console.log('   - userId:', localStorage.getItem('userId') || 'ELIMINADO');
console.log('   - user:', localStorage.getItem('user') || 'ELIMINADO');
console.log('   - authToken:', localStorage.getItem('authToken') || 'ELIMINADO');

console.log('\n🎯 Ahora deberías ver la página de login');
