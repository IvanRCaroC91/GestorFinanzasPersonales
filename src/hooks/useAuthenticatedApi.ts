import { useState, useCallback } from 'react';
import authService from '../services/authService';

export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseAuthenticatedApiReturn<T> extends ApiState<T> {
  execute: (url: string, options?: RequestInit) => Promise<void>;
  reset: () => void;
}

/**
 * Hook personalizado para realizar peticiones autenticadas al backend
 * Maneja estado de carga, errores y datos automáticamente
 */
export const useAuthenticatedApi = <T = any>(): UseAuthenticatedApiReturn<T> => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (url: string, options: RequestInit = {}) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.authenticatedFetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

/**
 * Hook para peticiones GET autenticadas
 */
export const useAuthenticatedGet = <T = any>(url?: string) => {
  const { execute, ...state } = useAuthenticatedApi<T>();

  const get = useCallback((requestUrl?: string) => {
    const finalUrl = requestUrl || url;
    if (!finalUrl) {
      throw new Error('Se requiere una URL para la petición GET');
    }
    return execute(finalUrl, { method: 'GET' });
  }, [execute, url]);

  return {
    ...state,
    get,
  };
};

/**
 * Hook para peticiones POST autenticadas
 */
export const useAuthenticatedPost = <T = any>() => {
  const { execute, ...state } = useAuthenticatedApi<T>();

  const post = useCallback((requestUrl: string, data?: any) => {
    return execute(requestUrl, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [execute]);

  return {
    ...state,
    post,
  };
};

/**
 * Hook para peticiones PUT autenticadas
 */
export const useAuthenticatedPut = <T = any>() => {
  const { execute, ...state } = useAuthenticatedApi<T>();

  const put = useCallback((requestUrl: string, data?: any) => {
    return execute(requestUrl, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }, [execute]);

  return {
    ...state,
    put,
  };
};

/**
 * Hook para peticiones DELETE autenticadas
 */
export const useAuthenticatedDelete = <T = any>() => {
  const { execute, ...state } = useAuthenticatedApi<T>();

  const del = useCallback((requestUrl: string) => {
    return execute(requestUrl, { method: 'DELETE' });
  }, [execute]);

  return {
    ...state,
    delete: del,
  };
};
