import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import type { User, AuthContextType, LoginRequest } from '../types';

// Props para el provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider del contexto de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const isAuthenticated = authService.isAuthenticated();
        if (isAuthenticated) {
          // Aquí podrías decodificar el token para obtener información del usuario
          // Por ahora, simplemente marcamos como autenticado
          setUser({ username: 'user' }); // Esto se puede mejorar decodificando el JWT
        }
      } catch (error) {
        console.error('Error verificando estado de autenticación:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Función para iniciar sesión
   * @param credentials - Credenciales del usuario
   * @returns Resultado del login
   */
  const login = async (credentials: LoginRequest): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        setUser({ username: credentials.username });
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Error en el inicio de sesión' };
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Credenciales inválidas';
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Función para cerrar sesión
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
