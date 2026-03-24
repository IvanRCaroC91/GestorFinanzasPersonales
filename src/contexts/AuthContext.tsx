import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';

// Props para el provider
interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

// Provider del contexto de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const isAuthenticated = authService.isAuthenticated();
        if (isAuthenticated) {
          const userData = authService.getUser();
          setUser(userData);
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
  const login = async (credentials: { username: string; password: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('[AuthContext] Login attempt:', credentials.username);
      const response = await authService.login(credentials);
      console.log('[AuthContext] AuthService response:', response);
      
      if (response.success) {
        console.log('[AuthContext] Login successful, setting user:', response.user);
        setUser(response.user);
        return { success: true };
      } else {
        console.log('[AuthContext] Login failed:', response.message);
        return { success: false, message: response.message || 'Error en el inicio de sesión' };
      }
    } catch (error: any) {
      console.error('[AuthContext] Login error:', error);
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
