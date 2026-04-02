import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
    });

    const updateState = useCallback((updates: Partial<AuthState>) => {
        console.log('[AuthContext] updateState called with:', updates);
        setState(prev => {
            const newState = { ...prev, ...updates };
            console.log('[AuthContext] New state:', newState);
            return newState;
        });
    }, []);

    useEffect(() => {
        // 🔹 FORZAR logout al iniciar la app (solo una vez)
        console.log('[AuthContext] Inicializando AuthContext');
        const token = authService.getToken();
        if (token) {
            // Si hay token, verificar si es válido
            const isValid = authService.isAuthenticated();
            if (!isValid) {
                console.log('[AuthContext] Token inválido, haciendo logout');
                authService.logout();
                updateState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            } else {
                console.log('[AuthContext] Token válido, cargando datos de usuario');
                const user = authService.getUser();
                updateState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            }
        } else {
            console.log('[AuthContext] No hay token, estableciendo estado inicial');
            updateState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
    }, [updateState]);

    // Procesa el formulario de login y autentica al usuario con el backend.
    // Actualiza el estado global con los datos del usuario si el login es exitoso.
    const login = useCallback(async (credentials: { username: string; password: string }) => {
        try {
            updateState({ isLoading: true, error: null });
            const response = await authService.login(credentials);

            if (response.success && response.user) {
                updateState({
                    user: response.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
                return { success: true };
            } else {
                const errorMessage = response.message || 'Credenciales inválidas';
                updateState({ isLoading: false, error: errorMessage });
                return { success: false, message: errorMessage };
            }
        } catch (error: any) {
            console.error('[AuthContext] Login error caught:', error);
            const errorMessage = error.message || 'Error de conexión';
            console.log('[AuthContext] Setting error message:', errorMessage);
            updateState({ isLoading: false, error: errorMessage });
            return { success: false, message: errorMessage };
        }
    }, [updateState]);

    const logout = useCallback(() => {
        authService.logout();
        updateState({ user: null, isAuthenticated: false, isLoading: false, error: null });
        if (typeof window !== 'undefined') window.location.href = '/login';
    }, [updateState]);

    const clearError = useCallback(() => updateState({ error: null }), [updateState]);

    const refreshToken = useCallback(async (): Promise<boolean> => {
        try {
            const isValid = authService.isAuthenticated();
            if (!isValid) logout();
            return isValid;
        } catch {
            logout();
            return false;
        }
    }, [logout]);

    return (
        <AuthContext.Provider value={{ ...state, login, logout, clearError, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    return context;
};

export default AuthContext;
