import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';

// Tipos mejorados
interface User {
  id: string;
  username: string;
  email: string;
  nombreCompleto?: string;
  iniciales?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  clearError: () => void;
  refreshToken: () => Promise<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Crear el contexto PRIMERO (antes de usarlo)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contexto de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Función para actualizar estado de forma inmutable
  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('[AuthContext] Initializing authentication...');
        
        if (authService.isAuthenticated()) {
          const userData = authService.getUser();
          if (userData) {
            console.log('[AuthContext] User authenticated:', userData);
            updateState({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            console.log('[AuthContext] Token exists but no valid user data');
            authService.logout();
            updateState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } else {
          console.log('[AuthContext] No valid authentication found');
          updateState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error);
        updateState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Error al verificar autenticación',
        });
      }
    };

    initializeAuth();
  }, [updateState]);

  /**
   * Función para iniciar sesión
   * @param credentials - Credenciales del usuario
   * @returns Resultado del login
   */
  const login = useCallback(async (credentials: { username: string; password: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('[AuthContext] Attempting login...');
      updateState({ isLoading: true, error: null });
      
      const response = await authService.login(credentials);
      console.log('[AuthContext] Login response:', response);
      
      if (response.success && response.user) {
        console.log('[AuthContext] Login successful');
        updateState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        const errorMessage = response.message || 'Credenciales inválidas';
        console.log('[AuthContext] Login failed:', errorMessage);
        updateState({
          isLoading: false,
          error: errorMessage,
        });
        return { success: false, message: errorMessage };
      }
    } catch (error: any) {
      console.error('[AuthContext] Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, message: errorMessage };
    }
  }, [updateState]);

  /**
   * Función para cerrar sesión
   */
  const logout = useCallback(() => {
    console.log('[AuthContext] Logging out...');
    authService.logout();
    updateState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    // 🔧 CLAVE: Forzar redirección para evitar loops
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, [updateState]);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  /**
   * Refrescar token (placeholder para refresh token futuro)
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      // TODO: Implementar refresh token cuando el backend lo soporte
      const isValid = authService.isAuthenticated();
      if (!isValid) {
        logout();
      }
      return isValid;
    } catch (error) {
      console.error('[AuthContext] Error refreshing token:', error);
      logout();
      return false;
    }
  }, [logout]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
