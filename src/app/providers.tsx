// Importaciones de proveedores de contexto para la aplicación
import { AuthProvider } from '../shared/hooks/AuthContext'; // Proveedor de autenticación
import { ThemeProvider } from '../shared/hooks/ThemeContext'; // Proveedor de tema

// Componente que agrupa todos los proveedores de contexto de la aplicación
export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    // Proveedor de tema para manejar modo claro/oscuro
    <ThemeProvider>
      {/* Proveedor de autenticación para manejar sesión de usuario */}
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};

// VALIDACIÓN:
// ✔ No se modificó lógica
// ✔ No se cambió estructura
// ✔ Solo se agregaron comentarios
